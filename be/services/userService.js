import { userModel } from '../models/userModel.js';
import { createToken } from '../utils/jwtUtils.js';
import { isValidEmail } from '../utils/validationUtils.js';
import { hashPassword, comparePassword } from '../utils/passwordUtils.js';

// Đăng ký user
export const registerUserService = async (data) => {
    const { name, email, password, phone, birthYear, role, gender, username } =
        data;

    if (!isValidEmail(email)) throw new Error('Invalid email');
    if (password.length < 8) throw new Error('Password too short');

    const exists = await userModel.findOne({ email });
    if (exists) throw new Error('User already exists');

    const usernameExists = await userModel.findOne({ username });
    if (usernameExists) throw new Error('Username already exists');

    const hashed = await hashPassword(password);

    const user = await userModel.create({
        name,
        email,
        password: hashed,
        phone,
        birthYear,
        role,
        gender,
        username,
    });

    const token = createToken(user._id);
    const userObj = user.toObject();
    delete userObj.password;

    return { user: userObj, token };
};

// Đăng nhập
export const loginUserService = async (emailOrUsername, password) => {
    const user = await userModel.findOne({
        $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });
    if (!user) throw new Error("User doesn't exist");

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) throw new Error('Invalid credentials');

    const token = createToken(user._id);
    const userObj = user.toObject();
    delete userObj.password;

    return { user: userObj, token };
};

// Lấy user hiện tại
export const getCurrentUserService = async (userId) => {
    const user = await userModel.findById(userId).select('-password');
    if (!user) throw new Error('User not found');
    return user;
};

// Lấy danh sách tất cả người dùng
export const getAllUsersService = async () => {
    return await userModel.find().select('-password');
};

// Lấy chi tiết 1 người dùng
export const getUserByIdService = async (id) => {
    const user = await userModel.findById(id).select('-password');
    if (!user) throw new Error('User not found');
    return user;
};

// Kiểm tra tài khoản đã tồn tại
export const checkAccountService = async (emailOrUsername) => {
    const user = await userModel.findOne({
        $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });
    return !!user;
};

// Cập nhật thông tin user
export const updateUserService = async (id, data) => {
    const user = await userModel.findByIdAndUpdate(id, data, { new: true });
    if (!user) throw new Error('User not found');
    return user;
};

// Xóa user
export const deleteUserService = async (id) => {
    const user = await userModel.findByIdAndDelete(id);
    if (!user) throw new Error('User not found');
    return user;
};

// Đăng ký user bởi admin
export const registerUserByAdminService = async (adminId, data) => {
    const { name, email, password, phone, birthYear, role, gender, username } =
        data;

    const adminUser = await userModel.findById(adminId);
    if (!adminUser || adminUser.role !== 'admin')
        throw new Error('Unauthorized');

    if (await userModel.findOne({ email }))
        throw new Error('Email already exists');
    if (await userModel.findOne({ username }))
        throw new Error('Username already exists');
    if (!password || password.length < 8) throw new Error('Password too short');

    const hashed = await bcrypt.hash(password, 10);

    const user = await userModel.create({
        name,
        email,
        password: hashed,
        phone,
        birthYear,
        role,
        gender,
        username,
    });

    const userObj = user.toObject();
    delete userObj.password;

    return userObj;
};
