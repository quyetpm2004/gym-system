import bcrypt from 'bcrypt';

// Hash mật khẩu
export const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
};

// So sánh mật khẩu
export const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};
