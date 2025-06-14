// src/contexts/UserContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    userId: null,
    email: null,
    name: null,
    token: null,
    isLoggedIn: false
  });

  // 初始化和监听状态变化
  useEffect(() => {
    console.log("UserContext: Initializing...");
    
    // 从 localStorage 获取用户信息
    const loadUserFromStorage = () => {
      const userId = localStorage.getItem('userId');
      const email = localStorage.getItem('email');
      const name = localStorage.getItem('name');
      const token = localStorage.getItem('token');
      
      console.log("UserContext: Loading from storage:", { userId, email, name, token: token ? 'exists' : 'null' });
      
      if (userId && email && name && token) {
        setUser({
          userId,
          email,
          name,
          token,
          isLoggedIn: true
        });
        console.log("UserContext: User loaded successfully");
      } else {
        setUser({
          userId: null,
          email: null,
          name: null,
          token: null,
          isLoggedIn: false
        });
        console.log("UserContext: No valid user data found");
      }
    };

    // 初始加载
    loadUserFromStorage();

    // 监听登录状态变化事件
    const handleLoginStatusChange = () => {
      console.log("UserContext: Login status change event received");
      loadUserFromStorage();
    };

    // 监听 storage 变化（用于跨标签页同步）
    const handleStorageChange = (e) => {
      console.log("UserContext: Storage change event:", e.key);
      if (['userId', 'email', 'name', 'token'].includes(e.key)) {
        loadUserFromStorage();
      }
    };

    window.addEventListener('login-status-change', handleLoginStatusChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('login-status-change', handleLoginStatusChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // 登出函数
  const logout = async () => {
    console.log("UserContext: Logging out...");
    
    try {
      // 如果有token，调用API登出
      const token = localStorage.getItem('token');
      if (token) {
        await fetch("http://127.0.0.1:8000/api/logout", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
        });
        console.log("UserContext: API logout successful");
      }
    } catch (error) {
      console.error("UserContext: API logout error:", error);
    } finally {
      // 无论API调用是否成功，都清除本地数据
      localStorage.removeItem('userId');
      localStorage.removeItem('email');
      localStorage.removeItem('name');
      localStorage.removeItem('token');
      
      setUser({
        userId: null,
        email: null,
        name: null,
        token: null,
        isLoggedIn: false
      });
      
      // 触发状态更新事件
      window.dispatchEvent(new Event("login-status-change"));
      console.log("UserContext: Logout completed, localStorage cleared");
    }
  };

  // 调试用：记录状态变化
  useEffect(() => {
    console.log("UserContext: User state updated:", user);
  }, [user]);

  return (
    <UserContext.Provider value={{ user, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};