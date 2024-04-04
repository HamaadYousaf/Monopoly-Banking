import { RequestHandler } from "express";
import createHttpError from "http-errors";
import moment from "moment";
import { prismaInstance } from "../server";
import { asserIsDefined } from "../util/assertIsDefined";

export const getBalance: RequestHandler = async (req, res, next) => {
    const userId = req.token;

    try {
        asserIsDefined(userId);

        const balance = await prismaInstance.bank.findFirst({
            where: {
                userId: userId,
            },
        });

        if (!balance) {
            throw createHttpError(404, "Balance not found");
        }

        res.status(200).send({ data: balance });
    } catch (error) {
        next(error);
    }
};

interface TransferBody {
    data: {
        usernameReceive: string;
        roomId: string;
        amount: number;
    };
}

export const transfer: RequestHandler<
    unknown,
    unknown,
    TransferBody,
    unknown
> = async (req, res, next) => {
    const userIdSend = req.id;
    const usernameReceive = req.body.data.usernameReceive;
    const roomId = req.body.data.roomId;
    const amount = req.body.data.amount;

    try {
        if (!userIdSend || !usernameReceive || !roomId || !amount) {
            throw createHttpError(400, "Missing parameters");
        }

        const userBankSend = await prismaInstance.bank.findFirst({
            where: {
                userId: userIdSend,
            },
            include: {
                user: true,
            },
        });

        const user = await prismaInstance.user.findUnique({
            where: { username: usernameReceive },
        });

        if (userIdSend === user?.id) {
            throw createHttpError(
                400,
                "User cannot be both sender and reciever"
            );
        }

        const userBankReceive = await prismaInstance.bank.findFirst({
            where: {
                userId: user?.id,
            },
            include: {
                user: true,
            },
        });

        if (
            userBankSend?.roomId !== roomId ||
            userBankReceive?.roomId !== roomId ||
            !userBankSend ||
            !userBankReceive
        ) {
            throw createHttpError(409, "Users is not in room");
        }

        const newBalanceSend = userBankSend.balance - amount;

        if (newBalanceSend < 0) {
            throw createHttpError(400, "Not enough funds");
        }

        const newBalanceRecieve = userBankReceive.balance + amount;

        await prismaInstance.bank.update({
            where: {
                userId: userIdSend,
            },
            data: {
                balance: newBalanceSend,
            },
        });

        await prismaInstance.bank.update({
            where: {
                userId: user?.id,
            },
            data: {
                balance: newBalanceRecieve,
            },
        });

        await prismaInstance.log.create({
            data: {
                message: `${userBankSend.user.username} sent $${amount} to ${userBankReceive.user.username}`,
                time: moment().format("h:mm a"),
                roomId: roomId,
            },
        });

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

        res.status(201).send(room);
    } catch (error) {
        next(error);
    }
};

interface DepositBody {
    data: {
        username: string;
        roomId: string;
        amount: number;
    };
}

export const deposit: RequestHandler<
    unknown,
    unknown,
    DepositBody,
    unknown
> = async (req, res, next) => {
    const username = req.body.data.username;
    const roomId = req.body.data.roomId;
    const amount = req.body.data.amount;

    try {
        if (!username || !roomId || !amount) {
            throw createHttpError(400, "Missing parameters");
        }

        const user = await prismaInstance.user.findUnique({
            where: { username: username },
        });

        if (!user || !user.id) {
            throw createHttpError(409, "Cannot find user");
        }

        const userBank = await prismaInstance.bank.findFirst({
            where: {
                userId: user.id,
            },
            include: {
                user: true,
            },
        });

        if (userBank?.roomId !== roomId || !userBank) {
            throw createHttpError(409, "User is not in room");
        }

        const newBalance = amount + userBank.balance;

        await prismaInstance.bank.update({
            where: {
                userId: user.id,
            },
            data: {
                balance: newBalance,
            },
        });

        await prismaInstance.log.create({
            data: {
                message: `The Bank sent $${amount} to ${userBank.user.username}`,
                time: moment().format("h:mm a"),
                roomId: roomId,
            },
        });

        res.status(201).send({ success: true });
    } catch (error) {
        next(error);
    }
};

