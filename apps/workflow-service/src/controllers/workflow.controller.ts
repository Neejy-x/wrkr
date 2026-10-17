import { NextFunction, Request, Response } from "express";
import { AppError, successResponse } from "shared";
import * as workflowServices from "../services/workflow.services";

export async function listWorkflowsByTask(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.user?.user_id;
    const role = req.user?.role;
    if (!role || !userId) {
      throw new AppError(401, "Missing user Identity");
    }
    const taskId = String(req.params.taskId);
    const workflows = await workflowServices.listWorkflowsByTask(
      userId,
      role,
      taskId,
    );
    successResponse(res, { workflows });
  } catch (e) {
    next(e);
  }
}
