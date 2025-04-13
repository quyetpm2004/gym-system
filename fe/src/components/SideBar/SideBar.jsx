import { FaHome, FaTools, FaUser, FaDochub , FaRegCalendarTimes } from "react-icons/fa";
import { IoTime } from "react-icons/io5";
export default function SideBar(){
  return (
          <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
            <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu">
              <li className="nav-item">
                <a href="/" className="nav-link align-middle px-0">
                  <span><FaHome  className="fs-4" /> </span>
                  <span className="ms-1 d-none d-sm-inline">Trang chủ</span>
                </a>
              </li>
              <li>
                <a href="/thiet-bi" className="nav-link px-0 align-middle">
                <span><FaTools className="fs-4" /> </span>
                  <span className="ms-1 d-none d-sm-inline">Quản lý thiết bị</span>
                </a>
              </li>
              <li>
                <a href="/nguoi-dung" className="nav-link px-0 align-middle">
                <span> <FaRegCalendarTimes  className="fs-4" /> </span>
                  <span className="ms-1 d-none d-sm-inline">Quản lý người dùng</span>
                </a>
              </li>
              <li>
                <a href="/khach-hang" className="nav-link px-0 align-middle">
                <span> <FaUser className="fs-4" /> </span>
                  <span className="ms-1 d-none d-sm-inline">Quản lý khách hàng</span>
                </a>
              </li>
              <li>
                <a href="/thong-ke-bao-cao" className="nav-link px-0 align-middle">
                <span> <FaDochub  className="fs-4" />  </span>
                  <span className="ms-1 d-none d-sm-inline">Thống kê và báo cáo</span>
                </a>
              </li>
              <li>
                <a href="/hlv" className="nav-link px-0 align-middle">
                <span><IoTime   className="fs-4" /> </span>
                  <span className="ms-1 d-none d-sm-inline">Quản lý huấn luyện viên</span>
                </a>
              </li>
            </ul>
          </div>
  );
};