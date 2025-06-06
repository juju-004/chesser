import cors from "cors";
import "dotenv/config";
import type { NextFunction, Request, Response } from "express";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

import session from "./middleware/session.js";
import routes from "./routes/index.js";
import { init as initSocket } from "./socket/index.js";
import { connectDatabase } from "./db/index.js";
import { errorHandler } from "./db/helper.js";

const corsConfig = {
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true
};

const app = express();
const server = createServer(app);

// MongoDB connection
await connectDatabase();

// Middleware
app.use(cors(corsConfig));
app.use(express.json());
app.set("trust proxy", 1);
app.use(session);
app.use("/v1", routes);
app.use(errorHandler);

// Socket.io
export const io = new Server(server, {
    cors: corsConfig,
    pingInterval: 30000,
    pingTimeout: 50000
});

io.use((socket, next) => {
    session(socket.request as Request, {} as Response, next as NextFunction);
});

io.use((socket, next) => {
    const session = socket.request.session;
    if (session && session.user) {
        next();
    } else {
        console.log("io.use: no session");
        socket.disconnect();
    }
});

initSocket();

const port = process.env.PORT || 3001;
server.listen(port, () => {
    console.log(`chessu api server listening on :${port}`);
});
