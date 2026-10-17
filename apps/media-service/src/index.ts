import express from "express";
import { config } from "dotenv";
import { resolve } from "node:path";
import {
  AppError,
  errorHandler,
  httpLogger,
  logger,
  successResponse,
} from "shared";
import attachmentRoutes from "./routes/media.routes";
import { initKafka } from "./utils/kafka";
config({ path: resolve(process.cwd(), ".env") });
config({ path: resolve(process.cwd(), "../../.env") });

const MEDIA_PORT = process.env.MEDIA_PORT || 3003;

const app = express();

app.use(httpLogger);

app.get("/health", (_req, res) =>
  successResponse(res, { service: "media-service" }),
);
app.use("/tasks", attachmentRoutes);

app.use((_req, _res, next) => {
  next(new AppError(404, "Route not found"));
});

app.use(errorHandler);

async function initStartup() {
  try {
    await initKafka();

    app.listen(MEDIA_PORT, () => {
      logger.info(`Media Service is now running on PORT ${MEDIA_PORT}...`);
    });
  } catch (e) {
    logger.error({ e }, "Startup Error");
  }
}

initStartup();
