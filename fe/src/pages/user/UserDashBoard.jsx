import React, { useState, useEffect } from 'react';
import UserLayout from '../../components/User/UserLayout';
import './UserDashboard.css'; // Đảm bảo file CSS được import

const UserDashboard = () => {
  // Danh sách hình ảnh cho slideshow
  const slides = [
    { src: '/gym1.jpg', alt: 'Slide 1' },
    { src: '/gym2.jpg', alt: 'Slide 2' },
    { src: '/gym3.jpg', alt: 'Slide 3' },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  // Tự động chuyển slide sau 3 giây
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 3000);

    return () => clearInterval(interval); // Dọn dẹp interval khi component unmount
  }, [slides.length]);

  // Chuyển slide trước/sau
  const plusSlides = (n) => {
    setCurrentSlide((prevSlide) => {
      let newIndex = prevSlide + n;
      if (newIndex >= slides.length) newIndex = 0;
      if (newIndex < 0) newIndex = slides.length - 1;
      return newIndex;
    });
  };

  // Chuyển đến slide cụ thể
  const setCurrentSlideIndex = (index) => {
    setCurrentSlide(index);
  };

  return (
    <UserLayout>
      <div className="container py-4">
        {/* Slideshow */}
        <div className="slideshow-container mb-4 text-center">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`slide ${index === currentSlide ? 'active' : ''}`}
              style={{ display: index === currentSlide ? 'block' : 'none' }}
            >
              <img src={slide.src} alt={slide.alt} className="img-fluid dashboard-img" />
            </div>
          ))}

          {/* Nút điều hướng */}
          <a className="prev" onClick={() => plusSlides(-1)} style={{textDecoration: 'none'}}>
            ❮
          </a>
          <a className="next" onClick={() => plusSlides(1)} style={{textDecoration: 'none'}}>
            ❯
          </a>

          {/* Chỉ báo (dots) */}
          <div className="dots-container">
            {slides.map((_, index) => (
              <span
                key={index}
                className={`dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlideIndex(index)}
              ></span>
            ))}
          </div>
        </div>

        <div className="section-content">
          <h2 className="section-title">Giới thiệu</h2>
          <p>
            Chào mừng bạn đến với <strong>Fitness Gym</strong>! <br />
            Chúng tôi là hệ thống phòng tập hiện đại, chuyên cung cấp các dịch vụ thể hình,
            yoga, cardio và huấn luyện cá nhân (PT). Với đội ngũ huấn luyện viên chuyên nghiệp
            và trang thiết bị hiện đại, chúng tôi cam kết mang đến trải nghiệm luyện tập hiệu quả,
            an toàn và đầy cảm hứng.
          </p>
          <ul>
            <li>Theo dõi lịch tập và huấn luyện viên dễ dàng</li>
            <li>Đăng ký và gia hạn gói tập nhanh chóng</li>
            <li>Cập nhật tiến trình luyện tập và chỉ số sức khỏe định kỳ</li>
            <li>Nhận hỗ trợ từ đội ngũ chăm sóc khách hàng</li>
          </ul>
          <p>
            Hành trình thay đổi bản thân bắt đầu từ hôm nay. Hãy để chúng tôi đồng hành cùng bạn!
          </p>
        </div>

        <div className="section-content">
          <h2 className="section-title">Liên hệ</h2>
          <ul className="list-unstyled">
            <li><strong>Địa chỉ:</strong> Số 1, hẻm 40/24/28 Thôn Vàng, Cổ Bi, Gia Lâm, Hà Nội</li>
            <li><strong>Hotline:</strong> 0909 123 456</li>
            <li><strong>Email:</strong> hieu@gym.com</li>
            <li><strong>Website:</strong> www.gymhieu.vn</li>
            <li><strong>Giờ hoạt động:</strong> 05:30 – 22:00 (Tất cả các ngày trong tuần)</li>
          </ul>
          <p>
            Bạn cũng có thể gửi phản hồi tại mục <strong>"Góp ý & Hỗ trợ"</strong> trong tài khoản cá nhân.
          </p>
        </div>
      </div>
    </UserLayout>
  );
};

export default UserDashboard;