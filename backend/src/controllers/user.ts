import bcrypt from "bcrypt";
import { RequestHandler } from "express";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import { prismaInstance } from "../server";
import env from "../util/validateEnv";

export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {
    try {
        if (!req.token) {
            throw createHttpError(401, "Not Authenticated");
        }

        const user = await prismaInstance.user.findUnique({
            where: {
                id: req.token,
            },
        });

        if (!user) {
            throw createHttpError(401, "Not Authenticated");
        }

        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

interface LoginBody {
    data: {
        username: string;
        password: string;
    };
}

export const login: RequestHandler<
    unknown,
    unknown,
    LoginBody,
    unknown
> = async (req, res, next) => {
    const username = req.body.data.username;
    const password = req.body.data.password;

    try {
        if (!username || !password) {
            throw createHttpError(400, "Missing parameters");
        }

        const user = await prismaInstance.user.findUnique({
            where: { username: username },
        });

        if (!user) {
            throw createHttpError(401, "Invalid credentials");
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            throw createHttpError(401, "Invalid credentials", {
                expiresIn: 300,
            });
        }

        const token = jwt.sign(user.id, env.SECRET_KEY);

        res.status(200).send({
            data: {
                id: user.id,
                username: user.username,
                email: user.email,
                roomId: user.roomId,
                auth: true,
                token: token,
            },
        });
    } catch (error) {
        next(error);
    }
};

interface RegisterBody {
    username: string;
    email: string;
    password: string;
}

export const register: RequestHandler<
    unknown,
    unknown,
    RegisterBody,
    unknown
> = async (req, res, next) => {
    const username = req.body.username;
    const email = req.body.email;
    const passwordRaw = req.body.password;

    try {
        if (!username || !email || !passwordRaw) {
            throw createHttpError(400, "Missing parameters");
        }

        const isUniqueUsername = await prismaInstance.user.findFirst({
            where: { username: username },
        });

        if (isUniqueUsername) {
            throw createHttpError(409, "Username already exists");
        }

        const isUniqueEmail = await prismaInstance.user.findFirst({
            where: { email: email },
        });

        if (isUniqueEmail) {
            throw createHttpError(409, "Email already exists");
        }

        const passwordHashed = await bcrypt.hash(passwordRaw, 10);

        const user = await prismaInstance.user.create({
            data: {
                username: username,
                email: email,
                password: passwordHashed,
            },
        });

        res.status(201).send({ data: user });
    } catch (error) {
        next(error);
    }
};

export const logout = () => {};
