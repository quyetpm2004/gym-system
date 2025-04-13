import { useState } from "react";
import { MdEdit } from "react-icons/md";
import { FaRegTrashAlt } from "react-icons/fa";
import ModalEditCustomer from './ModalEditCustomer/ModalEditCustomer';

export default function CustomerContent() {
    const customers = [
        {
          id: 2,
          name: "Đức",
          image: "https://via.placeholder.com/50", // Thay bằng link hình ảnh thật
          address: "Ha Noi",
          ticketType: "Thường",
          createdAt: "2020-03-02",
        },
        {
            id: 1,
            name: "Hiếu",
            image: "https://via.placeholder.com/50", // Thay bằng link hình ảnh thật
            address: "Ha Noi",
            ticketType: "Vip",
            createdAt: "2020-03-04",
          },
      ];

    const [isShowModalEditCustomer, setIsShowModalEditCustomer] = useState(false)
    const [customerEdit, setCustomerEdit] = useState({})


    const handleEditCustomer = (customer) => {
      setCustomerEdit(customer)
      setIsShowModalEditCustomer(true)
    };

    const handleClose = () => {
      setIsShowModalEditCustomer(false)
    }

    return (
        <div className="mt-3">
            <h5>Danh sách khách hàng</h5>
            <form className="d-flex mt-4" role="search">
              <input className="form-control" style={{width: 200, marginRight: "10px"}} type="search" placeholder="Nhập tên khách hàng" aria-label="Search"/>
              <button className="btn btn-outline-success" type="submit">Tìm kiếm</button>
            </form>
            <table className="table table-bordered mt-3">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Họ và tên</th>
                        <th>Địa chỉ</th>
                        <th>Hình ảnh</th>
                        <th>Loại vé</th>
                        <th>Ngày đăng ký</th>
                        <th>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customers.map((customer) => (
                        <tr key={customer.id}>
                            <td>{customer.id}</td>
                            <td>{customer.name}</td>
                            <td>{customer.address}</td>
                            <td>
                                <img src={customer.image} alt={customer.name} width="50" height="50" />
                            </td>
                            <td>{customer.ticketType}</td>
                            <td>{customer.createdAt}</td>
                            <td>
                              <div>
                                <button className="btn btn-primary btn-sm me-1" onClick={() => handleEditCustomer(customer)}>
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
            <ModalEditCustomer
              show={isShowModalEditCustomer}
              handleClose={handleClose}
              customerEdit={customerEdit}
            />
        </div>
    )
}