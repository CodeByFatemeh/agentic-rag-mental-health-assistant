import { Request, Response, NextFunction } from "express";
import { handleApiError } from "../utils/handleApiError.js";

export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(`[ERROR] ${err}`);

  // Use the handleApiError function to format errors
  const { message, statusCode } = handleApiError("Global Error", err);

  res.status(statusCode).json({ success: false, message });
};
