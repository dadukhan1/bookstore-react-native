import express from 'express';
import 'dotenv/config';

import authRoutes from './routes/auth.routes.js';
import bookRoutes from './routes/book.routes.js';
import { connectToDB } from './lib/database.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on the port ${PORT}`,);
    connectToDB();
})