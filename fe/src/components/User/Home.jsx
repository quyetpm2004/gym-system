import React from 'react';
import UserLayout from '../../components/User/UserLayout';
import './UserDashboard.css'; // 👈 nhớ import file css

const UserDashboard = () => (
    <UserLayout>
        <div className="container py-4">
            {/* Banner */}
            <div className="mb-4 text-center">
                <img
                    src="/coach-dashboard.png"
                    alt="Coach Dashboard"
                    className="img-fluid dashboard-img"
                />
            </div>

            {/* About */}
            <div className="section-content">
                <h2 className="section-title">🏋️‍♂️ Giới thiệu</h2>
                <p>
                    Chào mừng bạn đến với <strong>[Tên Phòng Tập]</strong>! <br />
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

            {/* Contact */}
            <div className="section-content">
                <h2 className="section-title">📞 Liên hệ</h2>
                <ul className="list-unstyled">
                    <li><strong>Địa chỉ:</strong> 123 Đường Tập Gym, Quận 1, TP. HCM</li>
                    <li><strong>Hotline:</strong> 0909 123 456</li>
                    <li><strong>Email:</strong> support@gymplus.vn</li>
                    <li><strong>Website:</strong> www.gymplus.vn</li>
                    <li><strong>Giờ hoạt động:</strong> 05:30 – 22:00 (Tất cả các ngày trong tuần)</li>
                </ul>
                <p>
                    Bạn cũng có thể gửi phản hồi tại mục <strong>"Góp ý & Hỗ trợ"</strong> trong tài khoản cá nhân.
                </p>
            </div>
        </div>
    </UserLayout>
);

export default UserDashboard;
