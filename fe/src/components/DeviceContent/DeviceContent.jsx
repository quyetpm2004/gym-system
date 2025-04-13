import { FaPlus } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { FaRegTrashAlt } from "react-icons/fa";
import './DeviceContent.css';
import ModalAddDevice from './ModalAddDevice/ModalAddDevice';
import ModalEditDevice from './ModalEditDevice/ModalEditDevice';
import { useState } from "react";


export default function DeviceContent() {
    const devices = [
      {
        id: 1,
        name: "Máy chạy",
        image: "https://via.placeholder.com/50",
        status: "Hỏng",
        createdAt: "2020-03-02 01:09:53",
      },
      {
        id: 2,
        name: "Tạ",
        image: "https://via.placeholder.com/50",
        status: "Tốt",
        createdAt: "2020-03-04 02:09:53",
      },
      {
        id: 3,
        name: "Xà đơn",
        image: "https://via.placeholder.com/50",
        status: "Bảo trì",
        createdAt: "2020-03-04 02:09:53",
      },
    ] 

  const [isShowModalAddDevice, setIsShowModalAddDevice] = useState(false)
  const [isShowModalEditDevice, setIsShowModalEditDevice] = useState(false)
  const [deviceEdit, setDeviceEdit] = useState({})

  const handleAddDevice = () => {
    setIsShowModalAddDevice(true)
  };
  const handleClose = () => {
    setIsShowModalAddDevice(false)
  }
  const handleCloseEdit = () => {
    setIsShowModalEditDevice(false)
  }
  const handleEditDevice = (device) => {
    setDeviceEdit(device)
    setIsShowModalEditDevice(true)
  }
  return (
    <div className="mt-3">
      <div className="d-flex justify-content-between align-items-center">
        <h5>Quản lý thiết bị</h5>
        <button 
          className="btn btn-success btn-css"
          onClick={handleAddDevice}
        >
        <FaPlus/><span style={{marginLeft: 3}}>Thêm mới</span></button>
      </div>
      <table className="table table-bordered mt-2">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên</th>
            <th>Hình ảnh</th>
            <th>Tình trạng</th>
            <th>Ngày tạo</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {devices.map((device) => (
            <tr key={device.id}>
                <td>{device.id}</td>
                <td>{device.name}</td>
                <td>
                    <img src={device.image} alt={device.name} width="50" height="50" />
                </td>
                <td>{device.status}</td>
                <td>{device.createdAt}</td>
                <td>
                  <div>
                    <button className="btn btn-primary btn-sm me-1" onClick={() => handleEditDevice(device)}>
                      <MdEdit size={16} />
                    </button>
                    <button className="btn btn-danger btn-sm">
                      <FaRegTrashAlt size={16} />
                    </button>
                  </div>
                </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ModalAddDevice
        show={isShowModalAddDevice}
        handleClose={handleClose}
      />
      <ModalEditDevice
        show={isShowModalEditDevice}
        deviceEdit={deviceEdit}
        handleCloseEdit = {handleCloseEdit}
      />
    </div>
  );
}
