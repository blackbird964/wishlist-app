import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables from .env
dotenv.config();

// Debug: Let's see if we're reading the .env file
console.log('MONGODB_URI:', process.env.MONGODB_URI);

// Only try to connect if we have a URI
if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI is not defined in .env file');
    process.exit(1);
}

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Successfully connected to MongoDB!');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:');
        console.error(error);
    })
    .finally(() => {
        mongoose.connection.close();
    });