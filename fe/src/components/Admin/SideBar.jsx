import React from 'react';
import { FaHome, FaTools, FaUsers, FaDochub, FaRegCalendarTimes, FaUser } from "react-icons/fa";
import { IoTime } from "react-icons/io5";
import { NavLink } from 'react-router-dom';
import { MdRoomPreferences } from "react-icons/md";

const links = [
  { path: '/admin/dashboard', label: 'Trang chủ', icon: <FaHome /> },
  { path: '/admin/device', label: 'Quản lý thiết bị', icon: <FaTools /> },
  { path: '/admin/customer', label: 'Quản lý khách hàng', icon: <FaUsers /> },
  { path: '/admin/user', label: 'Quản lý người dùng', icon: <FaDochub /> },
  { path: '/admin/coach', label: 'Quản lý huấn luyện viên', icon: <IoTime /> },
  { path: '/admin/report', label: 'Thống kê và Báo cáo', icon: <FaRegCalendarTimes /> },
  { path: '/admin/gymroom', label: 'Quản lý phòng tập', icon: <MdRoomPreferences /> },
];

const Sidebar = () => (
  <div className="bg-white border-end p-4" style={{ width: '250px', height: '100vh' }}>
    <h2 className="h5 mb-4">🏋️‍♂️ Administrator </h2>
    <nav>
      {links.map(({ path, label, icon }) => (
        <NavLink
          key={path}
          to={path}
          className={({ isActive }) => `d-flex align-items-center mb-3 text-decoration-none ${isActive ? 'text-primary fw-bold' : 'text-dark'}`}
        >
          <span className="me-2">{icon}</span> {label}
        </NavLink>
      ))}
    </nav>
  </div>
);

export default Sidebar;