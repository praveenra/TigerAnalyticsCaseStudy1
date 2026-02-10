import express from "express";
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from "./routes/auth.routes.js";
import storeRoutes from "./routes/store.routers.js";
import userRoutes from "./routes/user.routers.js";
import pricingRoutes from "./routes/pricing.routers.js";

const app = express();


app.use(express.json());
app.use(cookieParser());

// OR, enable CORS only for your frontend origin
app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true,
}));

app.use("/auth", authRoutes);
app.use("/store", storeRoutes);
app.use("/user", userRoutes);
app.use("/pricing", pricingRoutes);

export default app;
