import { authenticate, isAdmin, validateBody } from "shared";
import { createTaskSchema } from "../schema/task.schema";
import { Router } from "express";
import * as taskController from "../controllers/task.controllers";

const router = Router();

router.post(
  "/create",
  authenticate,
  validateBody(createTaskSchema),
  taskController.createTask,
);
router.get("/", authenticate, taskController.listTasks);
router.get("/:id", authenticate, taskController.getSingleTask);
router.delete("/:id", authenticate, isAdmin, taskController.deleteSingleTask);

export default router;
