import { NextFunction, Request, Response } from "express";
import { AppError, successResponse } from "shared";
import * as attachmentService from "../services/media.services";

export async function uploadAttachment(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.user?.user_id;
    const role = req.user?.user_id;
    if (!userId || !role) {
      throw new AppError(401, "Unauthorised User");
    }
    const taskId = String(req.params.taskId);
    const attachment = await attachmentService.uploadAttchment({
      taskId,
      userId,
      role,
      file: req.file,
    });
    successResponse(res, { attachment }, 201);
  } catch (e) {
    next(e);
  }
}


export async function listAttachments(
  req: Request,
  res: Response,
  next:NextFunction
){
  try{
    const userId = req.user?.user_id
    const role = req.user?.role
    if(!userId || !role ){
      throw new AppError(401, 'Unauthorized')
    }
    const taskId = String(req.params.taskId)

    const extractedAttachments = await attachmentService.listAttachments(taskId, userId, role )
    successResponse(res, {extractedAttachments})
  }catch(e){
    next(e)
  }
}

