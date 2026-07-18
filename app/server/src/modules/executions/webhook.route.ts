import router from "express";
import { triggerWebhookController } from "./webhook.controller.ts";

export const webhookRouter = router.Router();

webhookRouter.post("/:token", triggerWebhookController);
