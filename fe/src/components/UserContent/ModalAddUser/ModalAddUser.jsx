import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const ModalAddUser = ({ show, handleClose }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    fullName: "",
    email: "",
    phone: "",
    role: "",
    status: "active",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData)
    handleClose();
  };

  const handleReset = () => {
    setFormData({
      username: "",
      password: "",
      fullName: "",
      email: "",
      phone: "",
      role: "",
      status: "active",
    });
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Thêm mới người dùng</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Tên đăng nhập <span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="text"
              name="username"
              placeholder="Tài khoản"
              value={formData.username}
              onChange={handleChange}
              required
            />
            <Form.Text className="text-muted">
              Tên tài khoản không được chứa khoảng trắng.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Mật khẩu <span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Mật khẩu"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Họ và tên</Form.Label>
            <Form.Control
              type="text"
              name="fullName"
              placeholder="Nguyễn Văn ..."
              value={formData.fullName}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Số điện thoại</Form.Label>
            <Form.Control
              type="tel"
              name="phone"
              placeholder="0988..."
              value={formData.phone}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Vai trò <span className="text-danger">*</span></Form.Label>
            <Form.Select name="role" value={formData.role} onChange={handleChange} required>
              <option value="">Chọn vai trò của người dùng</option>
              <option value="admin">Quản trị viên</option>
              <option value="user">Nhân viên</option>
              <option value="user">Khách hàng</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Trạng thái</Form.Label>
            <div>
              <Form.Check
                inline
                type="radio"
                label="Hoạt động"
                name="status"
                value="active"
                checked={formData.status === "active"}
                onChange={handleChange}
              />
              <Form.Check
                inline
                type="radio"
                label="Không hoạt động"
                name="status"
                value="inactive"
                checked={formData.status === "inactive"}
                onChange={handleChange}
              />
            </div>
          </Form.Group>

          <div className="d-flex justify-content-end gap-2">
            <Button variant="primary" type="submit">
              Lưu thông tin
            </Button>
            <Button variant="secondary" type="button" onClick={handleReset}>
              Hủy bỏ
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ModalAddUser;
