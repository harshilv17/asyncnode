import { db } from "../../config/db.ts";
import { workflows } from "../../db/schemas/workflow.schema.ts";
import {deleteWorkflowById, getWorkflowById, getWorkflowsByUserId, saveWorkflowGraph, getTriggersByWorkflowId} from "./workflow.repo.ts";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../../constants/messages.ts";
import { stopWorkflowSchedule } from "../../jobs/workflowExecution.job.ts";

const MAX_NODES = 200;
const TRIGGER_CATEGORY = "trigger";


export const createWorkflow = async (userId: number, name: string, description: string) => {
    try{
        if(!userId || !name || !description) {
            return new Error("Missing required fields");
        }

        const result = await db.insert(workflows).values({
            userId,
            name,
            description,
        }).returning();
        return result[0]
    }catch(err){
        return err
    }

}


export const getUserWorkflows = async (userId:number)=>{
    try{
        const result = await getWorkflowsByUserId(userId)
        return result
    }catch(err){
        return err
    }
}

export const getWorkflow = async (workflowId:number)=>{
    try{
        const result = await getWorkflowById(workflowId)

        if(!result) {
            return new Error("Workflow not found")
        }

        return result
    }catch(err){
        return err
    }
}

export const deleteWorkflow = async (workflowId:number, userId:number)=>{
    try{
        const workflow = await getWorkflowById(workflowId) as typeof workflows.$inferSelect | undefined;

        if(!workflow) {
            return new Error("Workflow not found")
        }

        if(workflow.userId !== userId) {
            return new Error("Forbidden")
        }

        if (workflow.scheduleEnabled) {
            await stopWorkflowSchedule(workflowId)
        }

        const result = await deleteWorkflowById(workflowId)
        return result
    }catch(err){
        return err
    }
}

export const updateWorkflowGraph = async (
    workflowId: number,
    userId: number,
    graphJson: { nodes: { id: string; data: Record<string, unknown> }[]; edges: unknown[] }
) => {
    try {
        const workflow = await getWorkflowById(workflowId) as typeof workflows.$inferSelect | undefined;
        if (!workflow) {
            return new Error(ERROR_MESSAGES.WORKFLOW_NOT_FOUND);
        }

        if (workflow.userId !== userId) {
            return new Error(ERROR_MESSAGES.WORKFLOW_UPDATE_FORBIDDEN);
        }

        const { nodes, edges } = graphJson;

        if (!Array.isArray(nodes) || !Array.isArray(edges)) {
            return new Error(ERROR_MESSAGES.WORKFLOW_GRAPH_INVALID);
        }

        if (nodes.length > MAX_NODES) {
            return new Error(ERROR_MESSAGES.WORKFLOW_TOO_MANY_NODES);
        }

        const triggerRows: { nodeId: string; type: string; configJson: unknown }[] = [];
        const integrationRows: { nodeId: string; provider: string; credentialsJson: unknown }[] = [];

        for (const node of nodes) {
            const category = node.data?.category as string | undefined;
            if (!category) continue;

            if (category === TRIGGER_CATEGORY) {
                triggerRows.push({
                    nodeId: node.id,
                    type: (node.data.type as string) ?? "manual",
                    configJson: node.data,
                });
            } else {
                integrationRows.push({
                    nodeId: node.id,
                    provider: (node.data.provider as string) ?? category,
                    credentialsJson: node.data,
                });
            }
        }

        const result = await saveWorkflowGraph(workflowId, { nodes, edges }, triggerRows, integrationRows);
        return result
    } catch (err) {
        return err
    }
}

export const getWorkflowTriggers = async (workflowId: number, userId: number) => {
    try {
        const workflow = await getWorkflowById(workflowId) as typeof workflows.$inferSelect | undefined;
        if (!workflow) {
            return new Error(ERROR_MESSAGES.WORKFLOW_NOT_FOUND);
        }

        if (workflow.userId !== userId) {
            return new Error(ERROR_MESSAGES.WORKFLOW_UPDATE_FORBIDDEN);
        }

        const result = await getTriggersByWorkflowId(workflowId);
        return result
    } catch (err) {
        return err
    }
}