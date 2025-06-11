import React from 'react';
import { FaInstagram, FaFacebook } from 'react-icons/fa';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import './UserFooter.css'

export default function UserFooter() {
  return (
    <div className="bg-dark text-light py-5">
      <Container fluid style={{ maxWidth: '1400px' }}>
        <Row>
          {/* Location Section */}
          <Col md={6} className="mb-4">
            <h5 className="text-teal fw-bold mb-3">Địa điểm</h5>
            <ul className="list-unstyled">
              <li>
                <a href="#" className="text-secondary text-decoration-none hover-teal">
                  Số 1 Thôn Vàng, Cổ Bi, Gia Lâm, Hà Nội
                </a>
              </li>
              <li>
                <a href="#" className="text-secondary text-decoration-none hover-teal">
                  Tầng 5, tòa nhà Gamuda
                </a>
              </li>
              <li>
                <a href="#" className="text-secondary text-decoration-none hover-teal">
                  Công ty bất động sản và trách nhiệm hữu hạn Thanh Hiếu
                </a>
              </li>
            </ul>
          </Col>

          {/* Newsletter Section */}
          <Col md={6} className="mb-4">
            <h5 className="text-teal fw-bold mb-3">Đăng ký tin tức mới nhất</h5>
            <p className="text-secondary">
              Tóm tắt hàng tháng về những thông tin mới và thú vị từ chúng tôi.
            </p>
            <Form className="d-flex gap-2">
              <Form.Control
                type="email"
                placeholder="Nhập email của bạn"
                className="bg-dark text-light border-teal rounded-pill"
                style={{ maxWidth: '300px' }}
              />
              <Button
                variant="coral"
                className="rounded-pill px-4"
                type="submit"
              >
                Đăng ký
              </Button>
            </Form>
          </Col>
        </Row>

        <hr className="bg-secondary" />

        {/* Copyright and Social Links */}
        <Row className="align-items-center pt-3">
          <Col xs={12} md={6} className="mb-3 mb-md-0">
            <p className="mb-0 text-secondary">
              © {new Date().getFullYear()} Fitness Gym, Inc. Tất cả quyền được bảo lưu.
            </p>
          </Col>
          <Col xs={12} md={6} className="text-md-end">
            <div className="d-flex gap-3 justify-content-md-end">
              <a href="#" className="text-secondary hover-teal">
                <FaInstagram size={24} />
              </a>
              <a href="#" className="text-secondary hover-teal">
                <FaFacebook size={24} />
              </a>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}