import {Request, Response, NextFunction} from 'express'
import { AppError } from './AppError'
import { logger } from '../logger/logger'

export function errorHandler (
    err: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
){
    console.error('ERROR: ', err)
    
    if( err instanceof AppError){
        return res.status(err.statusCode).json({
            success: false,
            message: err.message
        })
    }
    

    return res.status(500).json({
        success: false,
        message: 'Internal server error'
    })
}