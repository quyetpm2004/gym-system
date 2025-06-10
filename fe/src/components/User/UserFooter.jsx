import React from 'react';
import { FaInstagram, FaFacebook } from 'react-icons/fa';

export default function UserFooter() {
  return (
    <footer className='p-4 overflow-auto'> 
      <div className="container py-5">
        <div className="row">
            <div className="col-6 mb-3">
              <h5>Địa điểm</h5>
              <ul className="list-unstyled">
                <li><a href="#" className="text-muted text-decoration-none">Số 1 Thôn Vàng, Cổ Bi, Gia Lâm, Hà Nội</a></li>
                <li><a href="#" className="text-muted text-decoration-none">Tầng 5, tòa nhà Gamuda</a></li>
                <li><a href="#" className="text-muted text-decoration-none">Công ty bất động sản và trách nhiệm hữu hạn Thanh Hiếu</a></li>
              </ul>
            </div>

          <div className="col-6 mb-3">
            <form>
              <h5>Đăng ký tin tức mới nhất của chúng tôi</h5>
              <p>Tóm tắt hàng tháng về những thông tin mới và thú vị từ chúng tôi.</p>
              <div className="d-flex w-80 gap-2">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email address"
                  aria-label="Email address"
                />
                <button className="btn btn-primary">
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>

        <hr />

        <div className="d-flex justify-content-between align-items-center pt-3">
          <p className="mb-0">© {new Date().getFullYear()} Company, Inc. All rights reserved.</p>
          <div className="d-flex gap-3">
            <a href="#" className="text-muted">
              <FaInstagram size={24} />
            </a>
            <a href="#" className="text-muted">
              <FaFacebook size={24} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
