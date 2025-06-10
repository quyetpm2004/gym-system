import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaUsers, FaCalendarAlt, FaDumbbell, FaUser, FaChartLine } from 'react-icons/fa';

const links = [
    { to: '/coach/dashboard', label: 'Trang chủ', icon: <FaHome /> },
    { to: '/coach/clients', label: 'Hội viên', icon: <FaUsers /> },
    { to: '/coach/schedule', label: 'Lịch tập', icon: <FaCalendarAlt /> },
    { to: '/coach/training-programs', label: 'Chương trình tập', icon: <FaDumbbell /> }
];

const TrainerSidebar = () => (
    <div className="sidebar-container">
          <div className="sidebar-header"><strong style={{paddingRight: 6}}>QL </strong> Gym</div>
          <nav className="sidebar-nav">
            {links.map(({ to, label, icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `sidebar-link${isActive ? ' active' : ''}`
                }
              >
                <span className="icon">{icon}</span>
                <span className="label">{label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
);

export default TrainerSidebar;
