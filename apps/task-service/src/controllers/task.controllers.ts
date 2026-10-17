import { NextFunction, Request, Response } from "express";
import * as taskService from "../services/tasks.service";
import { AppError, successResponse } from "shared";


export async function createTask(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.user?.user_id;
    if (!userId) {
      throw new AppError(401, "Forbidden");
    }

    const task = await taskService.createTask(req.body, userId);
    successResponse(res, { task }, 201);
  } catch (e) {
    next(e);
  }
}

export async function listTasks(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.user?.user_id
    const role = req.user?.role
     if (!userId || !role) {
      throw new AppError(401, "Unauthorized User");
    }

    const tasks = await taskService.listTasks(userId, role);

    successResponse(res, { tasks });
  } catch (e) {
    next(e);
  }
}

// export async function listUserTasks(
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) {
//   try {
//     const userId = req.user?.user_id;
//    
//     const tasks = await taskService.listUserTasks(userId);
//     successResponse(res, { tasks });
//   } catch (e) {
//     next(e);
//   }
// }


export async function getSingleTask(
  req: Request,
  res: Response,
  next: NextFunction,
){
  try{
    const role  = req.user?.role
    const userId = req.user?.user_id
    const taskId = String(req.params.id)
    if(!role || !userId){
        throw new AppError(403, 'Forbidden')
    }
    // const {taskId} = req.body
    
    const task = await taskService.getSingleTask(taskId ,userId, role)
    successResponse(res, {task})
  }catch(e){
    next(e)
  }
}

export async function deleteSingleTask(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try{
    const id = String(req.params.id)
    const deletedResult = await taskService.deleteSingleTask(id)
    successResponse(res, deletedResult)
  }catch(e){
    next(e)
  }
}