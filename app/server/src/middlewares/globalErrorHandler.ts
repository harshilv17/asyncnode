import type { thttpError } from "../types/types.js";
import type { Request, Response, NextFunction } from "express";
import { ERROR_MESSAGES } from "../constants/messages.ts";

const isHttpError = (err: unknown): err is thttpError => {
    return (
        typeof err === "object" &&
        err !== null &&
        "success" in err &&
        (err as thttpError).success === false &&
        "status" in err &&
        "message" in err
    );
};

export const globalErrorHandler = (
    err: unknown,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (res.headersSent) {
        return next(err);
    }

    if (isHttpError(err)) {
        return res.status(err.status).json(err);
    }

    const response: thttpError = {
        success: false,
        status: 500,
        message: err instanceof Error ? err.message : ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        request: {
            ip: req.ip || "",
            method: req.method || "",
            url: req.url || "",
        },
        trace: err instanceof Error ? { stack: err.stack } : null,
    };

    return res.status(500).json(response);
};
