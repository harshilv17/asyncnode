import { ipKeyGenerator, rateLimit } from "express-rate-limit";
import { ERROR_MESSAGES } from "../constants/messages.ts";
import type { thttpError } from "../types/types.ts";

export const runWorkflowRateLimit = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    limit: 10, // max 10 workflow runs per user per minute
    standardHeaders: "draft-8",
    legacyHeaders: false,
    keyGenerator: (req) =>
        req.user?.userId?.toString() ??
        (req.ip ? ipKeyGenerator(req.ip) : "unknown"),
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
});
