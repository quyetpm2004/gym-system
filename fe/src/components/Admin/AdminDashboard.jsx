import StatCard from "./StatCard";
import RecentUsageTable from "../Manage/RecentUsageTable";
import ServiceUsageChart from "./ServiceUsageChart";
import { MdRoomPreferences } from "react-icons/md";
import { FaTools, FaUsers } from "react-icons/fa";
import { LuPackage } from "react-icons/lu";
export default function AdminDashboard() {
  const stats = {
    totalCustomers: 102,
    totalRoom: 3,
    totalDeviceActive: 17,
    totalPackage: 17,
  };

  const recentUsage = [
    {
      date: "2025-05-13",
      customerName: "Nguyễn Văn A",
      checkIn: "08:00",
      checkOut: "09:30",
      services: ["Gym", "Xông hơi"],
      participationLevel: "Tích cực",
    },
    {
      date: "2025-05-12",
      customerName: "Trần Thị B",
      checkIn: "18:15",
      checkOut: "19:05",
      services: ["Yoga"],
      participationLevel: "Trung bình",
    },
  ];

  // Dữ liệu thống kê dịch vụ sử dụng
  const serviceUsageData = [
    { service: "Gói theo buổi", count: 120 },
    { service: "Gói cá nhân với HLV", count: 75 },
    { service: "Gói 3 tháng", count: 40 },
    { service: "Gói 1 năm", count: 20 },
  ];

  return (
    <div className="container">
      <h3>Dashboard</h3>

      <div className="row mt-4">
        <div className="col-xl-3 col-md-6 mb-4">
          <StatCard
            title="Tổng hội viên"
            value={stats.totalCustomers}
            icon={<FaUsers style={{color: "GrayText", fontSize: 28}}/> }
            color="primary"
          />
        </div>
        <div className="col-xl-3 col-md-6 mb-4">
          <StatCard
            title="Số phòng hoạt động"
            value={stats.totalRoom}
            icon={<MdRoomPreferences style={{color: "GrayText", fontSize: 28}}/>}
            color="success"
          />
        </div>
        <div className="col-xl-3 col-md-6 mb-4">
          <StatCard
            title="Số thiết bị hoạt động"
            value={stats.totalDeviceActive}
            icon={<FaTools style={{color: "GrayText", fontSize: 28}}/>}
            color="info"
          />
        </div>
        <div className="col-xl-3 col-md-6 mb-4">
          <StatCard
            title="Số gói tập hiện có"
            value={stats.totalPackage}
            icon={<LuPackage style={{color: "GrayText", fontSize: 28}}/>}
            color="warning"
          />
        </div>
      </div>

      {/* Biểu đồ dịch vụ */}
      <ServiceUsageChart data={serviceUsageData} />

      {/* Bảng lịch sử tập luyện gần đây */}
      <RecentUsageTable data={recentUsage} />
    </div>
  );
}
