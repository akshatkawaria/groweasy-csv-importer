import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import importRoutes from "./routes/importRoutes";

dotenv.config({ debug: false, quiet: true });

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Backend is running" });
});

app.use("/api", importRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});