import { gymRoomModel } from '../models/gymRoomModel.js';

// Lấy danh sách phòng tập
export const getAllGymRoomsService = async () => {
    return await gymRoomModel.find();
};

// Thêm phòng tập
export const createGymRoomService = async (data) => {
    const validStatus = ['available', 'unavailable'];
    return await gymRoomModel.create({
        ...data,
        status: validStatus.includes(data.status) ? data.status : 'available',
    });
};

// Sửa phòng tập
export const updateGymRoomService = async (id, data) => {
    const validStatus = ['available', 'unavailable'];
    const updateData = {
        ...(data.name && { name: data.name }),
        ...(data.location && { location: data.location }),
        ...(data.capacity && { capacity: data.capacity }),
        ...(data.description && { description: data.description }),
    };
    if (data.status && validStatus.includes(data.status)) {
        updateData.status = data.status;
    }
    return await gymRoomModel.findByIdAndUpdate(id, updateData, { new: true });
};

// Xóa phòng tập
export const deleteGymRoomService = async (id) => {
    return await gymRoomModel.findByIdAndDelete(id);
};
