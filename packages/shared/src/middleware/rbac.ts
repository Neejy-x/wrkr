import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { verifyToken } from "../auth/jwt";

// Extend Express Request interface to include 'user'
declare global {
  namespace Express {
    interface Request {
      user?: {
        user_id: string;
        role: string;
      };
    }
  }
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader?.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ Success: false, message: "Unauthorised: no token provided" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = verifyToken(token);
    req.user = {
      user_id: decoded.userId,
      role: decoded.role,
    };
    next();
  } catch (err) {
    throw err;
  }
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res
      .status(401)
      .json({
        Success: false,
        message: "Unauthorized: user not authenticated",
      });
  }
  const { role } = req.user;
  if (role !== "ADMIN") {
    return res
      .status(403)
      .json({ Success: false, message: `Unauthorized: ${role} not allowed` });
  }
  next();
};
