import { Request, Response, NextFunction } from "express";

// Define a custom error type for extended error handling
interface CustomError extends Error {
    statusCode?: number;
}

export const errorHandler = (
    err: CustomError,
    req: Request,
    res: Response,
    next: NextFunction // Required for Express error handling middleware
): void => {
    const statusCode = err.statusCode || 500; // Default to 500 if no status code is provided
    const message = err.message || "Internal Server Error"; // Default message if none is provided

    res.status(statusCode).json({
        message
    });

    next();
};

// Define the type for an async route handler
type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;

export const asyncHandler = (fn: AsyncHandler) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
