import { createProducer, publishJSONSafe, TOPICS } from "shared";

let producer: Awaited<ReturnType<typeof createProducer>> | null = null;

export async function initKafka() {
  producer = await createProducer("media-service");
}

export async function publishAttachmentEvent(taskId: string, userId: string) {
  await publishJSONSafe(
    producer,
    TOPICS.MEDIA_EVENTS,
    {
      eventType: "attachment.uploaded",
      taskId,
      userId,
      message: "Attachment uploaded",
      timestamp: new Date().toISOString(),
    },
    taskId,
  );
}
