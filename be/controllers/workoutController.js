import {
    logWorkoutService,
    getWorkoutByUserService,
} from '../services/workoutService.js';

// Ghi nhận buổi tập
export const logWorkout = async (req, res) => {
    try {
        const workout = await logWorkoutService(req.body);
        res.json({ success: true, workout });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Error logging workout',
        });
    }
};

// Lấy lịch sử tập của 1 hội viên
export const getWorkoutByUser = async (req, res) => {
    try {
        const logs = await getWorkoutByUserService(req.params.userId);
        res.json({ success: true, workouts: logs });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Error fetching logs',
        });
    }
};
