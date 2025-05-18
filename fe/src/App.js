import { Routes, Route } from 'react-router-dom'
// Admin
import AdminDashboard from './pages/admin/AdminDashboardPage'
import DevicePage from './pages/admin/AdminDevicePage'
import CustomerPage from './pages/admin/AdminCustomerPage'
import StaffPage from './pages/admin/AdminStaffPage'
import PackagePage from './pages/admin/AdminPackagePage'
import LoginPage from './pages/LoginPage'
import ReportPage from './pages/admin/AdminReportPage'
import FeedbackPage from './pages/admin/AdminFeedbackPage'

// Trainer
import Dashboard from './pages/trainer/Dashboard'
import Clients from './pages/trainer/Clients'
import Schedule from './pages/trainer/Schedule'
import TrainingPrograms from './pages/trainer/TrainingPrograms'
import TrainingProgress from './pages/trainer/TrainingProgress'
import GymRoom from './pages/admin/AdminGymRoomPage'


// Staff
import StaffCustomerPage from './pages/staff/StaffCustomerPage'
import StaffFeedbackPage from './pages/staff/StaffFeedbackPage'
import StaffDevicePage from './pages/staff/StaffDevicePage'
import StaffGymRoomPage from './pages/staff/StaffGymRoomPage'
import StaffSubscriptionManagementPage from './pages/staff/StaffSubscriptionManagementPage'
import StaffDashboardPage from './pages/staff/StaffDashboardPage'


function App() {
  return (
    <div>
      <Routes>
        {/* Route Admin */}
        <Route path='/login' element={<LoginPage/>} />
        <Route path='/admin/dashboard' element={<AdminDashboard/>} />
        <Route path='/admin/device' element={<DevicePage/>} />
        <Route path='/admin/customer' element={<CustomerPage/>} />
        <Route path='/admin/staff' element={<StaffPage/>} />
        <Route path='/admin/gymroom' element={<GymRoom/>} />
        <Route path='/admin/report' element={<ReportPage/>} />
        <Route path='/admin/package-management' element={<PackagePage/>} />
        <Route path='/admin/feedback-management' element={<FeedbackPage/>} />

        {/* Route Staff */}
        <Route path='/staff/dashboard' element={<StaffDashboardPage/>} />
        <Route path='/staff/subscription-management' element={<StaffSubscriptionManagementPage/>} />
        <Route path='/staff/feedback-management' element={<StaffFeedbackPage/>} />
        <Route path='/staff/customer' element={<StaffCustomerPage/>} />
        <Route path='/staff/gymroom' element={<StaffGymRoomPage/>} />
        <Route path='/staff/device' element={<StaffDevicePage/>} />


        {/* Route HLV */}
        <Route path='/coach/dashboard' element={<Dashboard />} />
        <Route path='/coach/clients' element={<Clients />} />
        <Route path='/coach/schedule' element={<Schedule />} />
        <Route path='/coach/training-progress' element={<TrainingProgress />} />
        <Route path='/coach/training-programs' element={<TrainingPrograms />} />
      
      </Routes>
    </div>
  )
}

export default App

// CSS module
