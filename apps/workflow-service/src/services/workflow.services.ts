import { AppError, createConsumer, logger, runConsumer, TOPICS } from "shared";
import { DomainEvent } from "../utils/types";
import * as workflowRepo from "../repositories/workflow.repositories";
import { convertToPublicWorkflow } from "../utils/workflows.utils";

async function handleDomainEvent(rawData: DomainEvent) {
  if (!rawData.eventType || !rawData.taskId || !rawData.userId) {
    logger.warn({ rawData }, "invalid domain event");
    return;
  }
  const workflow = await workflowRepo.createWorkflow({
    taskId: rawData.taskId,
    eventType: rawData.eventType,
    message: rawData.message || rawData.eventType,
    createdBy: rawData.userId || "",
  });

  logger.info(
    { workflowId: workflow.id, eventType: workflow.event_type },
    "workflow row created",
  );
}

export async function startKafka() {
  const consumer = await createConsumer(
    "workflow-service",
    "workflow-service-group",
  );

  void runConsumer(
    consumer,
    [TOPICS.TASK_EVENTS, TOPICS.MEDIA_EVENTS],
    async ({ message }) => {
      const value = message.value?.toString();
      if (!value) return;

      try {
        await handleDomainEvent(JSON.parse(value) as DomainEvent);
      } catch (e) {
        logger.error({ e }, "workflow consumer failed");
      }
    },
  );
}

export async function listWorkflowsByTask(
  userId: string,
  role: string,
  taskId: string,
) {
  const task = await workflowRepo.findTaskOwner(taskId);
  if (!task) {
    throw new AppError(404, "Task not found");
  }
  console.log(task.created_by)
  console.log(role)
  if (role !== "ADMIN" && task.created_by !== userId) {
    throw new AppError(403, "Forbidden");
  }

  const rows = await workflowRepo.listWorkflowsByTaskId(taskId);

  return rows.map(convertToPublicWorkflow);
}
