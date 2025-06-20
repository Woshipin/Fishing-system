import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Clock,
  Fish,
  Timer,
  Calendar,
  MapPin,
  User,
  AlertCircle,
  CheckCircle,
  Loader,
  RefreshCw,
  Filter,
  Users,
  TrendingUp,
  Target
} from "lucide-react";

const FishingTimePage = () => {
  // --- 状态管理 (State Management) ---
  const [activeSessions, setActiveSessions] = useState([]);
  const [completedSessions, setCompletedSessions] = useState([]);
  const [tableMap, setTableMap] = useState({});
  const [durationMap, setDurationMap] = useState({});
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('active');

  // --- 辅助函数与回调 (Helper Functions & Callbacks) ---
  const formatTime = useCallback((seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const getHeaders = useCallback(() => {
    const token = "mock-token"; 
    return {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  }, []);

  const fetchActiveSessions = useCallback(async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/user-selected-durations/active`,
        {
          method: "GET",
          headers: getHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setActiveSessions(data);
    } catch (err) {
      console.error("Error fetching active sessions:", err);
      setError(`Failed to fetch active sessions: ${err.message}`);
    }
  }, [getHeaders]);

  const fetchCompletedSessions = useCallback(async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/user-selected-durations/completed`,
        {
          method: "GET",
          headers: getHeaders(),
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setCompletedSessions(data);
    } catch (err) {
      console.error("Error fetching completed sessions:", err);
      setError(`Failed to fetch completed sessions: ${err.message}`);
    }
  }, [getHeaders]);

  const fetchStaticData = useCallback(async () => {
    try {
      const [tablesResponse, durationsResponse] = await Promise.all([
        fetch("http://127.0.0.1:8000/api/table-numbers", { headers: getHeaders() }),
        fetch("http://127.0.0.1:8000/api/durations", { headers: getHeaders() })
      ]);

      if (!tablesResponse.ok || !durationsResponse.ok) {
        throw new Error("Failed to fetch static data");
      }
      
      const [tablesData, durationsData] = await Promise.all([
        tablesResponse.json(),
        durationsResponse.json(),
      ]);

      const tablesMap = tablesData.reduce((acc, table) => {
        acc[table.id] = `Table ${table.number}`;
        return acc;
      }, {});
      const durationsMap = durationsData.reduce((acc, duration) => {
        acc[duration.id] = { name: duration.name, seconds: duration.duration_seconds };
        return acc;
      }, {});
      
      setTableMap(tablesMap);
      setDurationMap(durationsMap);

    } catch (err) {
      console.error("Error fetching static data:", err);
      setError(`Failed to fetch static data: ${err.message}`);
    }
  }, [getHeaders]);

  const updateSessionStatus = useCallback(async (sessionId, status) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/user-selected-durations/${sessionId}/status`,
        {
          method: "PUT",
          headers: getHeaders(),
          body: JSON.stringify({ status }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (err) {
      console.error("Error updating session status:", err);
    }
  }, [getHeaders]);

  const getRemainingTime = useCallback((endTime) => {
    const now = new Date();
    const end = new Date(endTime);
    return Math.max(0, Math.floor((end - now) / 1000));
  }, []);

  // --- 副作用钩子 (useEffect Hooks) ---
  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true);
        await Promise.all([
          fetchActiveSessions(),
          fetchCompletedSessions(),
          fetchStaticData()
        ]);
      } catch (err) {
        console.error("Initialization error:", err);
        setError(`Initialization error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (activeSessions.length === 0) {
      return;
    }
    
    const newlyCompletedSessions = [];
    const stillActiveSessions = [];

    activeSessions.forEach(session => {
      if (getRemainingTime(session.end_time) <= 0) {
        newlyCompletedSessions.push(session);
      } else {
        stillActiveSessions.push(session);
      }
    });

    if (newlyCompletedSessions.length > 0) {
      console.log(`Moving ${newlyCompletedSessions.length} sessions to completed state.`);

      newlyCompletedSessions.forEach(session => {
        updateSessionStatus(session.id, 'completed');
      });
      
      setActiveSessions(stillActiveSessions);
      setCompletedSessions(prevCompleted => [...newlyCompletedSessions, ...prevCompleted]);
    }
  }, [currentTime, activeSessions, getRemainingTime, updateSessionStatus]);

  const refreshData = useCallback(async () => {
    setRefreshing(true);
    setError(null);
    try {
      await Promise.all([
        fetchActiveSessions(),
        fetchCompletedSessions()
      ]);
    } catch (err) {
      console.error("Error refreshing data:", err);
      setError(`Failed to refresh data: ${err.message}`);
    } finally {
      setRefreshing(false);
    }
  }, [fetchActiveSessions, fetchCompletedSessions]);

  // --- 派生状态与渲染逻辑 (Derived State & Render Logic) ---
  const sessionsToDisplay = useMemo(() => {
    switch (filter) {
      case 'completed':
        return [...completedSessions].sort((a, b) => new Date(b.end_time) - new Date(a.end_time));
      case 'critical':
        return activeSessions.filter(session => {
          const remaining = getRemainingTime(session.end_time);
          return remaining > 0 && remaining <= 600;
        });
      case 'active':
      default:
        return activeSessions;
    }
  }, [filter, activeSessions, completedSessions, getRemainingTime]);

  const currentStats = useMemo(() => {
    const criticalCount = activeSessions.filter(session => {
      const remaining = getRemainingTime(session.end_time);
      return remaining > 0 && remaining <= 600;
    }).length;

    return {
      total: activeSessions.length + completedSessions.length,
      active: activeSessions.length,
      completed: completedSessions.length,
      critical: criticalCount
    };
  }, [activeSessions, completedSessions, getRemainingTime]);

  const getEmptyStateMessage = () => {
    switch(filter) {
        case 'active':
            return { title: "No Active Sessions", description: "All fishing spots are currently available." };
        case 'completed':
            return { title: "No Completed Sessions", description: "No fishing sessions have been completed yet." };
        case 'critical':
            return { title: "No Sessions in Critical Time", description: "No active sessions are ending in the next 10 minutes." };
        default:
            return { title: "No Sessions Found", description: "There are no sessions to display." };
    }
  }
  
  const emptyState = getEmptyStateMessage();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
            <Fish className="w-8 h-8 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <span className="text-lg font-medium text-gray-700">Loading fishing sessions...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Enhanced Header with subtle glow */}
      <div className="bg-white/85 backdrop-blur-md border border-white/60 shadow-[0_2px_20px_rgba(59,130,246,0.15)] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl border border-blue-300/30 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                <Fish className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Fishing Time Tracker
                </h1>
                <p className="text-gray-600 text-sm">Real-time session monitoring</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Enhanced time display with background and border */}
              <div className="px-4 py-2 bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200/80 rounded-xl shadow-[0_0_10px_rgba(148,163,184,0.2)] backdrop-blur-sm">
                <div className="text-sm font-medium text-slate-700">
                  {currentTime.toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="p-4 bg-red-50/90 backdrop-blur-sm border border-red-200/80 shadow-[0_0_15px_rgba(239,68,68,0.15)] rounded-2xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <span className="text-red-700 flex-1">{error}</span>
            <button
              onClick={() => setError(null)}
              className="text-red-500 hover:text-red-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Enhanced Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/75 backdrop-blur-sm rounded-2xl p-4 border border-blue-200/50 shadow-[0_0_20px_rgba(59,130,246,0.12)] hover:shadow-[0_0_25px_rgba(59,130,246,0.18)] transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Sessions</p>
                <p className="text-2xl font-bold text-gray-800">{currentStats.total}</p>
              </div>
              <div className="p-3 bg-blue-100/80 rounded-xl border border-blue-200/40">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white/75 backdrop-blur-sm rounded-2xl p-4 border border-green-200/50 shadow-[0_0_20px_rgba(34,197,94,0.12)] hover:shadow-[0_0_25px_rgba(34,197,94,0.18)] transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Active Now</p>
                <p className="text-2xl font-bold text-green-600">{currentStats.active}</p>
              </div>
              <div className="p-3 bg-green-100/80 rounded-xl border border-green-200/40">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white/75 backdrop-blur-sm rounded-2xl p-4 border border-indigo-200/50 shadow-[0_0_20px_rgba(99,102,241,0.12)] hover:shadow-[0_0_25px_rgba(99,102,241,0.18)] transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Completed</p>
                <p className="text-2xl font-bold text-indigo-600">{currentStats.completed}</p>
              </div>
              <div className="p-3 bg-indigo-100/80 rounded-xl border border-indigo-200/40">
                <CheckCircle className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white/75 backdrop-blur-sm rounded-2xl p-4 border border-red-200/50 shadow-[0_0_20px_rgba(239,68,68,0.12)] hover:shadow-[0_0_25px_rgba(239,68,68,0.18)] transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Critical Time</p>
                <p className="text-2xl font-bold text-red-600">{currentStats.critical}</p>
              </div>
              <div className="p-3 bg-red-100/80 rounded-xl border border-red-200/40">
                <Target className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Filter Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-600" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 bg-white/80 backdrop-blur-sm border border-slate-200/70 shadow-[0_0_10px_rgba(148,163,184,0.15)] rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300 transition-all duration-200"
              >
                <option value="active">Active Sessions</option>
                <option value="completed">Completed Sessions</option>
                <option value="critical">Critical Time (≤10 min)</option>
              </select>
            </div>
          </div>
          <button
            onClick={refreshData}
            disabled={refreshing}
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl font-medium border border-blue-400/30 shadow-[0_0_15px_rgba(59,130,246,0.25)] hover:shadow-[0_0_20px_rgba(59,130,246,0.35)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Enhanced Session Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sessionsToDisplay.map((session) => {
            const remaining = getRemainingTime(session.end_time);
            const isCritical = remaining > 0 && remaining <= 600;
            const isActive = remaining > 0;
            
            const totalDurationSeconds = durationMap[session.duration_id]?.seconds || 3600;
            const progressPercentage = isActive ? (remaining / totalDurationSeconds) * 100 : 0;
            
            return (
              <div
                key={session.id}
                className={`flex flex-col bg-white/85 backdrop-blur-sm rounded-2xl p-6 transition-all duration-300 border-2 ${
                  isCritical 
                    ? 'border-red-400/60 shadow-[0_0_20px_rgba(239,68,68,0.25)]' 
                    : isActive 
                    ? 'border-sky-400/60 shadow-[0_0_20px_rgba(59,182,246,0.2)]' 
                    : 'border-gray-400/60 shadow-[0_0_20px_rgba(31,41,55,0.15)]'
                } hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]`}
              >
                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-lg border ${
                        isCritical 
                          ? 'bg-red-50/80 border-red-200/50' 
                          : isActive 
                          ? 'bg-blue-50/80 border-blue-200/50' 
                          : 'bg-gray-50/80 border-black'
                      }`}>
                        <MapPin className={`w-4 h-4 ${
                          isCritical ? 'text-red-600' : isActive ? 'text-blue-600' : 'text-gray-600'
                        }`} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {tableMap[session.table_number_id] || 'Unknown Table'}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Timer className="w-3 h-3" />
                          <span>{durationMap[session.duration_id]?.name || 'Unknown Duration'}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                      isCritical 
                        ? 'bg-red-50/80 text-red-800 border-red-200/60' 
                        : isActive 
                        ? 'bg-blue-50/80 text-blue-800 border-blue-200/60' 
                        : 'bg-gray-50/80 text-gray-800 border-black'
                    }`}>
                      {isCritical ? 'Critical' : isActive ? 'Active' : 'Completed'}
                    </span>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between items-baseline mb-2">
                      <span className="text-sm text-gray-600">Remaining Time</span>
                      {/* Enhanced time display with background and border */}
                      <div className={`px-3 py-1 rounded-lg border backdrop-blur-sm ${
                        isCritical 
                          ? 'bg-red-50/80 border-red-200/60 shadow-[0_0_8px_rgba(239,68,68,0.15)]'
                          : isActive 
                          ? 'bg-blue-50/80 border-blue-200/60 shadow-[0_0_8px_rgba(59,130,246,0.15)]'
                          : 'bg-gray-50/80 border-black shadow-[0_0_8px_rgba(31,41,55,0.1)]'
                      }`}>
                        <span className={`text-xl font-bold ${
                          isCritical ? 'text-red-600' : isActive ? 'text-blue-600' : 'text-gray-600'
                        }`}>
                          {isActive ? formatTime(remaining) : 'Completed'}
                        </span>
                      </div>
                    </div>

                    <div className="w-full bg-gray-200/80 rounded-full h-2.5 border border-gray-300/40">
                      <div
                        className={`h-2.5 rounded-full transition-all duration-500 ease-linear border-r ${
                          isCritical ? 'bg-red-400 border-red-500/30' : 'bg-sky-400 border-sky-500/30'
                        }`}
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Enhanced time information cards */}
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between p-2 bg-slate-350 border border-slate-350 rounded-lg">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-3 h-3" />
                        <span>Started</span>
                      </div>
                      <div className="px-2 py-1 bg-white/70 border border-slate-350 rounded font-medium text-slate-350">
                        {new Date(session.start_time).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-slate-350 border border-slate-350 rounded-lg">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-3 h-3" />
                        <span>Ends</span>
                      </div>
                      <div className="px-2 py-1 bg-white/70 border border-slate-350 rounded font-medium text-slate-350">
                        {new Date(session.end_time).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced user footer */}
                <div className="mt-4 pt-4 border-t border-gray-200/60">
                  <div className="flex items-center gap-3 p-2 bg-slate-50/40 border border-slate-350 rounded-lg">
                    {session.user?.image_url ? (
                      <img 
                        src={session.user.image_url} 
                        alt={session.user.name} 
                        className="w-8 h-8 rounded-full object-cover border border-white/60"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gray-100/80 border border-gray-350 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-500" />
                      </div>
                    )}
                    <span className="font-semibold text-gray-700">
                      {session.user?.name || 'Unknown User'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Enhanced empty state */}
        {sessionsToDisplay.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-white/75 backdrop-blur-sm rounded-3xl p-12 border border-slate-200/60 shadow-[0_0_30px_rgba(148,163,184,0.15)] max-w-md mx-auto">
              <Fish className="w-20 h-20 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">{emptyState.title}</h3>
              <p className="text-gray-600 mb-6">{emptyState.description}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FishingTimePage;