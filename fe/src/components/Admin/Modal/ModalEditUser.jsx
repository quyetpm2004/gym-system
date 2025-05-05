import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const ModalEditUser = ({ show, handleCloseEdit, userEdit }) => {
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    email: "",
    phone: "",
    role: "",
    status: "active",
  });

  // Cập nhật form khi `user` thay đổi
  useEffect(() => {
    const roleMap = {
        "Quản lý hệ thống": "1",
        "Nhân viên": "2",
        "Khách hàng": "3",
    }
    const statusMap = {
        "Hoạt động": "active",
        "Không hoạt động": "inactive",
    }
    if (userEdit && show) {
      setFormData({
        username: userEdit.username || "",
        fullName: userEdit.name || "",
        email: userEdit.email || "",
        phone: userEdit.phone || "",
        role: roleMap[userEdit.role] || "",
        status: statusMap[userEdit.status] || "active",
      });
    }
  }, [userEdit, show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("edit user", formData)
    handleCloseEdit();
  };

  return (
    <Modal show={show} onHide={handleCloseEdit} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Cập nhật người dùng</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Tên đăng nhập</Form.Label>
            <Form.Control
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              disabled
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Họ và tên</Form.Label>
            <Form.Control
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Số điện thoại</Form.Label>
            <Form.Control
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Vai trò</Form.Label>
            <Form.Select name="role" value={formData.role} onChange={handleChange}>
              <option value="">Chọn vai trò</option>
              <option value="1">Quản trị viên</option>
              <option value="2">Nhân viên</option>
              <option value="3">Khách hàng</option>
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
            <Button type="submit" variant="primary">
              Lưu thay đổi
            </Button>
            <Button variant="secondary" onClick={handleCloseEdit}>
              Hủy
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ModalEditUser;
