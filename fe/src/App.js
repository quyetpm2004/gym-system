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
        <Route path='/dang-nhap' element={<LoginPage/>} />
        <Route path='/' element={<HomePage/>} />
        <Route path='/thiet-bi' element={<DevicePage/>} />
        <Route path='/khach-hang' element={<CustomerPage/>} />
        <Route path='/nguoi-dung' element={<UserPage/>} />
      </Routes>
    </div>
  )
}

export default App

// CSS module