export const getFreeParking: RequestHandler = async (req, res, next) => {
    const userId = req.token;

    try {
        asserIsDefined(userId);

        const user = await prismaInstance.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (!user || !user.roomId) {
            throw createHttpError(409, "User not found");
        }

        const freeParking = await prismaInstance.freeParking.findUnique({
            where: {
                roomId: user.roomId,
            },
        });

        if (!freeParking) {
            throw createHttpError(409, "Could not find free parking");
        }

        res.status(200).send({ data: freeParking });
    } catch (error) {
        next(error);
    }
};

interface ClaimParking {
    userId: string;
    roomId: string;
}

export const claimFreeParking: RequestHandler<
    unknown,
    unknown,
    ClaimParking,
    unknown
> = async (req, res, next) => {
    const userId = req.body.userId;
    const roomId = req.body.roomId;

    try {
        if (!userId || !roomId) {
            throw createHttpError(400, "Missing parameters");
        }

        const userBank = await prismaInstance.bank.findFirst({
            where: {
                userId: userId,
            },
            include: {
                user: true,
            },
        });

        const freeParking = await prismaInstance.freeParking.findUnique({
            where: {
                roomId: roomId,
            },
        });

        if (userBank?.roomId !== roomId || !userBank || !freeParking) {
            throw createHttpError(409, "User is not in room");
        }

        const newBalance = freeParking.balance + userBank.balance;

        const newUserBank = await prismaInstance.bank.update({
            where: {
                userId: userId,
            },
            data: {
                balance: newBalance,
            },
        });

        const newParking = await prismaInstance.freeParking.update({
            where: {
                roomId: roomId,
            },
            data: {
                balance: 0,
            },
        });

        const log = await prismaInstance.log.create({
            data: {
                message: `${userBank.user.username} claimed $${freeParking.balance} from free parking`,
                time: moment().format("h:mm a"),
                roomId: roomId,
            },
        });

        res.status(201).send({
            data: { user: newUserBank, parking: newParking, log: log },
        });
    } catch (error) {
        next(error);
    }
};

interface SendParkingBody {
    data: {
        roomId: string;
        amount: number;
    };
}

export const sendFreeParking: RequestHandler<
    unknown,
    unknown,
    SendParkingBody,
    unknown
> = async (req, res, next) => {
    const userId = req.id;
    const roomId = req.body.data.roomId;
    const amount = req.body.data.amount;

    try {
        if (!userId || !roomId || !amount) {
            throw createHttpError(400, "Missing parameters");
        }

        const userBank = await prismaInstance.bank.findFirst({
            where: {
                userId: userId,
            },
            include: {
                user: true,
            },
        });

        const freeParking = await prismaInstance.freeParking.findUnique({
            where: {
                roomId: roomId,
            },
        });

        if (userBank?.roomId !== roomId || !userBank || !freeParking) {
            throw createHttpError(409, "User is not in room");
        }

        const newBalance = userBank.balance - amount;

        if (newBalance < 0) {
            throw createHttpError(400, "Not enough funds");
        }

        const parkingBalance = freeParking.balance + amount;

        await prismaInstance.bank.update({
            where: {
                userId: userId,
            },
            data: {
                balance: newBalance,
            },
        });

        await prismaInstance.freeParking.update({
            where: {
                roomId: roomId,
            },
            data: {
                balance: parkingBalance,
            },
        });

        await prismaInstance.log.create({
            data: {
                message: `${userBank.user.username} sent $${amount} to free parking`,
                time: moment().format("h:mm a"),
                roomId: roomId,
            },
        });

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

        res.status(201).send(room);
    } catch (error) {
        next(error);
    }
};
