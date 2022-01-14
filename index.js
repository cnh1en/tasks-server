import express from "express";
import connect from "./config/mongodb.js";
import cors from "cors";
import dotenv from "dotenv";
import user from "./routes/user.js";
import task from "./routes/task.js";
import { Schedule } from "./middlewares/cron.js";
import cron from "node-cron";
dotenv.config();

connect();
// second-minute - hour - day - month- day of week
cron.schedule("0 30 2 * * *", () => {
  Schedule();
  console.log("running a task every minute");
});

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));
app.use("/api/v1/user", user);
app.use("/api/v1/task", task);

app.use("/", (req, res) => res.send("Hello everyone"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Port is running on ${PORT}`);
});
