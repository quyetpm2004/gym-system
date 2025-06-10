import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaHome,
  FaTools,
  FaUsers,
  FaDochub,
  FaRegCalendarTimes,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';
import { MdRoomPreferences, MdOutlineFeedback } from 'react-icons/md';
import { LuPackage } from 'react-icons/lu';
import './AdminSideBar.css';

const links = [
  { to: '/admin/dashboard', label: 'Trang chủ', icon: <FaHome /> },
  { to: '/admin/staff', label: 'Quản lý nhân sự', icon: <FaDochub /> },
  { to: '/admin/customer', label: 'Quản lý hội viên', icon: <FaUsers /> },
  { to: '/admin/device', label: 'Quản lý thiết bị', icon: <FaTools /> },
  { to: '/admin/gymroom', label: 'Quản lý phòng tập', icon: <MdRoomPreferences /> },
  { to: '/admin/report', label: 'Thống kê & Báo cáo', icon: <FaRegCalendarTimes /> },
  { to: '/admin/package-management', label: 'Quản lý gói tập', icon: <LuPackage /> },
  { to: '/admin/feedback-management', label: 'Quản lý phản hồi', icon: <MdOutlineFeedback /> },
];

export default function AdminSidebar() {
  return (
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
}
