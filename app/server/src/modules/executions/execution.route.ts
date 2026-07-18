import router from "express";
import { getWorkflowExecutionsController, getExecutionDetailController, getLatestExecutionController } from "./execution.controller.ts";

export const executionRouter = router.Router();

executionRouter.get("/workflows/:workflowId/executions", getWorkflowExecutionsController);
executionRouter.get("/workflows/:workflowId/executions/latest", getLatestExecutionController);
executionRouter.get("/workflows/:workflowId/executions/:executionId", getExecutionDetailController);
