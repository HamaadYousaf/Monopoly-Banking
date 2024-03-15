import { RequestHandler } from "express";
import createHttpError from "http-errors";
import { prismaInstance } from "../server";

interface CreateRoomBody {
    username: string;
}

export const createRoom: RequestHandler<
    unknown,
    unknown,
    CreateRoomBody,
    unknown
> = async (req, res, next) => {
    const username = req.body.username;

    try {
        if (!username) {
            throw createHttpError(400, "Missing parameters");
        }

        const room = await prismaInstance.room.create({
            data: {
                banker: username,
            },
        });

        const userJoined = await prismaInstance.user.update({
            where: {
                username: username,
            },
            data: {
                roomId: room.id,
            },
        });

        res.status(201).send({ data: { user: userJoined, room: room } });
    } catch (error) {
        next(error);
    }
};

interface JoinLeaveRoomBody {
    username: string;
    roomId: string;
}

export const joinRoom: RequestHandler<
    unknown,
    unknown,
    JoinLeaveRoomBody,
    unknown
> = async (req, res, next) => {
    const username = req.body.username;
    const roomId = req.body.roomId;

    try {
        if (!username || !roomId) {
            throw createHttpError(400, "Missing parameters");
        }

        const isUserInRoom = await prismaInstance.user.findUnique({
            where: {
                username: username,
            },
        });

        if (isUserInRoom?.roomId) {
            throw createHttpError(409, "User is already in a room");
        }

        const userJoined = await prismaInstance.user.update({
            where: {
                username: username,
            },
            data: {
                roomId: roomId,
            },
        });

        const userBank = await prismaInstance.bank.create({
            data: {
                userId: userJoined.id,
                roomId: roomId,
                balance: 0,
            },
        });

        res.status(201).send({ data: { user: userJoined, balance: userBank } });
    } catch (error) {
        next(error);
    }
};

export const leaveRoom: RequestHandler<
    unknown,
    unknown,
    JoinLeaveRoomBody,
    unknown
> = async (req, res, next) => {
    const username = req.body.username;
    const roomId = req.body.roomId;

    try {
        if (!username || !roomId) {
            throw createHttpError(400, "Missing parameters");
        }

        const user = await prismaInstance.user.findUnique({
            where: {
                username: username,
            },
        });

        if (user?.roomId !== roomId || !user.roomId) {
            throw createHttpError(409, "User is not in room");
        }

        const userJoined = await prismaInstance.user.update({
            where: {
                username: username,
            },
            data: {
                roomId: null,
            },
        });

        await prismaInstance.bank.delete({
            where: {
                userId: user.id,
            },
        });

        res.status(201).send({ data: userJoined });
    } catch (error) {
        next(error);
    }
};

export const getRooms: RequestHandler = async (req, res, next) => {
    try {
        const room = await prismaInstance.room.findMany({
            include: {
                users: true,
            },
        });

        if (!room) {
            throw createHttpError(404, "Room not found");
        }

        res.status(200).send({ data: room });
    } catch (error) {
        next(error);
    }
};

export const getRoom: RequestHandler = async (req, res, next) => {
    const roomId = req.params.roomId;

    try {
        const room = await prismaInstance.room.findUnique({
            where: {
                id: roomId,
            },
            include: {
                users: true,
            },
        });

        if (!room) {
            throw createHttpError(404, "Room not found");
        }

        res.status(200).send({ data: room });
    } catch (error) {
        next(error);
    }
};
