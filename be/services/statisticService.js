import { membershipModel } from '../models/membershipModel.js';
import { feedbackModel } from '../models/feedbackModel.js';
import {
    calculateTotalRevenue,
    calculateRevenueByPeriod,
} from '../utils/revenueUtils.js';
import { formatDate } from '../utils/dateUtils.js';

// Doanh thu với phân tích theo thời gian
export const getRevenueService = async (period) => {
    const paidMemberships = await membershipModel
        .find({ paymentStatus: 'paid' })
        .populate('package');
    const totalRevenue = calculateTotalRevenue(paidMemberships);

    const now = new Date();
    let timeSeriesData = [];

    if (period === 'day') {
        for (let i = 6; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            const dayStart = new Date(
                date.getFullYear(),
                date.getMonth(),
                date.getDate()
            );
            const dayEnd = new Date(
                date.getFullYear(),
                date.getMonth(),
                date.getDate() + 1
            );

            const dayRevenue = paidMemberships
                .filter((m) => m.createdAt >= dayStart && m.createdAt < dayEnd)
                .reduce((sum, m) => sum + (m.package?.price || 0), 0);

            timeSeriesData.push({
                name: date.toLocaleDateString('vi-VN'),
                revenue: dayRevenue,
            });
        }
    } else if (period === 'month') {
        for (let i = 5; i >= 0; i--) {
            const monthStart = new Date(
                now.getFullYear(),
                now.getMonth() - i,
                1
            );
            const monthEnd = new Date(
                now.getFullYear(),
                now.getMonth() - i + 1,
                1
            );

            const monthRevenue = calculateRevenueByPeriod(
                paidMemberships,
                monthStart,
                monthEnd
            );

            timeSeriesData.push({
                name: formatDate(monthStart, 'vi-VN', {
                    month: 'long',
                    year: 'numeric',
                }),
                revenue: monthRevenue,
            });
        }
    }

    return { totalRevenue, timeSeriesData };
};

// Hội viên mới và thống kê chi tiết
export const getNewMembersStatsService = async () => {
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const totalMemberships = await membershipModel.countDocuments();
    const newMembersThisMonth = await membershipModel.countDocuments({
        createdAt: { $gte: thisMonth },
    });

    const allMemberships = await membershipModel.find().populate('user');
    const userMembershipCounts = {};

    allMemberships.forEach((membership) => {
        const userId = membership.user?._id?.toString();
        if (userId) {
            userMembershipCounts[userId] =
                (userMembershipCounts[userId] || 0) + 1;
        }
    });

    const renewals = Object.values(userMembershipCounts).filter(
        (count) => count > 1
    ).length;

    const activeMemberships = await membershipModel
        .find({
            paymentStatus: 'paid',
            endDate: { $gte: now },
        })
        .populate('package');

    const estimatedSessionsUsed = activeMemberships.reduce(
        (total, membership) => {
            const sessionsPerMonth = membership.package?.sessionsPerMonth || 8;
            const monthsActive = Math.max(
                1,
                Math.floor(
                    (now - membership.createdAt) / (1000 * 60 * 60 * 24 * 30)
                )
            );
            return (
                total +
                Math.min(sessionsPerMonth * monthsActive, sessionsPerMonth * 3)
            );
        },
        0
    );

    const recentMemberships = await membershipModel
        .find()
        .sort({ createdAt: -1 })
        .limit(10)
        .populate('user');

    return {
        total: totalMemberships,
        newMembers: newMembersThisMonth,
        renewals,
        sessionsUsed: estimatedSessionsUsed,
        recent: recentMemberships,
    };
};

// Hiệu suất nhân viên với thông tin chi tiết
export const getStaffPerformanceService = async () => {
    const feedbacks = await feedbackModel
        .find({ target: 'STAFF' })
        .populate('relatedUser');
    const staffPerformanceMap = {};

    for (let feedback of feedbacks) {
        const staffUser = feedback.relatedUser;
        if (staffUser) {
            const staffId = staffUser._id.toString();
            if (!staffPerformanceMap[staffId]) {
                staffPerformanceMap[staffId] = {
                    name:
                        staffUser.name ||
                        staffUser.username ||
                        `Staff ${staffId.slice(-4)}`,
                    email: staffUser.email,
                    total: 0,
                    sum: 0,
                    ratings: [],
                };
            }
            staffPerformanceMap[staffId].total += 1;
            staffPerformanceMap[staffId].sum += feedback.rating;
            staffPerformanceMap[staffId].ratings.push(feedback.rating);
        }
    }

    const staffPerformanceArray = Object.entries(staffPerformanceMap).map(
        ([staffId, data]) => ({
            id: staffId,
            name: data.name,
            email: data.email,
            averageRating: data.total > 0 ? data.sum / data.total : 0,
            totalFeedbacks: data.total,
            ratings: data.ratings,
        })
    );

    staffPerformanceArray.sort((a, b) => b.averageRating - a.averageRating);

    return { staffPerformanceMap, staffPerformanceArray };
};
