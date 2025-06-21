import { Agent } from "@convex-dev/agent";
import { components } from "../_generated/api";
import { llmChat } from "../agents/models/modelClient";
import { planQueryTool } from "../agents/tools/planTask";
import { fetchWebResultsTool } from "../agents/tools/fetchWebResults";
import { summarizeDocTool } from "../agents/tools/summarizeDoc";
import { queryMemoryTool } from "../agents/tools/queryMemory";
import { generateReportTool } from "../agents/tools/generateReport";

export const mainAgent = new Agent(components.agent, {
    chat: llmChat,
    instructions: `
You are a Deep Research Orchestrator Agent. Your role is to coordinate between different specialized agents to conduct thorough research.

You have access to the following specialized agents:
1. PLANNER: Breaks down research topics into subtasks
2. RESEARCHER: Conducts in-depth research on specific topics
3. ANALYST: Analyzes research findings
4. SYNTHESIZER: Combines all findings into a final report

Your task is to:
1. Understand the research query
2. Delegate tasks to the appropriate agents
3. Ensure smooth handoff between agents
4. Maintain context throughout the workflow
`,
    tools: {
        planQueryTool,
        fetchWebResultsTool,
        summarizeDocTool,
        queryMemoryTool,
        generateReportTool,
    },
    maxSteps: 20,
    maxRetries: 5,
    usageHandler: async (ctx, { model, usage }) => {
        console.log(`[Agent Usage] Model: ${model}`);
        console.log(`[Token Usage]`, usage);
    },
});