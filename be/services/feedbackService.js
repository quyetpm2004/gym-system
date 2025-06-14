import { feedbackModel } from '../models/feedbackModel.js';

// Gửi phản hồi
export const submitFeedbackService = async (data) => {
    return await feedbackModel.create(data);
};

// Lấy phản hồi theo loại (GYM, STAFF, TRAINER)
export const getFeedbacksByTargetService = async (target) => {
    return await feedbackModel.find({ target }).populate('user', 'name');
};
