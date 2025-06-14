import {
    getProgressByUserService,
    updateProgressByUserService,
} from '../services/progressService.js';

// Lấy progress theo userId
export const getProgressByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const progress = await getProgressByUserService(userId);
        res.json({ success: true, progress });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// Cập nhật progress theo userId
export const updateProgressByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const progress = await updateProgressByUserService(
            userId,
            req.body,
            req.user.role,
            req.user.id
        );
        res.json({ success: true, progress });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};
