import cors from "cors";
import express from "express";
import createHttpError from "http-errors";
import morgan from "morgan";
import { authenticateJWT } from "./middleware/auth";
import { handleError } from "./middleware/error";
import bankRoutes from "./routes/bank";
import roomRoutes from "./routes/room";
import userRoutes from "./routes/user";
import logRoutes from "./routes/log";

const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

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

export default app;
