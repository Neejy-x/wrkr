import { Producer, RecordMetadata } from "kafkajs";
import { createKafkaClient } from "./client";
import { logger } from "../logger/logger";



export async function createProducer(clientId: string): Promise<Producer> {
  const Kafka = createKafkaClient(clientId);

  const producer = Kafka.producer();

  await producer.connect();

  logger.info({ clientId }, `Kafka producer connected`);

  return producer;
}



export async function publishJSON(
  producer: Producer,
  topic: string,
  payload: Record<string, unknown>,
  key?: string,
): Promise<RecordMetadata[]> {
  const result = await producer.send({
    topic,
    messages: [
      {
        key: key ?? null,
        value: JSON.stringify(payload),
      },
    ],
  });
  logger.info({ topic, payload }, "Kafka event published");
  return result;
}



export async function publishJSONSafe(
  producer: Producer | null,
  topic: string,
  payload: Record<string, unknown>,
  key?: string,
): Promise<void> {
  if (!producer) {
    logger.warn({ topic }, "kafka producer is not ready");
    return;
  }

  try {
    await publishJSON(producer, topic, payload, key);
  } catch (e) {
    logger.error({ e, topic }, "kafka publish failed");
  }
}