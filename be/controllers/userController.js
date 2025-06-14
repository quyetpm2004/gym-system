import {
    registerUserService,
    loginUserService,
    getCurrentUserService,
    getAllUsersService,
    getUserByIdService,
    checkAccountService,
    updateUserService,
    deleteUserService,
    registerUserByAdminService,
} from '../services/userService.js';

// Đăng ký user
export const registerUser = async (req, res) => {
    try {
        const { user, token } = await registerUserService(req.body);
        res.json({ success: true, user, token });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// Đăng nhập
export const loginUser = async (req, res) => {
    try {
        const { user, token } = await loginUserService(
            req.body.emailOrUsername,
            req.body.password
        );
        res.json({ success: true, user, token });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// Lấy user hiện tại
export const getCurrentUser = async (req, res) => {
    try {
        const user = await getCurrentUserService(req.user.id);
        res.json({ success: true, user });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// Lấy danh sách tất cả người dùng
export const getAllUsers = async (req, res) => {
    try {
        const users = await getAllUsersService();
        res.json({ success: true, users });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// Lấy chi tiết 1 người dùng
export const getUserById = async (req, res) => {
    try {
        const user = await getUserByIdService(req.params.id);
        res.json({ success: true, user });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// Kiểm tra tài khoản đã tồn tại
export const checkAccount = async (req, res) => {
    try {
        const exists = await checkAccountService(req.query.emailOrUsername);
        res.json({ exists });
    } catch (err) {
        res.status(400).json({ exists: false, error: true });
    }
};

// Cập nhật thông tin user
export const updateUser = async (req, res) => {
    try {
        const user = await updateUserService(req.params.id, req.body);
        res.json({ success: true, user });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// Xóa user
export const deleteUser = async (req, res) => {
    try {
        await deleteUserService(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// Đăng ký user bởi admin
export const registerUserByAdmin = async (req, res) => {
    try {
        const user = await registerUserByAdminService(req.user.id, req.body);
        res.status(201).json({ success: true, user });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};
