import React, { useState } from 'react';
import { FaPlus } from "react-icons/fa";

const GymRoomManager = () => {
  const [rooms, setRooms] = useState([
    { id: 1, name: 'Phòng Yoga', location: 'Tầng 1', status: 'active' },
    { id: 2, name: 'Phòng Gym', location: 'Tầng 2', status: 'inactive' },
  ]);

  const [formData, setFormData] = useState({ id: null, name: '', location: '', status: '' });
  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      setRooms(rooms.map((room) => (room.id === formData.id ? formData : room)));
      setIsEditing(false);
    } else {
      const newRoom = { ...formData, id: Date.now() };
      setRooms([...rooms, newRoom]);
    }
    setFormData({ id: null, name: '', location: '', status: '' });
  };

  const handleEdit = (room) => {
    setFormData(room);
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc muốn xóa phòng này?')) {
      setRooms(rooms.filter((room) => room.id !== id));
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <h5>Quản lý phòng</h5>
        <button 
          className="btn btn-success btn-css"
          // onClick={handleAddGymRoom}
        >
        <FaPlus/><span style={{marginLeft: 3}}>Thêm mới</span></button>
      </div>

      <table className="table table-bordered mt-2">
        <thead className="table-light">
          <tr>
            <th>Id</th>
            <th>Tên phòng</th>
            <th>Vị trí</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {rooms.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center">
                Chưa có phòng tập nào.
              </td>
            </tr>
          ) : (
            rooms.map((room, index) => (
              <tr key={room.id}>
                <td>{index + 1}</td>
                <td>{room.name}</td>
                <td>{room.location}</td>
                <td>{room.status}</td>
                <td>
                  <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(room)}>
                    Sửa
                  </button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(room.id)}>
                    Xóa
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default GymRoomManager;
