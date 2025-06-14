import {
    getRevenueService,
    getNewMembersStatsService,
    getStaffPerformanceService,
} from '../services/statisticService.js';

// Doanh thu với phân tích theo thời gian
export const getRevenue = async (req, res) => {
    try {
        const { period = 'month' } = req.query;
        const { totalRevenue, timeSeriesData } = await getRevenueService(
            period
        );
        res.json({
            success: true,
            revenue: totalRevenue,
            timeSeriesData,
            period,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error calculating revenue',
            error: error.message,
        });
    }
};

// Hội viên mới và thống kê chi tiết
export const getNewMembersStats = async (req, res) => {
    try {
        const stats = await getNewMembersStatsService();
        res.json({ success: true, ...stats });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching stats',
            error: error.message,
        });
    }
};

// Hiệu suất nhân viên với thông tin chi tiết
export const getStaffPerformance = async (req, res) => {
    try {
        const { staffPerformanceMap, staffPerformanceArray } =
            await getStaffPerformanceService();
        res.json({
            success: true,
            stats: staffPerformanceMap,
            staffPerformance: staffPerformanceArray,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error calculating staff performance',
            error: error.message,
        });
    }
};
