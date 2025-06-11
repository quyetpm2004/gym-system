import React from 'react';
import { FaHome, FaTools, FaUsers } from "react-icons/fa";
import { NavLink } from 'react-router-dom';
import { MdRoomPreferences } from "react-icons/md";
import { MdOutlineSubtitles } from "react-icons/md";
import { MdOutlineFeedback } from "react-icons/md";

const links = [
  { to: '/staff/dashboard', label: 'Trang chủ', icon: <FaHome /> },
  { to: '/staff/customer', label: 'Quản lý hội viên', icon: <FaUsers /> }, // chung
  { to: '/staff/device', label: 'Quản lý thiết bị', icon: <FaTools /> }, // chung
  { to: '/staff/gymroom', label: 'Quản lý phòng tập', icon: <MdRoomPreferences /> }, // chung
  { to: '/staff/subscription-management', label: 'Đăng ký và gia hạn', icon: <MdOutlineSubtitles  /> },
  { to: '/staff/feedback-management', label: 'Quản lý phản hồi', icon: <MdOutlineFeedback /> }, // chung
];
  
const StaffSidebar = () => (
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

export default StaffSidebar;