import { NextFunction, Request, Response } from "express";
import { isHttpError } from "http-errors";

export const handleError = (
    error: unknown,
    req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction
) => {
    console.error(error);

    let errorMsg = "An error occured";
    let statusCode = 500;

    if (isHttpError(error)) {
        errorMsg = error.message;
        statusCode = error.status;
    }

    res.status(statusCode).json({ error: errorMsg });
};
