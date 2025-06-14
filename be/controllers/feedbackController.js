import {
    submitFeedbackService,
    getFeedbacksByTargetService,
} from '../services/feedbackService.js';

// Gửi phản hồi
export const submitFeedback = async (req, res) => {
    const { userId, rating, message, target, relatedUser } = req.body;

    try {
        const feedback = await submitFeedbackService({
            user: userId,
            rating,
            message,
            target,
            relatedUser,
        });
        res.json({ success: true, feedback });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error submitting feedback',
            error: error.message,
        });
    }
};

// Lấy phản hồi theo loại (GYM, STAFF, TRAINER)
export const getFeedbacksByTarget = async (req, res) => {
    const { target } = req.params;

    try {
        const feedbacks = await getFeedbacksByTargetService(target);
        res.json({ success: true, feedbacks });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching feedbacks',
            error: error.message,
        });
    }
};
