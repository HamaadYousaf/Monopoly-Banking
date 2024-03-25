import { RequestHandler } from "express";
import createHttpError from "http-errors";
import moment from "moment";
import { prismaInstance } from "../server";
import { asserIsDefined } from "../util/assertIsDefined";

export const createRoom: RequestHandler = async (req, res, next) => {
    const userId = req.id;

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

        let id = [...Array(6)]
            .map(() => Math.floor(Math.random() * 16).toString(16))
            .join("")
            .toUpperCase();

        let existingRoom = await prismaInstance.room.findFirst({
            where: { id: id },
        });

        while (existingRoom) {
            id = [...Array(6)]
                .map(() => Math.floor(Math.random() * 16).toString(16))
                .join("")
                .toUpperCase();

            existingRoom = await prismaInstance.room.findFirst({
                where: { id: id },
            });
        }

        const room = await prismaInstance.room.create({
            data: {
                id: id,
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

        await prismaInstance.bank.create({
            data: {
                userId: userId,
                roomId: room.id,
                balance: 0,
            },
        });

        await prismaInstance.freeParking.create({
            data: {
                roomId: room.id,
                balance: 0,
            },
        });

        await prismaInstance.log.create({
            data: {
                message: `${user.username} joined the room`,
                time: moment().format("h:mm a"),
                roomId: room.id,
            },
        });

        res.status(201).send({
            id: userJoined.id,
            username: userJoined.username,
            email: userJoined.email,
            roomId: userJoined.roomId,
            token: req.token,
        });
    } catch (error) {
        next(error);
    }
};

export const joinRoom: RequestHandler = async (req, res, next) => {
    const userId = req.id;
    const roomId = req.body.data.roomId;

    try {
        asserIsDefined(userId);

        if (!roomId) {
            throw createHttpError(400, "Missing Room ID");
        }

        const isUserInRoom = await prismaInstance.user.findUnique({
            where: {
                id: userId,
            },
        });

        const room = await prismaInstance.room.findFirst({
            where: {
                id: roomId,
            },
        });

        if (!room) {
            throw createHttpError(400, "Room does not exist");
        }
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

        await prismaInstance.bank.create({
            data: {
                userId: userId,
                roomId: roomId,
                balance: 0,
            },
        });

        res.status(201).send({
            id: userJoined.id,
            username: userJoined.username,
            email: userJoined.email,
            roomId: userJoined.roomId,
            token: req.token,
        });
    } catch (error) {
        next(error);
    }
};

export const leaveRoom: RequestHandler = async (req, res, next) => {
    const userId = req.id;
    const roomId = req.body.data.roomId;

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

        const userLeave = await prismaInstance.user.update({
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

        await prismaInstance.log.create({
            data: {
                message: `${user.username} left the room`,
                time: moment().format("h:mm a"),
                roomId: roomId,
            },
        });

        if (room?.users.length === 0) {
            await prismaInstance.freeParking.delete({
                where: {
                    roomId: roomId,
                },
            });

            await prismaInstance.log.deleteMany({
                where: {
                    roomId: roomId,
                },
            });

            await prismaInstance.room.delete({
                where: {
                    id: roomId,
                },
            });
        }

        res.status(201).send({
            id: userLeave.id,
            username: userLeave.username,
            email: userLeave.email,
            roomId: userLeave.roomId,
            token: req.token,
        });
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
                users: {
                    include: { Bank: true },
                },
                FreeParking: { select: { balance: true } },
            },
        });

        if (!room) {
            throw createHttpError(404, "Room not found");
        }

        res.status(200).send(room);
    } catch (error) {
        next(error);
    }
};

interface SetBankerBody {
    data: {
        username: string;
        roomId: string;
    };
}

export const setBanker: RequestHandler<
    unknown,
    unknown,
    SetBankerBody,
    unknown
> = async (req, res, next) => {
    const userId = req.id;
    const username = req.body.data.username;
    const roomId = req.body.data.roomId;

    try {
        asserIsDefined(userId);

        if (!username || !roomId) {
            throw createHttpError(400, "Missing parameters");
        }

        const oldBanker = await prismaInstance.user.findUnique({
            where: {
                id: userId,
            },
        });

        const newBanker = await prismaInstance.user.findUnique({
            where: {
                username: username,
            },
        });

        const room = await prismaInstance.room.findFirst({
            where: {
                id: roomId,
            },
        });

        if (!room) {
            throw createHttpError(400, "Room does not exist");
        }

        if (oldBanker?.roomId !== roomId || newBanker?.roomId !== roomId) {
            throw createHttpError(409, "User is not in the room");
        }

        const newRoom = await prismaInstance.room.update({
            where: { id: roomId },
            data: { banker: newBanker.username },
        });

        res.status(201).send(newRoom);
    } catch (error) {
        next(error);
    }
};
