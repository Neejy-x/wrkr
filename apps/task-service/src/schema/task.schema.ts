import { z } from "zod";

export const createTaskSchema = z.object({
    title: z.string().min(5,'title is required' )
})


export type createTaskInput = z.infer<typeof createTaskSchema>
