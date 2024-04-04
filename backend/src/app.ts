import cors from "cors";
import express from "express";
import http from "http";
import createHttpError from "http-errors";
import morgan from "morgan";
import { Server } from "socket.io";
import { authenticateJWT } from "./middleware/auth";
import { handleError } from "./middleware/error";
import bankRoutes from "./routes/bank";
import logRoutes from "./routes/log";
import roomRoutes from "./routes/room";
import userRoutes from "./routes/user";

export const app = express();
export const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
    },
});

export const ioInstance = io.on("connection", (socket) => {
    socket.on("join-room", (id) => {
        socket.join(id);
    });

    socket.on("update", (id) => {
        io.to(id).emit("rerender");
    });
    socket.on("disconnect", () => {
        console.log(`Disconnected: ${socket.id}`);
    });
});

app.use(morgan("dev"));
app.use(express.json());
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

// Routes
app.use("/api/user", userRoutes);
app.use(authenticateJWT);
app.use("/api/room", roomRoutes);
app.use("/api/bank", bankRoutes);
app.use("/api/logs", logRoutes);

app.use((req, res, next) => {
    next(createHttpError(404, "Endpoint not found"));
});

app.use(handleError);
