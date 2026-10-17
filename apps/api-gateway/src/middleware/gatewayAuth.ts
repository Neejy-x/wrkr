import type { Request, Response, NextFunction } from "express";
import { AppError, verifyToken } from "shared";
import { getAllowedRoles, isPublicRoute } from "../rbac";

const IDENTITY_HEADERS = ["x-user-id", "x-user-role", "x-gateway-secret"];

function stripIdentityHeaders(req: Request) {
  for (const header of IDENTITY_HEADERS) {
    delete req.headers[header];
  }
}

function attachGatewayRequest(req: Request) {
  const secret = process.env.GATEWAY_SECRET;
  if (!secret) {
    throw new AppError(500, "Gateway Secret is not set");
  }

  req.headers["x-gateway-secret"] = secret;
}

function requestPath(req: Request) {
  const combined = `${req.baseUrl}${req.path}`;
  if (combined.length > 1 && combined.endsWith("/")) {
    return combined.slice(0, -1);
  }
  return combined || "/";
}

function attachUserHeaders(req: Request, userId: string, role: string) {
  req.headers["x-user-id"] = userId;
  req.headers["x-user-role"] = role;
}
export function gatewayAuth(req: Request, _res: Response, next: NextFunction) {
  console.log(
    `\n🚀 [GATEWAY TRIPWIRE] Method: ${req.method} | Path: ${req.baseUrl}${req.path}`,
  );
  try {
    stripIdentityHeaders(req);
    attachGatewayRequest(req);

    const path = requestPath(req);

    //if public route no need for validaiton
    if (isPublicRoute(req.method, path)) {
      console.log("REQREQREQ");
      return next();
    }

    const authHeader = req.header("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      throw new AppError(401, "Missing or invalid auth token");
    }

    const token = authHeader.slice("Bearer ".length).trim();

    const payload = verifyToken(token);
    console.log(payload, "payloadpayloadpayloadpayload");

    //RBAC Check
    const allowedRoles = getAllowedRoles(req.method, path);

    if (!allowedRoles) {
      throw new AppError(404, "Route not found");
    }
console.log("RECEIVED:", JSON.stringify(req.headers['x-gateway-secret']));
console.log("EXPECTED:", JSON.stringify(process.env.GATEWAY_SECRET));
    //forbidden
    if (!allowedRoles.includes(payload.role)) {
      throw new AppError(403, "You do not have access to this route");
    }

    attachUserHeaders(req, payload.userId, payload.role);
    next();
  } catch (e) {
    // if (e instanceof AppError) {
    //   return next(e);
    // }
    // //insome caa=ses we dont know what jwtverify - return generic 401, error
    // return next(new AppError(509, "E no concern you"));
    console.error("Error in gatewayAuth", e);
  }
}
