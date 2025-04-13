import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import './Login.css'
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../redux/authSlice';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Tên đăng nhập:", username);
    console.log("Mật khẩu:", password);
    // Gọi API đăng nhập hoặc xử lý logic tại đây
    const fakeResponse = {
      user: { name: username, password: password },
      token: 'abc123token',
    };
    dispatch(loginSuccess(fakeResponse));
  };

  return (
    <div className="min-h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-2xl shadow-xl form">
            <h2 className="text-2xl font-bold text-center mb-6 mb-4">Đăng nhập</h2>
            <form onSubmit={handleLogin} className="space-y-4 w-100">
                <div className="mb-3">
                  <label className="form-label">Tên đăng nhập</label>
                  <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="form-control"
                      required
                  />
                </div>

                <div className="mb-3">
                <label className="form-label">Mật khẩu</label>
                <div className="relative ">
                    <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-control"
                    required
                    />
                    <span
                    className="show-password transform -translate-y-1/2 cursor-pointer text-gray-500"
                    onClick={togglePasswordVisibility}
                    >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                    </span>
                </div>
                </div>

                <button
                type="submit"
                className="btn btn-primary w-100 mt-3"
                >
                <a href="/" style={{color: '#fff', textDecoration: 'none'}}>Đăng nhập</a>
                </button>
        </form>
    </div>
    </div>
  );
};

export default Login;
