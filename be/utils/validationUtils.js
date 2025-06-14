import validator from 'validator';

// Kiểm tra Email hợp lệ
export const isValidEmail = (email) => {
    return validator.isEmail(email);
};

// Kiểm tra ID hợp lệ
export const isValidId = (id) => {
    return /^[a-fA-F0-9]{24}$/.test(id); // Kiểm tra định dạng ObjectId của MongoDB
};

// Kiểm tra chuỗi không rỗng
export const isNonEmptyString = (str) => {
    return typeof str === 'string' && str.trim().length > 0;
};
