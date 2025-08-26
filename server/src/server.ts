import express from "express";
import type { Express } from "express";
import bodyParser from "body-parser";
import { artistRouter } from "./routes/artist.routes.js";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

const app: Express = express();
const PORT = process.env.PORT || 1316;
connectDB();
dotenv.config();
app.use(cors());
app.use(express.json());

app.use("/api", artistRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
