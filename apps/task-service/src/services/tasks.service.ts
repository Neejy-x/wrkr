import { AppError } from "shared";
import * as taskRepo from "../repositories/task.repository";
import { createTaskInput } from "../schema/task.schema";
import { convertToPublicTask } from "../utils/task.utils";
import { publishTaskEvent } from "../utils/kafka";

export async function createTask(input: createTaskInput, userId: string) {
  const newlyCreatedTask = await taskRepo.createNewTask({
    title: input.title,
    createdBy: userId,
  });

  await publishTaskEvent(newlyCreatedTask.id, userId)
  return convertToPublicTask(newlyCreatedTask);
}

export async function listTasks(userId: string, role: string) {

  if(role === 'ADMIN'){
    const tasks = await taskRepo.listTasks();
    return tasks.map(convertToPublicTask);
  }

 const tasks = await taskRepo.listUserTasks(userId);
  
 return tasks.map(convertToPublicTask);

}



export async function getSingleTask(taskId: string, userId: string, role: string){
    const task = await taskRepo.fetchTaskById(taskId)
    if(!task){
        throw new AppError(404, 'Task not Found')
    }

    if(task.created_by != userId || role != 'ADMIN' ){
        throw new AppError(403, 'Unauthorized Access')
    }

    return convertToPublicTask(task)
}

export async function deleteSingleTask(id: string){
const isDeleted = await taskRepo.deleteSingleTaskById(id)
if(!isDeleted){
  throw new AppError(404, 'Task Not Found')
}
return {id}
}