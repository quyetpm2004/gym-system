// Viết hoa chữ cái đầu
export const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

// Loại bỏ khoảng trắng thừa
export const trimExtraSpaces = (string) => {
    return string.replace(/\s+/g, ' ').trim();
};
