import { useEffect, useState } from 'react';
import '../../styles/adminDashboard.css';
import StatCard from "./StatCard";
import RecentUsageTable from "../Manage/RecentUsageTable";
import ServiceUsageChart from "./ServiceUsageChart";
import { MdRoomPreferences } from "react-icons/md";
import { FaTools, FaUsers } from "react-icons/fa";
import { LuPackage } from "react-icons/lu";
import { 
  getAllUsers, 
  getAllGymRooms, 
  getAllDevices, 
  getAllPackages,
  getRevenue,
  getNewMembersStats,
  getStaffPerformance,
  getAllMemberships
} from '../../services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalRoom: 0,
    totalDeviceActive: 0,
    totalPackage: 0,
  });
  const [revenue, setRevenue] = useState(0);
  const [memberStats, setMemberStats] = useState({ total: 0, recent: [] });
  const [staffStats, setStaffStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dataPackages, setDataPackages] = useState([])
  const [allMemberships, setAllMemberships] = useState([]);

  // Fetch tất cả dữ liệu thống kê
  const fetchDashboardData = async () => {
    setLoading(true);
    setError("");
    
    // Debug token
    const token = localStorage.getItem('gym_token');
    console.log('Current token:', token);
    
    if (!token) {
      setError("Bạn chưa đăng nhập. Vui lòng đăng nhập lại.");
      setLoading(false);
      return;
    }
    
    try {
      // Parallel fetch để tăng tốc độ
      const [
        usersRes,
        roomsRes, 
        devicesRes,
        packagesRes,
        revenueRes,
        membersRes,
        staffRes,
        membershipRes,
      ] = await Promise.allSettled([
        getAllUsers(),
        getAllGymRooms(),
        getAllDevices(),
        getAllPackages(),
        getRevenue(),
        getNewMembersStats(),
        getStaffPerformance(),
        getAllMemberships()
      ]);

      // Xử lý response với Promise.allSettled
      const usersData = usersRes.status === 'fulfilled' ? usersRes.value : { users: [] };
      const roomsData = roomsRes.status === 'fulfilled' ? roomsRes.value : { gymrooms: [] };
      const devicesData = devicesRes.status === 'fulfilled' ? devicesRes.value : { equipment: [] };
      const packagesData = packagesRes.status === 'fulfilled' ? packagesRes.value : { packages: [] };
      const revenueData = revenueRes.status === 'fulfilled' ? revenueRes.value : { revenue: 0, success: false };
      const membersData = membersRes.status === 'fulfilled' ? membersRes.value : { total: 0, recent: [], success: false };
      const staffData = staffRes.status === 'fulfilled' ? staffRes.value : { stats: {}, success: false };
      const membershipData = membershipRes.status = 'fulfilled' ? membershipRes.value : {membership: [], success: false}

      // Tính toán statistics
      const totalCustomers = (usersData.users || []).filter(u => u.role === 'member' || u.role === 'user').length;
      // Đếm số phòng hoạt động (status: 'available')
      const allRooms = roomsData.rooms || roomsData.gymrooms || [];
      const totalRooms = allRooms.filter(r => r.status === 'available').length;
      const totalDevices = (devicesData.equipment || []).filter(d => d.condition === 'Good').length;
      const totalPackages = (packagesData.packages || []).length;
      setDataPackages(packagesData.packages || [])

      if (membershipData.success) {
        setAllMemberships(membershipData.memberships || []);
      } else {
        setAllMemberships([]);
      }

      setStats({
        totalCustomers,
        totalRoom: totalRooms,
        totalDeviceActive: totalDevices,
        totalPackage: totalPackages,
      });

      if (revenueData.success) setRevenue(revenueData.revenue);
      if (usersData.success) setMemberStats(usersData.users);
      if (staffData.success) setStaffStats(staffData.stats);

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError("Lỗi tải dữ liệu dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Thống kê số lượng đăng ký theo từng gói
  const membershipCountByPackage = allMemberships.reduce((acc, m) => {
    if (!m.package) return acc; // bỏ qua nếu package = null
    const pkgName = m.package.name;
    acc[pkgName] = (acc[pkgName] || 0) + 1;
    return acc;
  }, {});

  // Thống kê dịch vụ thực tế từ packages nếu có
  let serviceUsageData = [];
  if (dataPackages.length !== 0) {
    serviceUsageData = dataPackages.map(pkg => ({
      service: pkg.name,
      count: membershipCountByPackage[pkg.name] || 0
    }));
  } else {
    serviceUsageData = [
      { service: "Gói theo buổi", count: Math.floor(stats.totalCustomers * 0.4) },
      { service: "Gói cá nhân với HLV", count: Math.floor(stats.totalCustomers * 0.3) },
      { service: "Gói 3 tháng", count: Math.floor(stats.totalCustomers * 0.2) },
      { service: "Gói 1 năm", count: Math.floor(stats.totalCustomers * 0.1) },
    ];
  }

  // Mock recent usage (có thể tạo API riêng cho phần này sau)
  const recentUsage = memberStats.recent?.slice(0, 5).map((member, index) => ({
    date: new Date(member.createdAt || Date.now()).toLocaleDateString('vi-VN'),
    customerName: member.user?.name || `Hội viên ${index + 1}`,
    checkIn: "08:00",
    checkOut: "09:30", 
    services: ["Gym", "Tập luyện cá nhân"],
    participationLevel: "Tích cực",
  })) || [
    {
      date: new Date().toLocaleDateString('vi-VN'),
      customerName: "Không có dữ liệu",
      checkIn: "--",
      checkOut: "--",
      services: ["--"],
      participationLevel: "--",
    }
  ];

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
          <p className="mt-3">Đang tải dữ liệu dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Lỗi!</h4>
          <p>{error}</p>
          <button className="btn btn-outline-danger" onClick={fetchDashboardData}>
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="layout-content">
      <div className="dashboard-header mb-2">
        <h3>Dashboard</h3>
      </div>

      <div className="row g-4 mb-3">
        <div className="col-xl-3 col-md-6">
          <StatCard
            title="Tổng hội viên"
            value={stats.totalCustomers}
            icon={<FaUsers />}
            variant="primary"
          />
        </div>
        <div className="col-xl-3 col-md-6">
          <StatCard
            title="Phòng hoạt động"
            value={stats.totalRoom}
            icon={<MdRoomPreferences />}
            variant="success"
          />
        </div>
        <div className="col-xl-3 col-md-6">
          <StatCard
            title="Thiết bị hoạt động"
            value={stats.totalDeviceActive}
            icon={<FaTools />}
            variant="info"
          />
        </div>
        <div className="col-xl-3 col-md-6">
          <StatCard
            title="Gói tập hiện có"
            value={stats.totalPackage}
            icon={<LuPackage />}
            variant="warning"
          />
        </div>
      </div>

      {/* Charts and Tables Row */}
      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card dashboard-card">
            <div className="card-body">
              <ServiceUsageChart data={serviceUsageData} />
            </div>
          </div>
        </div>
        
        <div className="col-lg-4">
          <div className="card dashboard-card">
            <div className="card-header">
              <h5 className="card-title mb-0">Quick Stats</h5>
            </div>
            <div className="card-body">
              <div className="quick-stats">
                <div className="quick-stat-item">
                  <div className="quick-stat-value">
                    {revenue.toLocaleString('vi-VN')} VNĐ
                  </div>
                  <div className="quick-stat-label">Doanh thu</div>
                </div>
                <div className="quick-stat-item">
                  <div className="quick-stat-value">{memberStats.length || 0}</div>
                  <div className="quick-stat-label">Tổng người tham gia hệ thống</div>
                </div>
                <div className="quick-stat-item">
                  <div className="quick-stat-value">{Object.keys(staffStats).length}</div>
                  <div className="quick-stat-label">Nhân viên hoạt động</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
