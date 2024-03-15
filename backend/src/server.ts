import { PrismaClient } from "@prisma/client";
import "dotenv/config";
import app from "./app";
import env from "./util/validateEnv";

export const prismaInstance = new PrismaClient();

const PORT = env.PORT;

app.listen(PORT, () => {
    console.log("Server running on port: " + PORT);
});
