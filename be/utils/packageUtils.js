// Tính giá trị hoàn tiền
export const calculateRefundAmount = (packagePrice, totalDays, usedDays) => {
    const usedAmount = (packagePrice / totalDays) * usedDays;
    return packagePrice - usedAmount;
};

// Tính chi phí mới cho gói tập
export const calculateNewPeriodCost = (
    newPackagePrice,
    newPackageDuration,
    remainingDays
) => {
    return (newPackagePrice / newPackageDuration) * remainingDays;
};
