import { useState } from "react";
import { MdEdit } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import { FaRegTrashAlt } from "react-icons/fa";
import ModalAddUser from './ModalAddUser/ModalAddUser';
import ModalEditUser from "./ModalEditUser/ModalEditUser";

export default function UserContent() {
    const users = [
        {
          id: 1,
          username: "admin",
          name: "Vu Ngoc Duc",
          email: "admin@gmail.com",
          phone: "0922123131",
          role: "Quản lý hệ thống",
          status: "Hoạt động"
        },
        {
            id: 2,
            username: "hieujr",
            name: "Nguyen Thanh Hieu",
            email: "hieu@gmail.com",
            phone: "09225423131",
            role: "Nhân viên",
            status: "Hoạt động"
          },
      ];

    const [isShowModalAddUser, setIsShowModalAddUser] = useState(false)
    const [isShowModalEditUser, setIsShowModalEditUser] = useState(false)
    const [userEdit, setUserEdit] = useState({})

    const handleAddUser = (customer) => {
      setIsShowModalAddUser(true)
    };

    const handleClose = () => {
      setIsShowModalAddUser(false)
    }

    const handleCloseEdit = () => {
      setIsShowModalEditUser(false)
    }

    const handleEditUser = (user) => {
      setUserEdit(user)
      setIsShowModalEditUser(true)
    }

    return (
        <div className="mt-3">
            <div className="d-flex justify-content-between align-items-center">
                <h5>Danh sách người dùng</h5>
                <button 
                    className="btn btn-success btn-css"
                    onClick={handleAddUser}
                >
                    <FaPlus/><span style={{marginLeft: 3}}>Thêm mới</span></button>
            </div>
            <form className="d-flex mt-4" role="search">
              <input className="form-control" style={{width: 200, marginRight: "10px"}} type="text" placeholder="Tên tài khoản" />
              <input className="form-control" style={{width: 200, marginRight: "10px"}} type="text" placeholder="Email" />
              <input className="form-control" style={{width: 200, marginRight: "10px"}} type="text" placeholder="Số điện thoại" />
              <button className="btn btn-outline-success" type="submit">Tìm kiếm</button>
            </form>
            <table className="table table-bordered mt-3">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Tên đăng nhập</th>
                        <th>Họ và tên</th>
                        <th>Email</th>
                        <th>Số điện thoại</th>
                        <th>Vai trò</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.username}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.phone}</td>
                            <td>{user.role}</td>
                            <td>{user.status}</td>
                            <td>
                              <div>
                                <button className="btn btn-primary btn-sm me-1" onClick={() => handleEditUser(user)}>
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
            <ModalAddUser
              show={isShowModalAddUser}
              handleClose={handleClose}
            />
            <ModalEditUser
              show={isShowModalEditUser}
              handleCloseEdit={handleCloseEdit}
              userEdit={userEdit}
            />
        </div>
    )
}