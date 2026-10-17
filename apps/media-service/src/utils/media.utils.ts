import { Attachmanent } from "./types";



export function convertToPublicMediaAttachment(attachment: Attachmanent){
    return{
        id: attachment.id,
        taskId: attachment.task_id,
        imageUrl: attachment.image_url,
        publicId: attachment.public_id,
        uploadBy: attachment.uploaded_by,
        createdAt: attachment.created_at,
    }
}