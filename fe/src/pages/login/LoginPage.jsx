import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Lock, Mail, User, AlertCircle, Loader, Dumbbell } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser, selectIsLoggedIn, selectCurrentUser, selectAuthError, selectAuthLoading } from '../../redux/authSlice';

const LoginPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isLoggedIn = useSelector(selectIsLoggedIn);
    const currentUser = useSelector(selectCurrentUser);
    const authError = useSelector(selectAuthError);
    const authLoading = useSelector(selectAuthLoading);

    const [formData, setFormData] = useState({
        emailOrUsername: '',
        password: '',
        rememberMe: false
    });
    const [showPassword, setShowPassword] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});


    useEffect(() => {
        if (isLoggedIn && currentUser) {
            console.log(currentUser);
            // Điều hướng theo role
            switch (currentUser.role) {
                case 'admin':
                    navigate('/admin/dashboard', { replace: true });
                    break;
                case 'staff':
                    navigate('/staff/dashboard', { replace: true });
                    break;
                case 'coach':
                    navigate('/coach/dashboard', { replace: true });
                    break;
                case 'user':
                    navigate('/user/dashboard', { replace: true });
                    break;
                default:
                    navigate('/login', { replace: true });
            }
        }
    }, [isLoggedIn, currentUser, navigate]);

    const validateField = (name, value) => {
        const errors = { ...validationErrors };
        
        // Safely handle undefined or null values
        const safeValue = value || '';
        
        switch (name) {
            case 'emailOrUsername':
                if (!safeValue.trim()) {
                    errors[name] = 'Email hoặc tên đăng nhập là bắt buộc';
                } else if (safeValue.includes('@') && !/\S+@\S+\.\S+/.test(safeValue)) {
                    errors[name] = 'Định dạng email không hợp lệ';
                } else {
                    delete errors[name];
                }
                break;
            case 'password':
                if (!safeValue.trim()) {
                    errors[name] = 'Mật khẩu là bắt buộc';
                } else if (safeValue.length < 8) {
                    errors[name] = 'Mật khẩu phải có ít nhất 8 ký tự';
                } else {
                    delete errors[name];
                }
                break;
            default:
                break;
        }
        
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;
        
        setFormData(prev => ({
            ...prev,
            [name]: newValue
        }));
        
        // Validate field on change
        if (name !== 'rememberMe') {
            validateField(name, newValue);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate all fields
        const isEmailValid = validateField('emailOrUsername', formData.emailOrUsername);
        const isPasswordValid = validateField('password', formData.password);
        
        if (!isEmailValid || !isPasswordValid) {
            return;
        }

        // Gọi redux action loginUser
        dispatch(loginUser(formData));
    };


    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const getInputClassName = (fieldName) => {
        let baseClass = 'form-control';
        if (validationErrors[fieldName]) {
            baseClass += ' is-invalid';
        }
        return baseClass;
    };

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center" 
             style={{
                 background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                 fontFamily: 'Arial, sans-serif'
             }}>
            
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5">
                        <div className="card shadow-lg border-0" style={{ borderRadius: '1rem' }}>
                            <div className="card-body p-5">
                                {/* Header Section */}
                                <div className="text-center mb-4">
                                    <div className="mb-3">
                                        <div className="d-inline-flex align-items-center justify-content-center bg-primary text-white rounded-circle mb-3"
                                             style={{ width: '80px', height: '80px', fontSize: '2rem' }}>
                                            <Dumbbell size={40} />
                                        </div>
                                    </div>
                                    <h1 className="h3 fw-bold text-dark mb-2">
                                        Welcome Back Fitness Gym
                                    </h1>
                                    <p className="text-muted small mb-0">
                                        Sign in to access your account
                                    </p>
                                </div>

                                {/* Error Alert */}
                                {authError && (
                                    <div className="alert alert-danger d-flex align-items-center mb-4" role="alert">
                                        <AlertCircle size={20} className="me-2 flex-shrink-0" />
                                        <span className="small">{authError}</span>
                                    </div>
                                )}

                                {/* Login Form */}
                                <form onSubmit={handleSubmit}>
                                    {/* Email/Username Field */}
                                    <div className="mb-3">
                                        <label htmlFor="emailOrUsername" className="form-label fw-medium small">
                                            Email or Username <span className="text-danger">*</span>
                                        </label>
                                        <div className="input-group">
                                            <input
                                                type="text"
                                                className={getInputClassName('emailOrUsername')}
                                                id="emailOrUsername"
                                                name="emailOrUsername"
                                                value={formData.emailOrUsername}
                                                onChange={handleInputChange}
                                                placeholder="Nhập email hoặc tên đăng nhập"
                                                style={{ fontSize: '14px' }}
                                                autoComplete="username"
                                                required
                                            />
                                        </div>
                                        {validationErrors.emailOrUsername && (
                                            <div className="invalid-feedback d-block small">
                                                {validationErrors.emailOrUsername}
                                            </div>
                                        )}
                                    </div>

                                    {/* Password Field */}
                                    <div className="mb-3">
                                        <label htmlFor="password" className="form-label fw-medium small">
                                            Password <span className="text-danger">*</span>
                                        </label>
                                        <div className="input-group">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                className={getInputClassName('password')}
                                                id="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleInputChange}
                                                placeholder="Nhập mật khẩu"
                                                style={{ fontSize: '14px' }}
                                                autoComplete="current-password"
                                                required
                                            />
                                            <button
                                                type="button"
                                                className="btn btn-outline-secondary border-start-0"
                                                onClick={togglePasswordVisibility}
                                                tabIndex="-1"
                                                style={{ fontSize: '14px' }}
                                            >
                                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                        {validationErrors.password && (
                                            <div className="invalid-feedback d-block small">
                                                {validationErrors.password}
                                            </div>
                                        )}
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        className="btn btn-primary w-100 py-2 fw-medium mb-3"
                                        disabled={authLoading || Object.keys(validationErrors).length > 0}
                                        style={{ fontSize: '14px' }}
                                    >
                                        {authLoading ? (
                                            <>
                                                <Loader size={18} className="spinner-border spinner-border-sm me-2" />
                                                Signing in...
                                            </>
                                        ) : (
                                            'Đăng nhập'
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;