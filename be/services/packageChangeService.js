import { membershipModel } from '../models/membershipModel.js';
import { packageModel } from '../models/packageModel.js';
import { packageChangeModel } from '../models/packageChangeModel.js';
import {
    calculateRefundAmount,
    calculateNewPeriodCost,
} from '../utils/packageUtils.js';
import { calculateDaysBetween } from '../utils/dateUtils.js';

// Yêu cầu đổi gói tập
export const requestPackageChangeService = async (data) => {
    const { membershipId, newPackageId, reason } = data;

    const membership = await membershipModel
        .findById(membershipId)
        .populate('package')
        .populate('user');
    if (!membership) throw new Error('Membership không tồn tại');

    const newPackage = await packageModel.findById(newPackageId);
    if (!newPackage) throw new Error('Gói tập mới không tồn tại');

    const remainingDays = calculateDaysBetween(
        new Date(),
        new Date(membership.endDate)
    );
    const totalDays = membership.package.durationInDays;
    const refundAmount = calculateRefundAmount(
        membership.package.price,
        totalDays,
        totalDays - remainingDays
    );
    const newPeriodCost = calculateNewPeriodCost(
        newPackage.price,
        newPackage.durationInDays,
        remainingDays
    );

    return await packageChangeModel.create({
        membership: membershipId,
        user: membership.user._id,
        oldPackage: membership.package._id,
        newPackage: newPackageId,
        requestDate: new Date(),
        reason,
        status: 'pending',
        refundAmount,
        newPeriodCost,
        netAmount: newPeriodCost - refundAmount,
    });
};

// Phê duyệt đổi gói tập
export const approvePackageChangeService = async (
    changeId,
    approved,
    adminNote,
    userId
) => {
    const packageChange = await packageChangeModel
        .findById(changeId)
        .populate('membership')
        .populate('newPackage');

    if (!packageChange) throw new Error('Yêu cầu đổi gói không tồn tại');
    if (packageChange.status !== 'pending')
        throw new Error('Yêu cầu đã được xử lý');

    if (approved) {
        const membership = await membershipModel.findById(
            packageChange.membership._id
        );
        const newEndDate = new Date();
        newEndDate.setDate(newEndDate.getDate() + packageChange.remainingDays);

        await membershipModel.findByIdAndUpdate(packageChange.membership._id, {
            package: packageChange.newPackage._id,
            endDate: newEndDate,
            sessionsRemaining: packageChange.newSessionsCalculated,
            paymentStatus: packageChange.netAmount > 0 ? 'unpaid' : 'paid',
        });

        await packageChangeModel.findByIdAndUpdate(changeId, {
            status: 'approved',
            approvedDate: new Date(),
            adminNote,
            processedBy: userId,
        });

        return {
            success: true,
            message: 'Đã phê duyệt đổi gói tập thành công',
        };
    } else {
        await packageChangeModel.findByIdAndUpdate(changeId, {
            status: 'rejected',
            rejectedDate: new Date(),
            adminNote,
            processedBy: userId,
        });

        return { success: true, message: 'Đã từ chối yêu cầu đổi gói tập' };
    }
};

// Lấy danh sách yêu cầu đổi gói của user
export const getPackageChangesByUserService = async (userId) => {
    return await packageChangeModel
        .find({ user: userId })
        .populate('oldPackage')
        .populate('newPackage')
        .populate('membership')
        .sort({ createdAt: -1 });
};

// Lấy tất cả yêu cầu đổi gói (Admin)
export const getAllPackageChangesService = async () => {
    return await packageChangeModel
        .find()
        .populate('user', 'name email')
        .populate('oldPackage')
        .populate('newPackage')
        .populate('membership')
        .populate('processedBy', 'name email')
        .sort({ createdAt: -1 });
};
