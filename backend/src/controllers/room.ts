import { RequestHandler } from "express";
import createHttpError from "http-errors";
import { prismaInstance } from "../server";
import { asserIsDefined } from "../util/assertIsDefined";

export const createRoom: RequestHandler = async (req, res, next) => {
    const userId = req.token;

    try {
        asserIsDefined(userId);

        const user = await prismaInstance.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (!user) {
            throw createHttpError(401, "User not found");
        }

        if (user.roomId) {
            throw createHttpError(409, "User is already in a room");
        }

        const room = await prismaInstance.room.create({
            data: {
                banker: user.username,
            },
        });

        const userJoined = await prismaInstance.user.update({
            where: {
                id: userId,
            },
            data: {
                roomId: room.id,
            },
        });

        const userBank = await prismaInstance.bank.create({
            data: {
                userId: userId,
                roomId: room.id,
                balance: 0,
            },
        });

        const freeParking = await prismaInstance.freeParking.create({
            data: {
                roomId: room.id,
                balance: 0,
            },
        });

        res.status(201).send({
            data: {
                user: userJoined,
                room: room,
                bank: userBank,
                freeParking: freeParking,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const joinRoom: RequestHandler = async (req, res, next) => {
    const userId = req.token;
    const roomId = req.body.roomId;

    try {
        asserIsDefined(userId);

        if (!roomId) {
            throw createHttpError(400, "Missing parameters");
        }

        const isUserInRoom = await prismaInstance.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (isUserInRoom?.roomId) {
            throw createHttpError(409, "User is already in a room");
        }

        const userJoined = await prismaInstance.user.update({
            where: {
                id: userId,
            },
            data: {
                roomId: roomId,
            },
        });

        const userBank = await prismaInstance.bank.create({
            data: {
                userId: userId,
                roomId: roomId,
                balance: 0,
            },
        });

        res.status(201).send({ data: { user: userJoined, balance: userBank } });
    } catch (error) {
        next(error);
    }
};

export const leaveRoom: RequestHandler = async (req, res, next) => {
    const userId = req.token;
    const roomId = req.body.roomId;

    try {
        asserIsDefined(userId);

        if (!roomId) {
            throw createHttpError(400, "Missing parameters");
        }

        const user = await prismaInstance.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (user?.roomId !== roomId || !user?.roomId) {
            throw createHttpError(409, "User is not in room");
        }

        const userJoined = await prismaInstance.user.update({
            where: {
                id: userId,
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

        const room = await prismaInstance.room.findUnique({
            where: {
                id: roomId,
            },
            include: {
                users: true,
            },
        });

        if (room?.users.length === 0) {
            await prismaInstance.room.delete({
                where: {
                    id: roomId,
                },
            });
        }

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
                FreeParking: true,
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
                FreeParking: true,
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
