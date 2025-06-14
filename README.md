# Gym Managerment System

BTL môn Phát triển phần mềm ITSS - IT4549 - 156730, 2024.2, SoICT

# Nhóm 15

-   Phạm Mạnh Quyết - 20225663 **(Team Leader)**
-   Đặng Hải Anh - 20225688
-   Vũ Ngọc Đức - 20225816
-   Nguyễn Thanh Hiếu - 20225716
-   Lê Thị Quỳnh - 20225917

### Cấu trúc thư mục

```
gym-system
├── fe/                        # Mã nguồn Front-end
│   ├── public/		       # File tĩnh, ảnh, tài nguyên dùng chung.
│   ├── src/
│   │   ├── components/       	# Các thành phần (component) giao diện tái sử dụng, phân theo vai trò/nghiệp vụ.
│   │   ├── pages/           	# Các trang ứng dụng, phân theo loại người dùng.
│   │   ├── contexts/         	# Context quản lý trạng thái toàn cục.
│   │   ├── redux/            	# State management với Redux.
│   │   ├── services/         	# Giao tiếp với backend/API.
│   │   ├── lib/            	# Hàm thư viện, UI component riêng.
│   │   ├── css/            	# File CSS toàn cục.
│   │   ├── test/		# Các file kiểm thử.
│   │   └── utils/            	# Hàm tiện ích.
│   ├── **package.json, jsconfig.json, .babelrc, ui.config.json** 	# Các file cấu hình.
│   └── **App.js, index.js** 	# Điểm khởi tạo ứng dụng.
├── be/                        	# Mã nguồn Back-end,
│   ├── config/               	# Cấu hình DB, dữ liệu mẫu.
│   ├── controllers/        	# Xử lý logic cho các API endpoint.
│   ├── models/               	# Định nghĩa các schema MongoDB.
│   ├── routes/               	# Định nghĩa các route cho API.
│   ├── middleware/           	# Middleware cho xác thực và các chức năng hỗ trợ.
│   ├── scripts/ 		# Script hỗ trợ seed dữ liệu.
│   ├── services/             	# Xử lý nghiệp vụ, thao tác dữ liệu.
│   ├── tests/		        # Unit test cho từng module, model.
│   ├── utils/                	# Thư viện hàm tiện ích dùng chung.
│   ├── **app.js, server.js** 	# Khởi tạo server, cấu hình middleware và route chính.
│   └── **.env, package.json, jest.config.json** 	# Các file cấu hình môi trường, package và test.
└── README.md                  	# Tài liệu dự án
```

### Cài đặt Front-end

```bash
# Điều hướng vào thư mục fe
cd fe

# Tải thư viện node_modules
npm i

# Khởi động
npm start
```

### Cài đặt Back-end

```bash
# Điều hướng vào thư mục fe
cd be

# Tải thư viện node_modules
npm i

# Khởi động
npm start
```

### Database

Có thể tạo database mới hoặc dùng database có sẵn với tài khoản, mật khẩu tương ứng với các quyền bên dưới

| Tài khoản       | Mật khẩu    | Quyền             |
| --------------- | ----------- | ----------------- |
| admin@gym.com   | admin123456 | Quản trị viên     |
| coach@gmail.com | coachcoach  | Huấn luyện viên   |
| staff@gmail.com | staffstaff  | Nhân viên quản lý |
| user@gmail.com  | useruser    | Người dùng        |
