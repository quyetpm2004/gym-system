// Tính tổng doanh thu
export const calculateTotalRevenue = (memberships) => {
    return memberships.reduce((sum, m) => sum + (m.package?.price || 0), 0);
};

// Tính doanh thu theo thời gian
export const calculateRevenueByPeriod = (memberships, startDate, endDate) => {
    return memberships
        .filter((m) => m.createdAt >= startDate && m.createdAt < endDate)
        .reduce((sum, m) => sum + (m.package?.price || 0), 0);
};
