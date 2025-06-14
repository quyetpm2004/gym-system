import { progressModel } from '../models/progressModel.js';
import { membershipModel } from '../models/membershipModel.js';

// Lấy progress theo userId
export const getProgressByUserService = async (userId) => {
    return await progressModel.findOne({ user: userId });
};

// Cập nhật progress theo userId
export const updateProgressByUserService = async (
    userId,
    data,
    userRole,
    coachId
) => {
    const { weightHeight, calories, bodyFat } = data;

    // Nếu user là coach, kiểm tra quyền chỉnh sửa
    if (userRole === 'coach') {
        const membership = await membershipModel.findOne({
            user: userId,
            coach: coachId,
            isActive: true,
        });
        if (!membership) {
            throw new Error('Bạn không có quyền chỉnh sửa học viên này');
        }
    }

    let progress = await progressModel.findOne({ user: userId });
    if (!progress) {
        progress = await progressModel.create({
            user: userId,
            weightHeight,
            calories,
            bodyFat,
        });
    } else {
        progress.weightHeight = weightHeight;
        progress.calories = calories;
        progress.bodyFat = bodyFat;
        await progress.save();
    }

    return progress;
};
