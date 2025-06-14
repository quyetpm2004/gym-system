import {
    createWorkoutScheduleService,
    getWorkoutScheduleByUserService,
    getWorkoutScheduleByCoachService,
    updateWorkoutScheduleService,
    deleteWorkoutScheduleService,
    markAttendanceService,
    getAllWorkoutSchedulesService,
    fixCoachForOldSchedulesService,
} from '../services/workoutScheduleService.js';
import { isValidId } from '../utils/validationUtils.js';

export const createWorkoutSchedule = async (req, res) => {
    try {
        const newSchedule = await createWorkoutScheduleService(
            req.params.userId,
            req.body,
            req.user.id
        );
        res.status(201).json({ success: true, workoutSchedule: newSchedule });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

export const getWorkoutScheduleByUser = async (req, res) => {
    const { userId } = req.params;

    if (!isValidId(userId)) {
        return res
            .status(400)
            .json({ success: false, message: 'userId không hợp lệ' });
    }

    try {
        const schedules = await getWorkoutScheduleByUserService(
            req.params.userId
        );
        res.json({ success: true, schedules });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

export const getWorkoutScheduleByCoach = async (req, res) => {
    try {
        const schedules = await getWorkoutScheduleByCoachService(
            req.params.coachId
        );
        res.json({ success: true, schedules });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

export const updateWorkoutSchedule = async (req, res) => {
    try {
        const updated = await updateWorkoutScheduleService(
            req.params.scheduleId,
            req.body,
            req.user.id
        );
        res.json({ success: true, workoutSchedule: updated });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

export const deleteWorkoutSchedule = async (req, res) => {
    try {
        await deleteWorkoutScheduleService(req.params.scheduleId, req.user.id);
        res.json({ success: true, message: 'Xóa lịch tập thành công' });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

export const markAttendance = async (req, res) => {
    try {
        const result = await markAttendanceService(
            req.params.scheduleId,
            req.user.id
        );
        res.json({ success: true, ...result });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

export const getAllWorkoutSchedules = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const result = await getAllWorkoutSchedulesService(
            req.query,
            page,
            limit
        );
        res.json({ success: true, ...result });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

export const fixCoachForOldSchedules = async (req, res) => {
    try {
        const updatedCount = await fixCoachForOldSchedulesService();
        res.json({ success: true, updated: updatedCount });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
