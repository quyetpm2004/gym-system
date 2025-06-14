import React from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import { SiOpenaigym } from 'react-icons/si';
import { NavLink } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';
import { Navbar, Nav, Container, Dropdown } from 'react-bootstrap';
import './UserHeader.css'

const UserHeader = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    localStorage.removeItem('gym_token');
    localStorage.removeItem('gym_user');
    navigate('/login');
  };

  const links = [
    { path: '/user/dashboard', label: 'Trang chủ' },
    { path: '/user/schedule', label: 'Lịch tập' },
    { path: '/user/package', label: 'Gói tập' },
    { path: '/user/evaluate', label: 'Đánh giá' },
  ];

  return (
    <Navbar
      expand="lg"
      className="bg-dark shadow-sm py-3"
      variant="dark"
      fixed="top"
      style={{ zIndex: 1000 }}
    >
      <Container fluid style={{ maxWidth: '1300px' }}>
        {/* Brand Logo and Name */}
        <Navbar.Brand
          href="/user/dashboard"
          className="d-flex align-items-center text-light"
        >
          <SiOpenaigym size={32} className="text-teal me-2" />
          <span className="fw-bold" style={{ fontSize: '1.5rem' }}>
            Fitness Gym
          </span>
        </Navbar.Brand>

        {/* Toggle for Mobile */}
        <Navbar.Toggle aria-controls="navbar-nav" className="border-teal" />

        {/* Navigation Links */}
        <Navbar.Collapse id="navbar-nav">
          <Nav className="mx-auto">
            {links.map(({ path, label }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `nav-link mx-3 text-light ${isActive ? 'text-coral fw-bold' : 'text-light'}`
                }
                style={{
                  transition: 'color 0.3s ease',
                  fontSize: '1.1rem',
                }}
              >
                {label}
              </NavLink>
            ))}
          </Nav>

          {/* User Dropdown */}
          <Dropdown align="end">
            <Dropdown.Toggle
              variant="outline-light"
              className="d-flex align-items-center rounded-pill border-teal text-light"
              style={{ padding: '0.5rem 1rem' }}
            >
              <FaUser className="me-2" />
              <span>{user?.name || user?.email || '---'}</span>
            </Dropdown.Toggle>
            <Dropdown.Menu className="bg-dark border-0 shadow-lg mt-2">
              <Dropdown.Item
                href="/user/profile"
                className="text-light hover-teal py-2 px-3"
              >
                Thông tin cá nhân
              </Dropdown.Item>
              <Dropdown.Item
                onClick={handleLogout}
                className="text-light hover-teal py-2 px-3"
              >
                Đăng xuất
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default UserHeader;