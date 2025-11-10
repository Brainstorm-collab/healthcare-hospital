// Tiny helper to avoid repeating try/catch in every controller.
// Any rejected promise is forwarded to Express error middleware.
import type { NextFunction, Request, Response } from "express";

export const asyncHandler =
  (
    handler: (req: Request, res: Response, next: NextFunction) => Promise<unknown>,
  ) =>
  (req: Request, res: Response, next: NextFunction) => {
    handler(req, res, next).catch(next);
  };


