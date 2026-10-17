import { config } from "dotenv";
import { resolve } from "node:path";
import express from "express";
import taskRouter from "./routes/task.routes";
import {
  AppError,
  errorHandler,
  httpLogger,
  logger,
  successResponse,
} from "shared";
import { initKafka } from "./utils/kafka";

const app = express();

config({ path: resolve(process.cwd(), ".env") });
config({ path: resolve(process.cwd(), "../../.env") });

const PORT = process.env.TASK_PORT || 3002;

app.use(httpLogger);
app.use(express.json());
app.use("/tasks", taskRouter);

app.use("/heatlh", (_req, res) => {
  successResponse(res, { service: "Task service!" });
});

app.use((_req, _res, next) => {
  next(new AppError(404, "Route not found"));
});

app.use(errorHandler);

async function initStartup() {
  try {
    await initKafka();
    app.listen(PORT, () => {
      logger.info(`Task service is now running on PORT: ${PORT}`);
    });
  } catch (e) {
    logger.error({ e }, "kafka producer init failed");
  }
}

initStartup();
