import React from 'react';
import { Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import { IoArrowRedoCircleOutline } from "react-icons/io5";


const Header = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    localStorage.removeItem('gym_token');
    localStorage.removeItem('gym_user');
    navigate('/login');
  };

  return (
    <header
          className="d-flex justify-content-between align-items-center fixed-top px-4"
          style={{
            backgroundColor: '#418fba',
            color: '#fff',
            marginLeft: '250px',
            width: 'calc(100% - 250px)',
            height: '60px',
            zIndex: 1000
          }}
        >
          <h1 className="fs-5 fw-semibold mb-0">Welcome to Staff</h1>
          <button
            onClick={handleLogout}
            className="btn p-0 text-white"
            style={{ fontSize: '1.5rem', cursor: 'pointer', marginBottom: 5 }}
          >
            <IoArrowRedoCircleOutline />
          </button>
        </header>
  );
};

export default Header;