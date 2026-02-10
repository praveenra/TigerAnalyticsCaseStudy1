import app from "./app.js";
import { loadEnvironment } from "./config/env.js";
import connectDB from "./config/db.js";

async function bootstrap() {
  // 1️⃣ Load env variables
  await loadEnvironment();

  // 2️⃣ Connect database
  await connectDB();

  // 3️⃣ Start server
  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error("❌ Failed to start server:", err);
  process.exit(1);
});
