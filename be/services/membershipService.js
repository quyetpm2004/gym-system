import { membershipModel } from '../models/membershipModel.js';
import { packageModel } from '../models/packageModel.js';

// Đăng ký gói tập mới cho hội viên
export const registerMembershipService = async (data) => {
    const { userId, packageId, paymentStatus, coach } = data;

    const packageInfo = await packageModel.findById(packageId);
    if (!packageInfo) throw new Error('Package not found');

    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + packageInfo.durationInDays);

    const sessionsRemaining = packageInfo.sessionLimit || null;

    return await membershipModel.create({
        user: userId,
        coach: coach || undefined,
        package: packageId,
        startDate,
        endDate,
        sessionsRemaining,
        isActive: true,
        paymentStatus: paymentStatus || 'unpaid',
    });
};

// Lấy tất cả membership của 1 user
export const getMembershipsByUserService = async (userId) => {
    return await membershipModel
        .find({ user: userId })
        .populate('package')
        .populate('coach', 'name email');
};

// Lấy tất cả membership (admin dashboard)
export const getAllMembershipsService = async (filter) => {
    return await membershipModel
        .find(filter)
        .populate('user')
        .populate('package')
        .populate('coach');
};

// Cập nhật trạng thái thanh toán
export const updatePaymentStatusService = async (id, paymentStatus) => {
    return await membershipModel.findByIdAndUpdate(
        id,
        { paymentStatus },
        { new: true }
    );
};

// Lấy membership active của user
export const getActiveMembershipService = async (userId) => {
    const now = new Date();
    return await membershipModel
        .find({
            user: userId,
            paymentStatus: 'paid',
            startDate: { $lte: now },
            endDate: { $gte: now },
        })
        .populate('package')
        .populate('coach', 'name email');
};

// Cập nhật coach cho membership
export const updateCoachService = async (id, coach) => {
    return await membershipModel.findByIdAndUpdate(
        id,
        { coach },
        { new: true }
    );
};

// Cập nhật trạng thái học viên (status)
export const updateMembershipStatusService = async (id, status) => {
    return await membershipModel.findByIdAndUpdate(
        id,
        { status },
        { new: true }
    );
};
