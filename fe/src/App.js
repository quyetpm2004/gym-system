import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/Home'
import DevicePage from './pages/Device'
import CustomerPage from './pages/Customer'
import UserPage from './pages/User'
import LoginPage from './pages/LoginPage'

import Dashboard from './pages/trainer/Dashboard'
import Clients from './pages/trainer/Clients'
import Schedule from './pages/trainer/Schedule'
import TrainingPrograms from './pages/trainer/TrainingPrograms'
import TrainingProgress from './pages/trainer/TrainingProgress'

function App() {
  return (
    <div>
      <Routes>
        <Route path='/dang-nhap' element={<LoginPage/>} />
        <Route path='/' element={<HomePage/>} />
        <Route path='/thiet-bi' element={<DevicePage/>} />
        <Route path='/khach-hang' element={<CustomerPage/>} />
        <Route path='/nguoi-dung' element={<UserPage />} />

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
