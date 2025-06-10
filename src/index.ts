import app from "./server";
import dotenv from "dotenv";
import connectDB from "./config/db";

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB()
  app.listen(PORT, async () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
  });
}

startServer();