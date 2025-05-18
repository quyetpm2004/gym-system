import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/admin/Home'
import DevicePage from './pages/admin/Device'
import CustomerPage from './pages/admin/Customer'
import UserPage from './pages/admin/User'
import LoginPage from './pages/login/LoginPage'


import Dashboard from './pages/coach/Dashboard'
import Clients from './pages/coach/Clients'
import Schedule from './pages/coach/Schedule'
import TrainingPrograms from './pages/coach/TrainingPrograms'
import TrainingProgress from './pages/coach/TrainingProgress'
import Profiles from './pages/coach/Profiles'

import UserDashboard from './pages/user/UserDashBoard'
import UserSchedule from './pages/user/UserSchedule'
import UserProgress from './pages/user/UserProgress'
import UserMembership from './pages/user/UserMembership'
import UserReview from './pages/user/UserReview'
import UserProfile from './pages/user/UserProfile'

function App() {
  return (
    <div>
      <Routes>
        {/* Login */}
        <Route path='/' element={<LoginPage />} />
        
        {/* Route Admin */}
        <Route path='/admin/dashboard' element={<HomePage/>} />
        <Route path='/admin/device' element={<DevicePage/>} />
        <Route path='/admin/customer' element={<CustomerPage/>} />
        <Route path='/admin/user' element={<UserPage/>} />

        {/* Route HLV */}
        <Route path='/coach/dashboard' element={<Dashboard />} />
        <Route path='/coach/clients' element={<Clients />} />
        <Route path='/coach/schedule' element={<Schedule />} />
        <Route path='/coach/training-progress' element={<TrainingProgress />} />
        <Route path='/coach/training-programs' element={<TrainingPrograms />} />
        <Route path='/coach/profile' element={<Profiles />} />

        {/* Route User */}
        <Route path='/user/dashboard' element={<UserDashboard />} />
        <Route path='/user/schedule' element={<UserSchedule />} />
        <Route path='/user/progress' element={<UserProgress />} />
        <Route path='/user/package' element={<UserMembership/> } />
        <Route path='/user/evaluate' element={<UserReview/> } />
        <Route path='/user/profile' element={<UserProfile/> } />

      </Routes>
    </div>
  )
}

export default App

