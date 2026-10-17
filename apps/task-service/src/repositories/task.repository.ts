import { getPool } from "shared";
import { Task } from "../utils/types";

export async function createNewTask(input: {
  title: string;
  createdBy: string;
}): Promise<Task> {
  const result = await getPool().query<Task>(
    `
    INSERT INTO tasks(title, created_by)
    VALUES($1, $2)
    RETURNING id, title, status, created_by, created_at, updated_at
    
    `,
    [input.title, input.createdBy],
  );
  return result.rows[0];
}

//create user and admin functions

export async function listTasks(): Promise<Task[]> {
  const result = await getPool().query<Task>(
    `
    SELECT id, title, status, created_by, created_at, updated_at
    FROM tasks
    ORDER BY created_at DESC
    `,
  );
  return result.rows;
}

export async function listUserTasks(userId: string): Promise<Task[]> {
  const result = await getPool().query<Task>(
    `
    SELECT id, title, status, created_by, created_at, updated_at
    FROM tasks
    WHERE created_by = $1
    ORDER BY created_at DESC
    
    `,
    [userId],
  );
  return result.rows;
}

export async function fetchTaskById(taskId: string): Promise<Task> {
  const result = await getPool().query<Task>(
    `
        SELECT id, title, status, created_by, created_at, updated_at
        FROM tasks
        WHERE id = $1
        
        `,
    [taskId],
  );
  return result.rows[0];
}

export async function deleteSingleTaskById(taskId: string): Promise<boolean> {
  const result = await getPool().query(`DELETE FROM tasks WHERE id = $1`, [
    taskId,
  ]);
  return (result.rowCount ?? 0) > 0;
}
