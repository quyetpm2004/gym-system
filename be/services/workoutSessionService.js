import { workoutSessionModel } from '../models/workoutSessionModel.js';
import { membershipModel } from '../models/membershipModel.js';

// 1. Tạo workout session
export const createWorkoutSessionService = async (data, userRole, userId) => {
    const {
        membershipId,
        workoutDate,
        startTime,
        endTime,
        exerciseName,
        notes,
        coachId,
    } = data;

    const membership = await membershipModel
        .findById(membershipId)
        .populate('user');
    if (!membership) throw new Error('Membership không tồn tại');

    if (
        userRole === 'user' &&
        membership.user._id.toString() !== userId.toString()
    ) {
        throw new Error('Không có quyền');

        const workoutSession = await workoutSessionModel.create({
            user: membership.user._id,
            membership: membershipId,
            coach: coachId || membership.coach,
            workoutDate: new Date(workoutDate),
            startTime,
            endTime,
            exerciseName,
            notes,
            isConfirmed: userRole === 'coach' || userRole === 'staff',
            confirmedBy:
                userRole === 'coach' || userRole === 'staff' ? userId : null,
            confirmedAt:
                userRole === 'coach' || userRole === 'staff'
                    ? new Date()
                    : null,
        });

        if (workoutSession.isConfirmed && membership.sessionsRemaining > 0) {
            membership.sessionsRemaining = Math.max(
                0,
                membership.sessionsRemaining - 1
            );
            await membership.save();
        }

        return await workoutSessionModel
            .findById(workoutSession._id)
            .populate('user', 'name email')
            .populate('coach', 'name email')
            .populate('membership', 'package sessionsRemaining');
    }
};

