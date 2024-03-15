import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import jwt, { JwtPayload } from "jsonwebtoken";
import env from "../util/validateEnv";

interface userAuthRequest extends Request {
    token: string | JwtPayload;
}

export const authenticateJWT = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = req.header("authorization")?.split(" ")[1];

        if (!token) {
            throw createHttpError(401, "Unauthorized");
        }

        const decoded = jwt.verify(token, env.SECRET_KEY);

        if (!decoded) {
            throw createHttpError(401, "Unauthorized");
        }

        (req as userAuthRequest).token = decoded;

        next();
    } catch (error) {
        res.status(401).send("Not authorized");
    }
};
