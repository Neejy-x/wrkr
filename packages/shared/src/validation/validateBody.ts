import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";
import { AppError } from "../errors/AppError";


export function validateBody(schema: ZodSchema){

    return (req: Request, _res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body)

        if(!result.success){
            const message = result.error.issues.map(issues => issues.message).join(", ")
            return next(new AppError(400, message))
        }

        req.body = result.data
        next();
    }
}