import {
    registerMembershipService,
    getMembershipsByUserService,
    getAllMembershipsService,
    updatePaymentStatusService,
    getActiveMembershipService,
    updateCoachService,
    updateMembershipStatusService,
} from '../services/membershipService.js';

// Đăng ký gói tập mới cho hội viên
export const registerMembership = async (req, res) => {
    try {
        const membership = await registerMembershipService(req.body);
        res.json({ success: true, membership });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// Lấy tất cả membership của 1 user
export const getMembershipsByUser = async (req, res) => {
    try {
        const memberships = await getMembershipsByUserService(
            req.params.userId
        );
        res.json({ success: true, memberships });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Lấy tất cả membership (admin dashboard)
export const getAllMemberships = async (req, res) => {
    try {
        const filter = req.query.coach ? { coach: req.query.coach } : {};
        const memberships = await getAllMembershipsService(filter);
        res.json({ success: true, memberships });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Cập nhật trạng thái thanh toán
export const updatePaymentStatus = async (req, res) => {
    try {
        const updated = await updatePaymentStatusService(
            req.params.id,
            req.body.paymentStatus
        );
        if (!updated)
            return res
                .status(404)
                .json({ success: false, message: 'Membership not found' });
        res.json({ success: true, membership: updated });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// Lấy membership active của user
export const getActiveMembership = async (req, res) => {
    try {
        const memberships = await getActiveMembershipService(req.params.userId);
        res.json({ success: true, memberships });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Cập nhật coach cho membership
export const updateCoach = async (req, res) => {
    try {
        const updated = await updateCoachService(req.params.id, req.body.coach);
        if (!updated)
            return res
                .status(404)
                .json({ success: false, message: 'Membership not found' });
        res.json({ success: true, membership: updated });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Cập nhật trạng thái học viên (status)
export const updateMembershipStatus = async (req, res) => {
    try {
        const updated = await updateMembershipStatusService(
            req.params.id,
            req.body.status
        );
        if (!updated)
            return res
                .status(404)
                .json({ success: false, message: 'Membership not found' });
        res.json({ success: true, membership: updated });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};
