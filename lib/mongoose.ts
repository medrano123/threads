import mongoose from 'mongoose';

let isConnected = false; // check status

export const connectToDb = async () => {
    mongoose.set('strictQuery', true); 

    if(!process.env.MONGODB_URL) return console.log('Unable to connect to Mongo, URL not specified')
    if(isConnected) return console.log('Already connected to MongoDB')

    try {
        await mongoose.connect(process.env.MONGODB_URL)
        isConnected = true;
        console.log('Connected to MongoDB');
    } catch (error) {
        console.log('Error connecting to MongoDB');
    }

}