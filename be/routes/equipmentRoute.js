import express from 'express';
import {
    addEquipment,
    getAllEquipment,
    updateEquipment,
    deleteEquipment,
} from '../controllers/equipmentController.js';
import authMiddleware from '../middlewares/auth.js';

const equipmentRouter = express.Router();

// Áp dụng middleware xác thực cho tất cả các route trừ GET
equipmentRouter.use(['/'], authMiddleware);

// Định nghĩa các route
equipmentRouter.route('/').post(addEquipment).get(getAllEquipment);

equipmentRouter.route('/:id').put(updateEquipment).delete(deleteEquipment);

export default equipmentRouter;
