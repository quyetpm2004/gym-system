import {
    addEquipmentService,
    getAllEquipmentService,
    updateEquipmentService,
    deleteEquipmentService,
} from '../services/equipmentService.js';

// Thêm thiết bị
export const addEquipment = async (req, res) => {
    try {
        const equipment = await addEquipmentService(req.body);
        res.json({ success: true, equipment });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error adding equipment',
            error: error.message,
        });
    }
};

// Lấy tất cả thiết bị
export const getAllEquipment = async (req, res) => {
    try {
        const list = await getAllEquipmentService();
        res.json({ success: true, equipment: list });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching equipment',
            error: error.message,
        });
    }
};

// Cập nhật thiết bị
export const updateEquipment = async (req, res) => {
    const { id } = req.params;
    try {
        const updated = await updateEquipmentService(id, req.body);
        res.json({ success: true, equipment: updated });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating equipment',
            error: error.message,
        });
    }
};

// Xóa thiết bị
export const deleteEquipment = async (req, res) => {
    const { id } = req.params;
    try {
        await deleteEquipmentService(id);
        res.json({ success: true, message: 'Deleted successfully' });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting equipment',
            error: error.message,
        });
    }
};
