import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/admin/Home'
import DevicePage from './pages/admin/Device'
import CustomerPage from './pages/admin/Customer'
import UserPage from './pages/admin/User'
import LoginPage from './pages/LoginPage'

import Dashboard from './pages/trainer/Dashboard'
import Clients from './pages/trainer/Clients'
import Schedule from './pages/trainer/Schedule'
import TrainingPrograms from './pages/trainer/TrainingPrograms'
import TrainingProgress from './pages/trainer/TrainingProgress'
import GymRoom from './pages/admin/GymRoom'

function App() {
  return (
    <div>
      <Routes>
        {/* Route Admin */}
        <Route path='/login' element={<LoginPage/>} />
        <Route path='/admin/dashboard' element={<HomePage/>} />
        <Route path='/admin/device' element={<DevicePage/>} />
        <Route path='/admin/customer' element={<CustomerPage/>} />
        <Route path='/admin/user' element={<UserPage/>} />
        <Route path='/admin/gymroom' element={<GymRoom/>} />



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
