import { config } from "dotenv";
import express from "express";
import { resolve } from "node:path";
import { AppError, errorHandler, httpLogger, logger, requireGatewaySecret, successResponse } from "shared";


config({ path: resolve(process.cwd(), ".env") });
config({ path: resolve(process.cwd(), "../../.env") });
import authRoutes from './routes/auth.routes'


const PORT = process.env.AUTH_PORT || 3001;

const app = express();

app.use(httpLogger);
app.use(express.json());
app.use('/auth', /*requireGatewaySecret,*/ authRoutes)

app.get("/health", (_req, res) => {
  successResponse(res, { service: "auth-service" });
});

app.use((_req, res, next) => {
  next(new AppError(404, "route not found"));
});


app.use(errorHandler);


app.listen(PORT, ()=> {
    logger.info(`Auth service is running on port ${PORT}`)
})