import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/Home'
import DevicePage from './pages/Device'
import CustomerPage from './pages/Customer'
import UserPage from './pages/User'
import LoginPage from './pages/LoginPage'

function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<LoginPage/>} />
        <Route path='/admin/dashboard' element={<HomePage/>} />
        <Route path='/admin/device' element={<DevicePage/>} />
        <Route path='/admin/customer' element={<CustomerPage/>} />
        <Route path='/admin/user' element={<UserPage/>} />
      </Routes>
    </div>
  )
}

export default App

// CSS module
