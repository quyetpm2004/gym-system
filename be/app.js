import express from 'express';
import cors from 'cors';
import userRouter from './routes/userRoute.js';
import packageRouter from './routes/packageRoute.js';
import membershipRouter from './routes/membershipRoute.js';
import equipmentRouter from './routes/equipmentRoute.js';
import feedbackRouter from './routes/feedbackRoute.js';
import statisticRouter from './routes/statisticRoute.js';
import gymRoomRouter from './routes/gymRoomRoute.js';
import workoutScheduleRouter from './routes/workoutScheduleRoute.js';
import progressRouter from './routes/progressRoute.js';
import workoutSessionRouter from './routes/workoutSessionRoute.js';
import workoutRouter from './routes/workoutRoute.js';
import packageChangeRouter from './routes/packageChangeRoute.js';

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// API Routes
app.use('/api/user', userRouter);
app.use('/api/package', packageRouter);
app.use('/api/membership', membershipRouter);
app.use('/api/equipment', equipmentRouter);
app.use('/api/feedbacks', feedbackRouter);
app.use('/api/statistics', statisticRouter);
app.use('/api/gymroom', gymRoomRouter);
app.use('/api/schedule', workoutScheduleRouter);
app.use('/api/progress', progressRouter);
app.use('/api/workout-sessions', workoutSessionRouter);
app.use('/api/workout', workoutRouter);
app.use('/api/package-change', packageChangeRouter);

// Test route
app.get('/', (req, res) => {
    res.send('Hello World');
});

export default app;
