import mongoose from "mongoose";

const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is not defined");
        }

        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB Atlas Connected");
    } catch (err) {
        console.error("❌ MongoDB Connection Error", err.message);
        process.exit(1);
    }
};

export default connectDB;
