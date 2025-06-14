import React, { useState, useEffect } from 'react';
import UserLayout from '../../components/User/UserLayout';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Carousel from 'react-bootstrap/Carousel';
import Dashboard from '../../components/User/UserDashboard';

const UserDashboard = () => {
  // Danh sách hình ảnh cho slideshow

  return (
    <UserLayout>
      <Dashboard/>
    </UserLayout>
  );
};

export default UserDashboard;