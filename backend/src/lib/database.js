import mongoose, { mongo } from 'mongoose';

import dotenv from 'dotenv';

export const connectToDB = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGO_URI);
        console.log(`Connect successful ${connect.connection.host}`);
    } catch (error) {
        console.log('Connection failed error: ', error);
        process.exit(1) // exit with failure
    }
}