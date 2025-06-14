import {
    requestPackageChangeService,
    approvePackageChangeService,
    getPackageChangesByUserService,
    getAllPackageChangesService,
} from '../services/packageChangeService.js';

// Yêu cầu đổi gói tập
export const requestPackageChange = async (req, res) => {
    try {
        const packageChange = await requestPackageChangeService(req.body);
        res.json({
            success: true,
            packageChange,
            message: 'Yêu cầu đổi gói tập đã được tạo thành công',
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// Phê duyệt đổi gói tập
export const approvePackageChange = async (req, res) => {
    const { changeId } = req.params;
    const { approved, adminNote } = req.body;

    try {
        const result = await approvePackageChangeService(
            changeId,
            approved,
            adminNote,
            req.user.userId
        );
        res.json(result);
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// Lấy danh sách yêu cầu đổi gói của user
export const getPackageChangesByUser = async (req, res) => {
    try {
        const packageChanges = await getPackageChangesByUserService(
            req.params.userId
        );
        res.json({ success: true, packageChanges });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Lấy tất cả yêu cầu đổi gói (Admin)
export const getAllPackageChanges = async (req, res) => {
    try {
        const packageChanges = await getAllPackageChangesService();
        res.json({ success: true, packageChanges });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
