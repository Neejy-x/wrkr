import Router from "express";
import * as workflowController from "../controllers/workflow.controller";
import { authenticate } from "shared";
const router = Router();

router.get(
  "/tasks/:taskId/workflows",
  authenticate,
  workflowController.listWorkflowsByTask,
);

export default router;
