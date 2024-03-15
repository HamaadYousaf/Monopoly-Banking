import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import env from "../util/validateEnv";

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

        req.token = decoded;

        next();
    } catch (error) {
        res.status(401).send("Not authorized");
    }
};
