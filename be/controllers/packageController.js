import {
    createPackageService,
    getAllPackagesService,
    getPackageByIdService,
    updatePackageService,
    deletePackageService,
} from '../services/packageService.js';

// Tạo gói tập mới
export const createPackage = async (req, res) => {
    try {
        const newPackage = await createPackageService(req.body);
        res.json({ success: true, package: newPackage });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error creating package',
            error: err.message,
        });
    }
};

// Lấy tất cả các gói tập
export const getAllPackages = async (req, res) => {
    try {
        const packages = await getAllPackagesService();
        res.json({ success: true, packages });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error fetching packages',
            error: err.message,
        });
    }
};

// Lấy 1 gói tập theo ID
export const getPackageById = async (req, res) => {
    const { id } = req.params;
    try {
        const onePackage = await getPackageByIdService(id);
        if (!onePackage)
            return res
                .status(404)
                .json({ success: false, message: 'Package not found' });
        res.json({ success: true, package: onePackage });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error fetching package',
            error: err.message,
        });
    }
};

// Cập nhật gói tập
export const updatePackage = async (req, res) => {
    const { id } = req.params;
    try {
        const updated = await updatePackageService(id, req.body);
        if (!updated)
            return res
                .status(404)
                .json({ success: false, message: 'Package not found' });
        res.json({ success: true, package: updated });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error updating package',
            error: err.message,
        });
    }
};

// Xoá gói tập
export const deletePackage = async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await deletePackageService(id);
        if (!deleted)
            return res
                .status(404)
                .json({ success: false, message: 'Package not found' });
        res.json({ success: true, message: 'Package deleted' });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error deleting package',
            error: err.message,
        });
    }
};
