import React, { useState, useEffect, useCallback } from "react";
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
  const [activeSessions, setActiveSessions] = useState([]);
  const [completedSessions, setCompletedSessions] = useState([]);
  const [tableNumbers, setTableNumbers] = useState([]);
  const [durations, setDurations] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading,setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('active');

  const viewingUser = {
    isLoggedIn: true,
    name: "AdminFisher",
    token: "mock-token"
  };

  const formatTime = useCallback((seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const getHeaders = useCallback(() => ({
    Accept: "application/json",
    "Content-Type": "application/json",
    ...(viewingUser.token && { 'Authorization': `Bearer ${viewingUser.token}` }),
  }), [viewingUser.token]);

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
    } catch (err)
    {
      console.error("Error fetching completed sessions:", err);
      setError(`Failed to fetch completed sessions: ${err.message}`);
    }
  }, [getHeaders]);

  const fetchStaticData = useCallback(async () => {
    try {
      const [tablesResponse, durationsResponse] = await Promise.all([
        fetch("http://127.0.0.1:8000/api/table-numbers", {
          method: "GET",
          headers: getHeaders(),
        }),
        fetch("http://127.0.0.1:8000/api/durations", {
          method: "GET",
          headers: getHeaders(),
        })
      ]);

      if (!tablesResponse.ok || !durationsResponse.ok) {
        throw new Error("Failed to fetch static data");
      }

      const tablesData = await tablesResponse.json();
      const durationsData = await durationsResponse.json();

      setTableNumbers(tablesData);
      setDurations(durationsData);
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

      const updatedSession = await response.json();
      return updatedSession;
    } catch (err) {
      console.error("Error updating session status:", err);
    }
  }, [getHeaders]);
  
  const getRemainingTime = useCallback((endTime) => {
    const now = new Date();
    const end = new Date(endTime);
    return Math.max(0, Math.floor((end - now) / 1000));
  }, []);

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
  }, [fetchActiveSessions, fetchCompletedSessions, fetchStaticData]);

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

  const getTableName = useCallback((tableId) => {
    const table = tableNumbers.find(t => t.id === tableId);
    return table ? `Table ${table.number}` : 'Unknown Table';
  }, [tableNumbers]);

  const getDurationName = useCallback((durationId) => {
    const duration = durations.find(d => d.id === durationId);
    return duration ? duration.name : 'Unknown Duration';
  }, [durations]);
  
  const filteredSessions = useCallback(() => {
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
  
  const stats = useCallback(() => {
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

  if (!viewingUser.isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto p-8 bg-white/70 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50">
          <Fish className="w-20 h-20 mx-auto text-blue-400 mb-6" />
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Login Required</h2>
          <p className="text-gray-600 mb-6">
            Please log in to access your fishing time tracker and session history.
          </p>
        </div>
      </div>
    );
  }

  const currentStats = stats();
  const sessionsToDisplay = filteredSessions();
  const emptyState = getEmptyStateMessage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="bg-white/80 backdrop-blur-md border-b border-white/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg">
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
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Welcome, {viewingUser.name}</span>
              </div>
              <div className="text-sm text-gray-500">
                {currentTime.toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="p-4 bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-2xl flex items-center gap-3">
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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Sessions</p>
                <p className="text-2xl font-bold text-gray-800">{currentStats.total}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Active Now</p>
                <p className="text-2xl font-bold text-green-600">{currentStats.active}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Completed</p>
                <p className="text-2xl font-bold text-blue-600">{currentStats.completed}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Critical Time</p>
                <p className="text-2xl font-bold text-red-600">{currentStats.critical}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-xl">
                <Target className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-600" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 bg-white/70 backdrop-blur-sm border border-white/50 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sessionsToDisplay.map((session) => {
            const remaining = getRemainingTime(session.end_time);
            const isCritical = remaining > 0 && remaining <= 600;
            const isActive = remaining > 0;
            
            const durationInfo = durations.find(d => d.id === session.duration_id);
            const totalDurationSeconds = durationInfo ? durationInfo.duration_seconds : 3600;
            const progressPercentage = isActive ? (remaining / totalDurationSeconds) * 100 : 0;

            // ======================================================================
            // ===== NEW: DYNAMIC STYLING FOR GLOWING BORDER EFFECT =====
            // ======================================================================
            let cardStyles = '';
            if (isCritical) {
              // Glowing Red Border
              cardStyles = 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]';
            } else if (isActive) {
              // Glowing Light Blue Border
              cardStyles = 'border-sky-400 shadow-[0_0_15px_rgba(59,182,246,0.4)]';
            } else {
              // Glowing Black/Dark-Gray Border
              cardStyles = 'border-gray-800 shadow-[0_0_15px_rgba(31,41,55,0.3)]';
            }

            return (
              <div
                key={session.id}
                className={`flex flex-col bg-white/80 backdrop-blur-sm rounded-2xl p-6 transition-all duration-300 border-2 ${cardStyles}`}
              >
                {/* Main Content */}
                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-lg ${isCritical ? 'bg-red-100' : isActive ? 'bg-blue-100' : 'bg-gray-100'}`}>
                        <MapPin className={`w-4 h-4 ${isCritical ? 'text-red-600' : isActive ? 'text-blue-600' : 'text-gray-600'}`} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{getTableName(session.table_number_id)}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Timer className="w-3 h-3" />
                          <span>{getDurationName(session.duration_id)}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      isCritical ? 'bg-red-100 text-red-800' : isActive ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {isCritical ? 'Critical' : isActive ? 'Active' : 'Completed'}
                    </span>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between items-baseline mb-2">
                      <span className="text-sm text-gray-600">Remaining Time</span>
                      <span className={`text-2xl font-bold ${isCritical ? 'text-red-600' : isActive ? 'text-blue-600' : 'text-gray-600'}`}>
                        {isActive ? formatTime(remaining) : 'Completed'}
                      </span>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full transition-all duration-500 ease-linear ${
                          isCritical ? 'bg-red-500' : 'bg-sky-400' // Use sky blue for consistency
                        }`}
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-600"><Calendar className="w-3 h-3" /><span>Started</span></div>
                      <span className="font-medium">{new Date(session.start_time).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-600"><Clock className="w-3 h-3" /><span>Ends</span></div>
                      <span className="font-medium">{new Date(session.end_time).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</span>
                    </div>
                  </div>
                </div>

                {/* User Info Footer */}
                <div className="mt-4 pt-4 border-t border-gray-200/80">
                  <div className="flex items-center gap-3">
                    {session.user?.image_url ? (
                      <img 
                        src={session.user.image_url} 
                        alt={session.user.name} 
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
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

        {sessionsToDisplay.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-12 shadow-lg border border-white/50 max-w-md mx-auto">
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