import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaCalendarAlt, FaChartLine, FaArchive, FaAudible, FaUser } from 'react-icons/fa';

const links = [
    { path: '/user/dashboard', label: 'Trang chủ', icon: <FaHome /> },
    { path: '/user/schedule', label: 'Lịch tập', icon: <FaCalendarAlt /> },
    { path: '/user/progress', label: 'Tiến độ', icon: <FaChartLine /> },
    { path: '/user/package', label: 'Gói tập', icon: <FaArchive /> },
    { path: '/user/evaluate', label: 'Đánh giá', icon: <FaAudible /> },
    { path: '/user/profile', label: 'Profile', icon: <FaUser /> },
];

const UserNavbar = () => (
  <nav className="navbar navbar-expand bg-white border-bottom px-4 py-2">
    <div className="container-fluid">
      <span className="navbar-brand h5 mb-0">🏋️‍♂️ Hội viên</span>
      <ul className="navbar-nav ms-auto d-flex flex-row">
        {links.map(({ path, label, icon }) => (
          <li key={path} className="nav-item mx-2">
            <NavLink
              to={path}
              className={({ isActive }) =>
                `nav-link d-flex align-items-center ${isActive ? 'text-primary fw-bold' : 'text-dark'}`
              }
            >
              <span className="me-1">{icon}</span>
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  </nav>
);

export default UserNavbar;
