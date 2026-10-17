import { config } from "dotenv";
import { resolve } from "node:path";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { createProxyMiddleware } from "http-proxy-middleware";
import rateLimit, { MINUTE } from "express-rate-limit";
import {
  AppError,
  errorHandler,
  httpLogger,
  logger,
  successResponse,
} from "shared";
import { gatewayAuth } from "./middleware/gatewayAuth";

config({ path: resolve(process.cwd(), ".env") });
config({ path: resolve(process.cwd(), "../../.env") });

const PORT = process.env.PORT || 3000;
const AUTH_SERVICE_URL =
  process.env.AUTH_SERVICE_URL || "http://localhost:3001";
const TASK_SERVICE_URL =
  process.env.TASK_SERVICE_URL || "http://localhost:3002";

const MEDIA_SERVICE_URL =
  process.env.MEDIA_SERVICE_URL || "http://localhost:3003";

const WORKFLOW_SERVICE_URL =
  process.env.WORKFLOW_SERVICE_URL || "http://localhost:3004";

const app = express();

app.use(helmet());
app.use(cors());
app.use(
  rateLimit({
    windowMs: 15 * MINUTE,
    limit: 100,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);
app.use(httpLogger);

app.use("/health", (_req, res) => {
  successResponse(res, { service: "api-gateway" });
});

app.use(
  "/auth",
  // gatewayAuth,
  createProxyMiddleware({
    target: AUTH_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: (path) => `/auth${path}`,
  }),
);

const taskProxy = createProxyMiddleware({
  target: TASK_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: (path) => `/tasks${path}`,
});

const mediaProxy = createProxyMiddleware({
  target: MEDIA_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: (path) => `/tasks${path}`,
});

const workflowProxy = createProxyMiddleware({
  target: WORKFLOW_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: (path) => `/tasks${path}`,
});


app.use("/tasks", (req, res, next) => {
  if (req.path.includes("/attachments")) {
    return mediaProxy(req, res, next);
  }

  if(req.path.includes("/workflows")){
    return workflowProxy(req, res, next)
  }

  return taskProxy(req, res, next);
});

app.use((_req, res) => {
  throw new AppError(404, "Route not found");
});

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`API gateway is running on http://localhost:${PORT}`);
});
