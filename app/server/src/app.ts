import express, { json } from "express";
import cors from "cors";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import { authRouter } from "./modules/auth/auth.route.ts";
import { globalErrorHandler } from "./middlewares/globalErrorHandler.ts";
import { swaggerSpec } from "./config/swagger.ts";
import { workflowRouter } from "./modules/workflows/workflow.route.ts";
import { executionRouter } from "./modules/executions/execution.route.ts";
import { webhookRouter } from "./modules/executions/webhook.route.ts";
import {authenticate} from "./middlewares/auth.middleware.ts";
import cookieParser from "cookie-parser"; // Import cookie-parser


import { rateLimit } from 'express-rate-limit'
import { ERROR_MESSAGES } from "./constants/messages.ts";
import type { thttpError } from "./types/types.ts";



const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
	// store: ... , // Redis, Memcached, etc. See below.
	handler: (req, res) => {
		const response: thttpError = {
			success: false,
			status: 429,
			message: ERROR_MESSAGES.RATE_LIMIT_EXCEEDED,
			request: {
				ip: req.ip || "",
				method: req.method || "",
				url: req.url || "",
			},
			trace: null,
		};
		res.status(429).json(response);
	},
})


const app = express();

app.use(limiter);

app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
}));
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser()); // Add this line to parse cookies
app.use(express.urlencoded({ extended: true }));

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.get("/api/docs.json", (_req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
});



app.use('/api/v1/auth', authRouter);
app.use('/api/v1/workflows', authenticate, workflowRouter);
app.use('/api/v1/workflows', authenticate, executionRouter);
app.use('/api/v1/webhooks', webhookRouter);




// Global error handler
app.use(globalErrorHandler);

export default app;
