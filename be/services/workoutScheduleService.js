import { workoutScheduleModel } from '../models/workoutScheduleModel.js';
import { userModel } from '../models/userModel.js';
import { formatDate } from '../utils/dateUtils.js';
import { trimExtraSpaces } from '../utils/stringUtils.js';
import mongoose from 'mongoose';

// Tạo lịch tập
export const createWorkoutScheduleService = async (userId, data, creatorId) => {
    const { schedule, note, coach } = data;

    const creator = await userModel.findById(creatorId);
    if (!creator || !['staff', 'coach'].includes(creator.role)) {
        throw new Error('Không có quyền truy cập');
    }

    let coachId = coach;
    if (!coachId && creator.role === 'coach') {
        coachId = creatorId;
    }

    return await workoutScheduleModel.create({
        user: userId,
        coach: coachId || undefined,
        createdBy: creatorId,
        schedule: trimExtraSpaces(schedule), // Loại bỏ khoảng trắng thừa trong lịch tập
        note: trimExtraSpaces(note),
        createdAt: formatDate(new Date()), // Sử dụng hàm formatDate
    });
};

// Lấy lịch tập của user
export const getWorkoutScheduleByUserService = async (userId) => {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('userId không hợp lệ');
    }

    return await workoutScheduleModel
        .find({ user: userId })
        .populate('coach', 'name email role')
        .populate('createdBy', 'name email role')
        .sort({ createdAt: -1 });
};

// Lấy lịch tập của coach
export const getWorkoutScheduleByCoachService = async (coachId) => {
    return await workoutScheduleModel
        .find({ coach: coachId })
        .populate('user', 'name email')
        .populate('createdBy', 'name email role')
        .sort({ createdAt: -1 });
};

// Cập nhật lịch tập
export const updateWorkoutScheduleService = async (
    scheduleId,
    data,
    updaterId
) => {
    const { schedule, note } = data;

    const existingSchedule = await workoutScheduleModel.findById(scheduleId);
    if (!existingSchedule) {
        throw new Error('Không tìm thấy lịch tập');
    }

    const updater = await userModel.findById(updaterId);
    if (!updater || !['staff', 'coach'].includes(updater.role)) {
        throw new Error('Không có quyền truy cập');
    }

    return await workoutScheduleModel
        .findByIdAndUpdate(
            scheduleId,
            { schedule, note, updatedAt: new Date() },
            { new: true }
        )
        .populate('coach', 'name email')
        .populate('createdBy', 'name email role');
};

// Xóa lịch tập
export const deleteWorkoutScheduleService = async (scheduleId, deleterId) => {
    const existingSchedule = await workoutScheduleModel.findById(scheduleId);
    if (!existingSchedule) {
        throw new Error('Không tìm thấy lịch tập');
    }

    const deleter = await userModel.findById(deleterId);
    if (!deleter || !['staff', 'coach'].includes(deleter.role)) {
        throw new Error('Không có quyền truy cập');
    }

    await workoutScheduleModel.findByIdAndDelete(scheduleId);
};

// Điểm danh buổi tập
export const markAttendanceService = async (scheduleId, userId) => {
    const schedule = await workoutScheduleModel.findById(scheduleId);
    if (!schedule) {
        throw new Error('Không tìm thấy lịch tập');
    }

    if (String(schedule.user) !== String(userId)) {
        throw new Error('Không có quyền điểm danh lịch tập này');
    }

    if (schedule.attendance && schedule.attendance.includes(userId)) {
        return { message: 'Đã điểm danh trước đó' };
    }

    schedule.attendance = schedule.attendance || [];
    schedule.attendance.push(userId);
    schedule.lastAttendance = new Date();
    await schedule.save();

    return { message: 'Điểm danh thành công' };
};

// Lấy tất cả lịch tập
export const getAllWorkoutSchedulesService = async (query, page, limit) => {
    const filters = {};
    if (query.userId) filters.user = query.userId;
    if (query.coachId) filters.coach = query.coachId;

    const schedules = await workoutScheduleModel
        .find(filters)
        .populate('user', 'name email')
        .populate('coach', 'name email')
        .populate('createdBy', 'name email role')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

    const total = await workoutScheduleModel.countDocuments(filters);

    return {
        schedules,
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
    };
};

// Sửa lịch tập cũ (fix coach)
export const fixCoachForOldSchedulesService = async () => {
    const schedules = await workoutScheduleModel
        .find({
            $or: [{ coach: { $exists: false } }, { coach: null }],
        })
        .populate('createdBy', 'role');

    let updatedCount = 0;
    for (const sch of schedules) {
        if (sch.createdBy && sch.createdBy.role === 'coach') {
            sch.coach = sch.createdBy._id;
            await sch.save();
            updatedCount++;
        }
    }

    return updatedCount;
};
