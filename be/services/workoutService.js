import { workoutModel } from '../models/workoutModel.js';
import { formatDate } from '../utils/dateUtils.js';

// Ghi nhận buổi tập
export const logWorkoutService = async (data) => {
    const { userId, trainerId, durationMinutes, notes } = data;
    return await workoutModel.create({
        user: userId,
        trainer: trainerId,
        durationMinutes,
        notes: trimExtraSpaces(notes), // Loại bỏ khoảng trắng thừa trong ghi chú
        date: formatDate(new Date()), // Sử dụng hàm formatDate
    });
};

// Lấy lịch sử tập của 1 hội viên
export const getWorkoutByUserService = async (userId) => {
    return await workoutModel
        .find({ user: userId })
        .populate('trainer', 'name');
};
