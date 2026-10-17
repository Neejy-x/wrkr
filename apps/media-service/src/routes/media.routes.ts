import { NextFunction, Request, Response, Router } from "express";
import { uploadImage } from "../middlewares/upload.middleware";
import * as mediaController from '../controllers/media.contollers'
import { AppError, authenticate } from "shared";

const router = Router()
function handleUpload(req: Request, res: Response, next: NextFunction){
    uploadImage(req, res, (err: unknown) => {
        if (!err){
            return next()
        }
        if(err instanceof AppError){
            return next(err)
        }

        if(typeof err == "object"
            && err !== null
            && "code" in err &&
            err.code === "LIMIT_FILE_SIZE"
        ){
            return next( new AppError(400, "image must be 10mb or smaller"))
        }
        return next(new AppError(400, "invalid image upload"))
    })
}
router.post('/:taskId/attachments', authenticate, handleUpload, mediaController.uploadAttachment)
router.get('/:taskId/attachments', authenticate, mediaController.listAttachments)


export default router;