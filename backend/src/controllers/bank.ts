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
    userIdSend: string;
    userIdReceive: string;
    roomId: string;
    amount: number;
}

export const transfer: RequestHandler<
    unknown,
    unknown,
    TransferBody,
    unknown
> = async (req, res, next) => {
    const userIdSend = req.body.userIdSend;
    const userIdReceive = req.body.userIdReceive;
    const roomId = req.body.roomId;
    const amount = req.body.amount;

    try {
        if (!userIdSend || !userIdReceive || !roomId || !amount) {
            throw createHttpError(400, "Missing parameters");
        }

        if (userIdSend === userIdReceive) {
            throw createHttpError(
                400,
                "User cannot be both sender and reciever"
            );
        }

        const userBankSend = await prismaInstance.bank.findFirst({
            where: {
                userId: userIdSend,
            },
            include: {
                user: true,
            },
        });

        const userBankReceive = await prismaInstance.bank.findFirst({
            where: {
                userId: userIdReceive,
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

        const newUserBankSend = await prismaInstance.bank.update({
            where: {
                userId: userIdSend,
            },
            data: {
                balance: newBalanceSend,
            },
        });

        const newUserBankReceive = await prismaInstance.bank.update({
            where: {
                userId: userIdReceive,
            },
            data: {
                balance: newBalanceRecieve,
            },
        });

        const log = await prismaInstance.log.create({
            data: {
                message: `${userBankSend.user.username} sent $${amount} to ${userBankReceive.user.username}`,
                time: moment().format("h:mm a"),
                roomId: roomId,
            },
        });

        res.status(201).send({
            data: {
                sender: newUserBankSend,
                reciever: newUserBankReceive,
                log: log,
            },
        });
    } catch (error) {
        next(error);
    }
};

interface DepositBody {
    userId: string;
    roomId: string;
    amount: number;
}

export const deposit: RequestHandler<
    unknown,
    unknown,
    DepositBody,
    unknown
> = async (req, res, next) => {
    const userId = req.body.userId;
    const roomId = req.body.roomId;
    const amount = req.body.amount;

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

        if (userBank?.roomId !== roomId || !userBank) {
            throw createHttpError(409, "User is not in room");
        }

        const newBalance = amount + userBank.balance;

        const newUserBank = await prismaInstance.bank.update({
            where: {
                userId: userId,
            },
            data: {
                balance: newBalance,
            },
        });

        const log = await prismaInstance.log.create({
            data: {
                message: `The Bank sent $${amount} to ${userBank.user.username}`,
                time: moment().format("h:mm a"),
                roomId: roomId,
            },
        });

        res.status(201).send({ data: { user: newUserBank, log: log } });
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
    roomId: string;
    amount: number;
}

export const sendFreeParking: RequestHandler<
    unknown,
    unknown,
    SendParkingBody,
    unknown
> = async (req, res, next) => {
    const userId = req.token;
    const roomId = req.body.roomId;
    const amount = req.body.amount;

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

        const newUserBank = await prismaInstance.bank.update({
            where: {
                userId: userId,
            },
            data: {
                balance: newBalance,
            },
        });

        const newFreeParking = await prismaInstance.freeParking.update({
            where: {
                roomId: roomId,
            },
            data: {
                balance: parkingBalance,
            },
        });

        const log = await prismaInstance.log.create({
            data: {
                message: `${userBank.user.username} sent $${amount} to free parking`,
                time: moment().format("h:mm a"),
                roomId: roomId,
            },
        });

        res.status(201).send({
            data: { user: newUserBank, parking: newFreeParking, log: log },
        });
    } catch (error) {
        next(error);
    }
};
