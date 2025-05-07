import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const ModalEditDevice = (props) => {
  const {show, deviceEdit, handleCloseEdit} = props
  
  const [formData, setFormData] = useState({
    nameDevice: '',
    imgDevice: null,
    statusDevice: '',
    createdDate: ''
  })
  const handleChange = (e) => {
    const {name, value, type, files} = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'file' ? files[0] : value
    }));
  }
  const handleSubmit = (e) => {
    console.log("form data: ", formData)
  }

  useEffect(() => {
    if (show && deviceEdit) {
        const statusMap = {
            "Tốt": "1",
            "Hỏng": "2",
            "Bảo trì": "3"
        };
      setFormData({
        nameDevice: deviceEdit.name || '',
        imgDevice: null, // giữ nguyên vì không thể set sẵn file
        statusDevice: statusMap[deviceEdit.status] || '',
        createdDate: deviceEdit.createdAt || ''
      });
    }
  }, [show, deviceEdit]);

  return (
    <div>
        {console.log(deviceEdit)}
      <Modal show={show} onHide={handleCloseEdit}  animation={false} centered={true}>
        <Modal.Header closeButton>
          <Modal.Title>Cập nhật thiết bị</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <form>
            <div className="mb-3">
              <label className="form-label">Tên thiết bị</label>
              <input 
                type="text" 
                className="form-control" 
                name="nameDevice" 
                placeholder="Nhập tên thiết bị" 
                required 
                value={formData.nameDevice}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Hình ảnh</label>
              <input 
                type="file" 
                className="form-control" 
                name="imgDevice" 
                accept="image/*" 
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Tình trạng</label>
              <select 
                className="form-control" 
                name="statusDevice" 
                required
                value={formData.statusDevice}
                onChange={handleChange}
              >
                <option value="">-- Chọn tình trạng --</option>
                <option value="1">Tốt</option>
                <option value="2">Hỏng</option>
                <option value="3">Bảo trì</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Ngày tạo</label>
              <input 
                type="date" 
                className="form-control" 
                name="createdDate"
                value={formData.createdDate}
                onChange={handleChange} 
              />
            </div>
          </form>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEdit}>
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

export default ModalEditDevice;