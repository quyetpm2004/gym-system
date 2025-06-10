import React from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import { SiOpenaigym } from "react-icons/si";
import { NavLink } from 'react-router-dom';
import { FaHome, FaCalendarAlt, FaChartLine, FaArchive, FaAudible, FaUser } from 'react-icons/fa';

const UserHeader = () => {
    const navigate = useNavigate();
    const user = authService.getCurrentUser();

    const handleLogout = () => {
        localStorage.removeItem('gym_token');
        localStorage.removeItem('gym_user');
        navigate('/login');
    };


    const links = [
        { path: '/user/dashboard', label: 'Trang chủ', icon: <FaHome /> },
        { path: '/user/schedule', label: 'Lịch tập', icon: <FaCalendarAlt /> },
        { path: '/user/package', label: 'Gói tập', icon: <FaArchive /> },
        { path: '/user/evaluate', label: 'Đánh giá', icon: <FaAudible /> },
    ];

    return (
        <header style={{marginTop: 48, padding: '0 32px'}}>
            <div className="row">
                <div className='col-3'>
                    <div className='d-flex align-items-center'>
                        <SiOpenaigym fontSize={30}/>
                        <span className="text-xl font-semibold" style={{marginLeft: 10, fontSize: 24, fontWeight: 700}}>Fitness Gym</span>
                    </div>
                </div>
                <div className='col-6'>
                    <ul className="navbar-nav ms-auto d-flex flex-row justify-content-center">
                            {links.map(({ path, label, icon }) => (
                              <li key={path} className="nav-item mx-2">
                                <NavLink
                                  to={path}
                                  className={({ isActive }) =>
                                    `nav-link d-flex align-items-center ${isActive ? 'text-primary fw-bold' : 'text-dark'}`
                                  }
                                >
                                  {label}
                                </NavLink>
                              </li>
                            ))}
                          </ul>
                </div>
                <div className="col-3 d-flex align-items-center justify-content-end">
                    
                    <div class="dropdown">
                        <button class="btn dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <FaUser style={{marginRight: 5}}/>
                            <span className="me-2 ">{user?.name || user?.email || '---'}</span>
                        </button>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item" href="/user/profile">Thông tin cá nhân</a></li>
                            <li><a class="dropdown-item" onClick={handleLogout}>Đăng xuất</a></li>
                        </ul>
                        </div>
                    {/* <div>
                        <ul className='user-box'>
                            <li>
                                <button
                                className="btn btn-outline-danger ms-3"
                                style={{ height: 40 }}
                                onClick={handleLogout}
                            >
                                Thông tin cá nhân
                                </button>
                            </li>
                            <li>
                                <button
                                className="btn btn-outline-danger ms-3"
                                style={{ height: 40 }}
                                onClick={handleLogout}
                            >
                                Đăng xuất
                                </button>
                            </li>
                        </ul>
                    </div> */}
                </div>
            </div>
        </header>
        
    );
};

export default UserHeader;