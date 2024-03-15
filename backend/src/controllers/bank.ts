import { RequestHandler } from "express";
import createHttpError from "http-errors";
import { prismaInstance } from "../server";

export const getBalance: RequestHandler = async (req, res, next) => {
    const userId = req.params.userId;

    try {
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

export const transfer = () => {};

export const claimFreeParking = () => {};

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

        res.status(201).send({ data: newUserBank });
    } catch (error) {
        next(error);
    }
};