// 2. Lấy danh sách workout sessions của user
export const getUserWorkoutSessionsService = async (
    userId,
    query,
    userRole,
    requesterId
) => {
    const { page = 1, limit = 10, startDate, endDate } = query;

    if (userRole === 'user' && requesterId.toString() !== userId.toString()) {
        throw new Error('Không có quyền');
    }

    const filter = { user: userId };
    if (startDate && endDate) {
        filter.workoutDate = {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
        };
    }

    const sessions = await workoutSessionModel
        .find(filter)
        .populate('coach', 'name email')
        .populate('membership', 'package sessionsRemaining')
        .sort({ workoutDate: -1, createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

    const total = await workoutSessionModel.countDocuments(filter);

    return {
        sessions,
        pagination: {
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
        },
    };
};

// 3. Xác nhận workout session
export const confirmWorkoutSessionService = async (
    sessionId,
    userRole,
    userId
) => {
    if (!['coach', 'staff', 'admin'].includes(userRole)) {
        throw new Error('Không có quyền xác nhận');
    }

    const session = await workoutSessionModel
        .findById(sessionId)
        .populate('membership');
    if (!session) throw new Error('Session không tồn tại');

    if (session.isConfirmed) throw new Error('Session đã được xác nhận');

    if (
        userRole === 'coach' &&
        session.coach &&
        session.coach.toString() !== userId
    ) {
        throw new Error('Chỉ coach phụ trách mới có thể xác nhận');
    }

    session.isConfirmed = true;
    session.confirmedBy = userId;
    session.confirmedAt = new Date();
    await session.save();

    const membership = session.membership;
    if (membership.sessionsRemaining > 0) {
        membership.sessionsRemaining = Math.max(
            0,
            membership.sessionsRemaining - 1
        );
        await membership.save();
    }

    return await workoutSessionModel
        .findById(sessionId)
        .populate('user', 'name email')
        .populate('coach', 'name email')
        .populate('confirmedBy', 'name email')
        .populate('membership', 'package sessionsRemaining');
};

// 4. Lấy tiến độ workout của user
export const getUserWorkoutProgressService = async (userId, membershipId) => {
    const filter = { user: userId, isConfirmed: true };
    if (membershipId) filter.membership = membershipId;

    const currentMembership = await membershipModel
        .findOne({
            user: userId,
            isActive: true,
            paymentStatus: 'paid',
            endDate: { $gte: new Date() },
        })
        .populate('package');

    if (!currentMembership) {
        return {
            completionPercentage: 0,
            sessionsCompleted: 0,
            totalSessions: 0,
            sessionsRemaining: 0,
        };
    }

    const sessionsCompleted = await workoutSessionModel.countDocuments({
        membership: currentMembership._id,
        isConfirmed: true,
    });

    const totalSessions = currentMembership.package.sessionLimit || 0;
    const sessionsRemaining = currentMembership.sessionsRemaining || 0;
    const completionPercentage =
        totalSessions > 0
            ? Math.round((sessionsCompleted / totalSessions) * 100)
            : 0;

    return {
        completionPercentage,
        sessionsCompleted,
        totalSessions,
        sessionsRemaining,
        membership: currentMembership,
    };
};

// 5. Lấy các workout sessions cần xác nhận
export const getPendingWorkoutSessionsService = async (
    query,
    userRole,
    userId
) => {
    const { page = 1, limit = 10 } = query;

    if (!['coach', 'staff', 'admin'].includes(userRole)) {
        throw new Error('Không có quyền');
    }

    const filter = { isConfirmed: false };
    if (userRole === 'coach') {
        filter.coach = userId;
    }

    const sessions = await workoutSessionModel
        .find(filter)
        .populate('user', 'name email')
        .populate('coach', 'name email')
        .populate('membership', 'package sessionsRemaining')
        .sort({ workoutDate: -1, createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

    const total = await workoutSessionModel.countDocuments(filter);

    return {
        sessions,
        pagination: {
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
        },
    };
};

// 6. Lấy workout sessions theo membership ID
export const getSessionsByMembershipService = async (
    membershipId,
    userRole,
    userId
) => {
    const membership = await membershipModel
        .findById(membershipId)
        .populate('user');
    if (!membership) throw new Error('Không tìm thấy gói tập');

    if (userRole === 'user' && membership.user._id.toString() !== userId) {
        throw new Error('Không có quyền truy cập');
    }

    if (
        userRole === 'coach' &&
        membership.coach &&
        membership.coach.toString() !== userId
    ) {
        throw new Error('Không có quyền truy cập');
    }

    const sessions = await workoutSessionModel
        .find({ membership: membershipId })
        .populate('user', 'name email')
        .populate('coach', 'name email')
        .populate('confirmedBy', 'name email')
        .sort({ workoutDate: -1, createdAt: -1 });

    return {
        sessions,
        membership: {
            _id: membership._id,
            package: membership.package,
            sessionsRemaining: membership.sessionsRemaining,
            user: membership.user,
        },
    };
};

// 7. User check-in buổi tập
export const checkInWorkoutSessionService = async (
    sessionId,
    userRole,
    userId
) => {
    const session = await workoutSessionModel.findById(sessionId);
    if (!session) throw new Error('Session không tồn tại');

    if (userRole === 'user' && session.user.toString() !== userId.toString()) {
        throw new Error('Không có quyền');
    }

    if (session.status !== 'scheduled') {
        throw new Error('Session đã được check-in hoặc đã hoàn thành');
    }

    session.status = 'checked_in';
    session.checkedInAt = new Date();
    session.checkedInBy = userId;
    await session.save();

    return await workoutSessionModel
        .findById(session._id)
        .populate('user', 'name email')
        .populate('coach', 'name email')
        .populate('membership', 'package sessionsRemaining');
};

// 8. HLV check-out buổi tập
export const checkOutWorkoutSessionService = async (
    sessionId,
    notes,
    userRole,
    userId
) => {
    const session = await workoutSessionModel
        .findById(sessionId)
        .populate('membership');
    if (!session) throw new Error('Session không tồn tại');

    if (!['coach', 'staff', 'admin'].includes(userRole)) {
        throw new Error('Chỉ HLV/Staff mới có thể check-out');
    }

    if (session.status !== 'checked_in') {
        throw new Error('User chưa check-in hoặc session đã hoàn thành');
    }

    session.status = 'completed';
    session.checkedOutAt = new Date();
    session.checkedOutBy = userId;
    if (notes) session.notes = notes;
    await session.save();

    const membership = session.membership;
    if (membership.sessionsRemaining > 0) {
        membership.sessionsRemaining = Math.max(
            0,
            membership.sessionsRemaining - 1
        );
        await membership.save();
    }

    return await workoutSessionModel
        .findById(session._id)
        .populate('user', 'name email')
        .populate('coach', 'name email')
        .populate('membership', 'package sessionsRemaining');
};

// 9. Lấy thống kê số buổi tập cho progress
export const getWorkoutStatsService = async (userId, userRole, requesterId) => {
    if (userRole === 'user' && requesterId.toString() !== userId.toString()) {
        throw new Error('Không có quyền');
    }

    const activeMembership = await membershipModel
        .findOne({
            user: userId,
            paymentStatus: 'paid',
            startDate: { $lte: new Date() },
            endDate: { $gte: new Date() },
        })
        .populate('package');

    if (!activeMembership) {
        return {
            completedSessions: 0,
            totalSessions: 0,
            remainingSessions: 0,
        };
    }

    const completedSessions = await workoutSessionModel.countDocuments({
        user: userId,
        membership: activeMembership._id,
        status: 'completed',
    });

    const totalSessions = activeMembership.package.sessionLimit || 0;

    return {
        completedSessions,
        totalSessions,
        remainingSessions: activeMembership.sessionsRemaining,
    };
};
