import jwt from 'jsonwebtoken';

// Tạo JWT token
export const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};
