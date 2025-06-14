import { equipmentModel } from '../models/equipmentModel.js';

// Thêm thiết bị
export const addEquipmentService = async (data) => {
    return await equipmentModel.create(data);
};

// Lấy tất cả thiết bị
export const getAllEquipmentService = async () => {
    return await equipmentModel.find();
};

// Cập nhật thiết bị
export const updateEquipmentService = async (id, data) => {
    return await equipmentModel.findByIdAndUpdate(id, data, { new: true });
};

// Xóa thiết bị
export const deleteEquipmentService = async (id) => {
    return await equipmentModel.findByIdAndDelete(id);
};
