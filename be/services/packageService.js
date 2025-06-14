import { packageModel } from '../models/packageModel.js';

// Tạo gói tập mới
export const createPackageService = async (data) => {
    return await packageModel.create(data);
};

// Lấy tất cả các gói tập
export const getAllPackagesService = async () => {
    return await packageModel.find();
};

// Lấy 1 gói tập theo ID
export const getPackageByIdService = async (id) => {
    return await packageModel.findById(id);
};

// Cập nhật gói tập
export const updatePackageService = async (id, updateData) => {
    return await packageModel.findByIdAndUpdate(id, updateData, { new: true });
};

// Xoá gói tập
export const deletePackageService = async (id) => {
    return await packageModel.findByIdAndDelete(id);
};
