import React, { useState, useEffect } from 'react';
import UserLayout from '../../components/User/UserLayout';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Carousel from 'react-bootstrap/Carousel';
import './UserDashboard.css'; // Keep CSS import if you still need custom styles

const UserDashboard = () => {
  // Danh sách hình ảnh cho slideshow
  const slides = [
    { src: '/gym1.jpg', alt: 'Slide 1' },
    { src: '/gym2.jpg', alt: 'Slide 2' },
    { src: '/gym3.jpg', alt: 'Slide 3' },
  ];

  return (
    <UserLayout>
      <div className="">
        <Container>
          <Row className="mb-5 mt-5" style={{height: 550}}>
            <Col xs={12}>
              <div id="carouselExampleControls" className="carousel slide" data-bs-ride="carousel">
                <div className="carousel-inner">
                  <div className="carousel-item active">
                    <img src="/gym1.jpg" className="d-block w-100 image-slide-show" alt="Image 1"/>
                  </div>
                  <div className="carousel-item">
                    <img src="/gym2.jpg" className="d-block w-100 image-slide-show" alt="Image 2"/>
                  </div>
                  <div className="carousel-item">
                    <img src="/gym3.jpg" className="d-block w-100 image-slide-show"  alt="Image 3"/>
                  </div>
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
                  <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                  <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
                  <span className="carousel-control-next-icon" aria-hidden="true"></span>
                  <span className="visually-hidden">Next</span>
                </button>
              </div>
            </Col>
          </Row>

          {/* Giới thiệu Section */}
          <Row className="mb-5">
            <Col xs={12}>
              <div className="section-content bg-dark text-light rounded-4 shadow-sm">
                <h2 className="text-teal mb-4">Giới thiệu</h2>
                <p className="text-secondary">
                  Chào mừng bạn đến với <strong className="text-coral" style={{fontSize: 18}}>Fitness Gym</strong><br />
                  Chúng tôi là hệ thống phòng tập hiện đại, chuyên cung cấp các dịch vụ thể hình,
                  yoga, cardio và huấn luyện cá nhân (PT). Với đội ngũ huấn luyện viên chuyên nghiệp
                  và trang thiết bị hiện đại, chúng tôi cam kết mang đến trải nghiệm luyện tập hiệu quả,
                  an toàn và đầy cảm hứng.
                </p>
                <ul className="list-unstyled text-secondary">
                  <li className="mb-2">Theo dõi lịch tập và huấn luyện viên dễ dàng</li>
                  <li className="mb-2">Đăng ký và gia hạn gói tập nhanh chóng</li>
                  <li className="mb-2">Cập nhật tiến trình luyện tập và chỉ số sức khỏe định kỳ</li>
                  <li className="mb-2">Nhận hỗ trợ từ đội ngũ chăm sóc khách hàng</li>
                </ul>
                <p className="text-secondary">
                  Hành trình thay đổi bản thân bắt đầu từ hôm nay. Hãy để chúng tôi đồng hành cùng bạn!
                </p>
              </div>
            </Col>
          </Row>

          {/* Liên hệ Section */}
          <Row>
            <Col xs={12}>
              <div className="section-content bg-dark text-light p-4 rounded-4 shadow-sm">
                <h2 className="text-teal mb-4">Liên hệ</h2>
                <ul className="list-unstyled text-secondary">
                  <li className="mb-2">
                    <strong>Địa chỉ:</strong> Số 1, hẻm năm 48/24/28, Thái Bình, Cổ Bi, Gia Lâm, Hà Nội
                  </li>
                  <li className="mb-2">
                    <strong>Hotline:</strong> 0909 123 456
                  </li>
                  <li className="mb-2">
                    <strong>Email:</strong> hieu@gym.io
                  </li>
                  <li className="mb-2">
                    <strong>Website:</strong>{' '}
                    <a href="#" className="text-coral text-decoration-none hover-teal">
                      www.gymnasium.com
                    </a>
                  </li>
                  <li className="mb-2">
                    <strong>Giờ hoạt động:</strong> 05:30 – 03:00 (Tất cả các ngày trong tuần)
                  </li>
                </ul>
                <p className="text-secondary">
                  Bạn cũng có thể gửi tín hiệu tại mục{' '}
                  <strong className="text-coral">"Góp ý kiến & Hỗ trợ lực"</strong> trong tài khoản cá nhân.
                </p>
            </div>
          </Col>
          </Row>
        </Container>
      </div>
    </UserLayout>
  );
};

export default UserDashboard;