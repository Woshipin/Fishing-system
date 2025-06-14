// src/components/UserDetails.jsx
import React, { useEffect } from 'react';
import { useUser } from '../contexts/UserContext';

const UserDetails = () => {
  const { user, logout } = useUser();

  useEffect(() => {
    console.log('UserDetails: User state updated:', user);
  }, [user]);

  const handleLogout = async () => {
    console.log('UserDetails: Logout button clicked');
    await logout();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">用户状态</h2>
      
      {user.isLoggedIn ? (
        <div className="space-y-3">
          <div className="text-gray-600">
            <p>当前登录状态: <span className="font-bold text-green-600">已登录</span></p>
            <p>用户 ID: <span className="font-bold text-blue-600">{user.userId}</span></p>
            <p>邮箱: <span className="font-bold text-blue-600">{user.email}</span></p>
            <p>姓名: <span className="font-bold text-blue-600">{user.name}</span></p>
            <p>Token: <span className="font-bold text-gray-500">{user.token ? '已设置' : '未设置'}</span></p>
          </div>
          
          <button
            onClick={handleLogout}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            登出
          </button>
        </div>
      ) : (
        <div className="text-gray-600">
          <p>当前登录状态: <span className="font-bold text-red-600">未登录</span></p>
          <p>请先登录以查看用户信息</p>
        </div>
      )}
      
      {/* 调试信息 */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-2">调试信息 (localStorage):</h3>
        <div className="text-xs text-gray-500 space-y-1">
          <p>userId: {localStorage.getItem('userId') || 'null'}</p>
          <p>email: {localStorage.getItem('email') || 'null'}</p>
          <p>name: {localStorage.getItem('name') || 'null'}</p>
          <p>token: {localStorage.getItem('token') ? 'exists' : 'null'}</p>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;