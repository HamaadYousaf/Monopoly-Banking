import { RequestHandler } from "express";
import createHttpError from "http-errors";
import { prismaInstance } from "../server";

export const getLogs: RequestHandler = async (req, res, next) => {
    const roomId = req.params.roomId;

    try {
        if (!roomId) {
            throw createHttpError(400, "Missing parameters");
        }

        const room = await prismaInstance.room.findUnique({
            where: {
                id: roomId,
            },
        });

        if (!room) {
            throw createHttpError(400, "Room not found");
        }

        const logs = await prismaInstance.log.findMany({
            where: {
                roomId: roomId,
            },
            orderBy: {
                createdAt: "asc",
            },
        });

        if (!logs) {
            throw createHttpError(400, "Logs not found");
        }

        res.status(200).send({ data: logs });
    } catch (error) {
        next(error);
    }
};

export const addLog = async () => {};
export const deleteLogs = async () => {};
