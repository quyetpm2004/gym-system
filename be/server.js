import 'dotenv/config';
import { connectDB } from './config/db.js';
import app from './app.js';

const PORT = process.env.PORT || 3000;

// Connect DB then start server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
