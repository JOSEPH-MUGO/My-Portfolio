// src/layouts/AdminLayout.js
import React from 'react';
import AdminSidebar from '../Admin/AdminSidebar';
import '../styles/Admin.css';

export default function AdminLayout({ children }) {
  return (
    <div className="admin-container">
      <div className="admin-sidebar">
        <AdminSidebar />
      </div>
      <div className="admin-content">
        {children}
      </div>
    </div>
  );
}
