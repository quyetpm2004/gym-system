import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const ModalEditCustomer = (props) => {
  const {show, handleClose, customerEdit} = props
  
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    img: null,
    ticketType: '',
    createdAt: ''
  })
  const handleChange = (e) => {
    const {name, value, type, files} = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'file' ? files[0] : value
    }));
  }
  useEffect(() => {
    console.log(customerEdit)
      if (show && customerEdit) {
          const ticketTypeMap = {
              "Thường": "1",
              "Vip": "2",
          };
        setFormData({
          name: customerEdit.name || '',
          address: customerEdit.address || '',
          img: null, // giữ nguyên vì không thể set sẵn file
          ticketType: ticketTypeMap[customerEdit.ticketType] || '',
          createdAt: customerEdit.createdAt || ''
        });
      }
    }, [show, customerEdit]);
  const handleSubmit = (e) => {
    console.log("form data: ", formData)
  }
  return (
    <div>
      <Modal show={show} onHide={handleClose} animation={false} centered={true}>
        <Modal.Header closeButton>
          <Modal.Title>Cập nhật khách hàng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <form>
            <div className="mb-3">
              <label className="form-label">Tên khách hàng</label>
              <input 
                type="text" 
                className="form-control" 
                name="name" 
                placeholder="Nhập tên khách hàng" 
                required 
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Địa chỉ</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Nhập địa chỉ" 
                required 
                value={formData.address}
                name="address" 
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Hình ảnh</label>
              <input 
                type="file" 
                className="form-control" 
                name="img" 
                accept="image/*" 
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Loại vé</label>
              <select 
                className="form-control" 
                name="ticketType" 
                required
                value={formData.ticketType}
                onChange={handleChange}
              >
                <option value="">-- Chọn loại vé --</option>
                <option value="1">Thường</option>
                <option value="2">Vip</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Ngày tạo</label>
              <input 
                type="date" 
                className="form-control" 
                name="createdAt"
                value={formData.createdAt}
                onChange={handleChange} 
              />
            </div>
          </form>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ModalEditCustomer;