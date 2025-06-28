import { action } from "./_generated/server";
import { v } from "convex/values";
import { mainAgent } from "./agents/mainAgent";
import type { Thread } from "@convex-dev/agent";
import type { planQueryTool } from "./agents/tools/planTask";
import type { fetchWebResultsTool } from "./agents/tools/fetchWebResults";
import type { summarizeDocTool } from "./agents/tools/summarizeDoc";
import type { queryMemoryTool } from "./agents/tools/queryMemory";
import type { generateReportTool } from "./agents/tools/generateReport";

type AgentTools = {
    planQuery: typeof planQueryTool;
    fetchWebResults: typeof fetchWebResultsTool;
    summarizeDoc: typeof summarizeDocTool;
    queryMemory: typeof queryMemoryTool;
    generateReport: typeof generateReportTool;
};

const AGENT_ROLES = {
    PLANNER: {
        instructions: `You are a Research Planner. Your task is to break down the research topic into clear, actionable subtasks. 
    Output should be a JSON array of subtasks with descriptions.`
    },
    RESEARCHER: {
        instructions: `You are a Research Agent. Your task is to conduct in-depth research on the given subtask.
    Provide detailed, well-structured information with relevant sources.`
    },
    ANALYST: {
        instructions: `You are an Analysis Agent. Your task is to analyze the research findings, 
    identify patterns, and provide meaningful insights.`
    },
    SYNTHESIZER: {
        instructions: `You are a Synthesis Agent. Your task is to combine all research findings into a 
    comprehensive, well-structured final report.`
    }
};

async function runAgent(thread: Thread<AgentTools>, role: keyof typeof AGENT_ROLES, input: unknown) {
    return await thread.generateText({
        messages: [{
            role: 'user' as const,
            content: `${AGENT_ROLES[role].instructions}\n\nInput: ${input}`
        }]
    });
}

export const runSubTaskAgent = action({
    args: { query: v.string() },
    handler: async (ctx, { query }) => {
        try {
            const { thread } = await mainAgent.createThread(ctx, {});
            const planningResult = await runAgent(thread, 'PLANNER', query);
            const subtasks = JSON.parse(planningResult.text);
            
            return {
                threadId: thread.threadId,
                subtasks,
            };

        } catch (error: unknown) {
            console.error("Error in runResearchAgent:", error);
            throw new Error(`Research workflow failed: ${error}`);
        }
    },
});

export const searchWebAgent = action({
    args: {
        subQueries: v.array(v.string()),
    },
    handler: async (ctx, { subQueries }) => {
        try {
            const { thread } = await mainAgent.createThread(ctx, {});
            const planningResult = await runAgent(thread, 'RESEARCHER', subQueries);
            const subtasks = JSON.parse(planningResult.text);
            
            return {
                threadId: thread.threadId,
                subtasks,
            };

        } catch (error: unknown) {
            console.error("Error in runResearchAgent:", error);
            throw new Error(`Research workflow failed: ${error}`);
        }
    },
})