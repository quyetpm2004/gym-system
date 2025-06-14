// Tính số ngày giữa hai ngày
export const calculateDaysBetween = (startDate, endDate) => {
    const diffTime = Math.abs(endDate - startDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Định dạng ngày tháng
export const formatDate = (date, locale = 'vi-VN', options = {}) => {
    return new Date(date).toLocaleDateString(locale, options);
};
