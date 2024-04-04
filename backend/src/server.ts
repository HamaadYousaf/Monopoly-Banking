import { PrismaClient } from "@prisma/client";
import "dotenv/config";
import { server } from "./app";
import env from "./util/validateEnv";

export const prismaInstance = new PrismaClient();

const PORT = env.PORT;

server.listen(PORT, () => {
    console.log("Server running on port: " + PORT);
});
