import {
    createWorkoutSessionService,
    getUserWorkoutSessionsService,
    confirmWorkoutSessionService,
    getUserWorkoutProgressService,
    getPendingWorkoutSessionsService,
    getSessionsByMembershipService,
    checkInWorkoutSessionService,
    checkOutWorkoutSessionService,
    getWorkoutStatsService,
} from '../services/workoutSessionService.js';

// 1. Tạo workout session
export const createWorkoutSession = async (req, res) => {
    try {
        const workoutSession = await createWorkoutSessionService(
            req.body,
            req.user.role,
            req.user.id
        );
        res.status(201).json({ success: true, workoutSession });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// 2. Lấy danh sách workout sessions của user
export const getUserWorkoutSessions = async (req, res) => {
    try {
        const result = await getUserWorkoutSessionsService(
            req.params.userId,
            req.query,
            req.user.role,
            req.user.id
        );
        res.json({ success: true, ...result });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// 3. Xác nhận workout session
export const confirmWorkoutSession = async (req, res) => {
    try {
        const workoutSession = await confirmWorkoutSessionService(
            req.params.sessionId,
            req.user.role,
            req.user.id
        );
        res.json({ success: true, workoutSession });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// 4. Lấy tiến độ workout của user
export const getUserWorkoutProgress = async (req, res) => {
    try {
        const progress = await getUserWorkoutProgressService(
            req.params.userId,
            req.query.membershipId
        );
        res.json({ success: true, progress });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// 5. Lấy các workout sessions cần xác nhận
export const getPendingWorkoutSessions = async (req, res) => {
    try {
        const result = await getPendingWorkoutSessionsService(
            req.query,
            req.user.role,
            req.user.id
        );
        res.json({ success: true, ...result });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// 6. Lấy workout sessions theo membership ID
export const getSessionsByMembership = async (req, res) => {
    try {
        const result = await getSessionsByMembershipService(
            req.params.membershipId,
            req.user.role,
            req.user.id
        );
        res.json({ success: true, ...result });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// 7. User check-in buổi tập
export const checkInWorkoutSession = async (req, res) => {
    try {
        const workoutSession = await checkInWorkoutSessionService(
            req.params.sessionId,
            req.user.role,
            req.user.id
        );
        res.json({ success: true, workoutSession });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// 8. HLV check-out buổi tập
export const checkOutWorkoutSession = async (req, res) => {
    try {
        const workoutSession = await checkOutWorkoutSessionService(
            req.params.sessionId,
            req.body.notes,
            req.user.role,
            req.user.id
        );
        res.json({ success: true, workoutSession });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// 9. Lấy thống kê số buổi tập cho progress
export const getWorkoutStats = async (req, res) => {
    try {
        const stats = await getWorkoutStatsService(
            req.params.userId,
            req.user.role,
            req.user.id
        );
        res.json({ success: true, stats });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};
