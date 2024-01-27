// External Modules
import jwt from "jsonwebtoken";
import rateLimit, { RateLimitRequestHandler } from "express-rate-limit";
import { NextFunction, Request, Response } from "express";

// Local Modules
import { getJwtSecretKey } from "./utils";

// Constants
import { UNAUTHENTICATED_ROUTES } from "../constants/constant";

export default class AppHelper {
  static isUnauthenticatedRoute = (req: Request): boolean => {
    const url = req.url;

    return UNAUTHENTICATED_ROUTES.some((route) => {
      return url.startsWith(route);
    });
  };

  static rateLimiter = (): RateLimitRequestHandler => {
    return rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs,
      message: "Too many requests, please try again later.",
    });
  };

  static rateLimiterError = (
    err: any,
    _: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (err instanceof rateLimit) {
      const errorResponse = {
        error: {
          message: "Too many requests.",
          code: "RATE_LIMITED",
          details: "Too many requests, please try again later.",
        },
      };
      res.status(429).send(errorResponse);
    } else {
      next(err);
    }
  };

  static verifyToken = (
    req: Request,
    res: Response,
    next: NextFunction
  ): Response<any, Record<string, any>> | void => {
    if (this.isUnauthenticatedRoute(req)) return next();

    const bearerHeader = req.headers["authorization"];
    if (!bearerHeader) {
      const errorResponse = {
        error: {
          message: "Access token is required",
          code: "TOKEN_REQUIRED",
          details:
            "Please provide an access token as part of the authorization header.",
        },
      };
      return res.status(401).send(errorResponse);
    }

    const bearerToken = bearerHeader.split(" ")[1];

    try {
      // verify will throw error if token is invalid
      jwt.verify(bearerToken, getJwtSecretKey());
      next();
    } catch (err) {
      const errorResponse = {
        error: {
          message: "Access token is invalid",
          code: "INVALID_TOKEN",
          details: JSON.stringify(err),
        },
      };
      return res.status(401).send(errorResponse);
    }
  };
}
