import { tool } from "ai";
import { z } from "zod";
import { llmChat } from "../models/modelClient";
import { generateText } from "ai";

const subtaskSchema = z.array(
    z.string().min(1, "Subtask cannot be empty").describe("A specific, actionable research task")
);

export const planQueryTool = tool({
    description:
        "Breaks a research query into 3-5 distinct, actionable subtasks that collectively contribute to a comprehensive research report. Each subtask focuses on a unique aspect of the query.",
    parameters: z.object({
        topic: z.string().min(1, "Topic cannot be empty").describe("The original user research question"),
    }),
    async execute({ topic }: { topic: string }) {
        try {
            const response = await generateText({
                model: llmChat,
                messages: [
                    {
                        role: "user",
                        content: `
You are a research planning expert. Break down the following research query into 3-5 specific, distinct, and actionable subtasks. Each subtask should:
- Focus on a unique aspect of the query.
- Be clear, concise, and actionable (e.g., start with a verb like "Identify", "Analyze", "Search").
- Contribute to a comprehensive research report when combined.
- Avoid overlap with other subtasks.

Query: "${topic}"

Return a JSON array of subtasks, where each subtask is a string describing a specific research task. For example:
["Identify key challenges in X", "Search for recent studies on Y", "Analyze the impact of Z"]

Ensure the subtasks are tailored to the query's context and domain.
`,
                    },
                ],
            });

            const content = response.text;
            if (!content) {
                throw new Error("No content in response");
            }

            try {
                const parsed = JSON.parse(content);
                const validated = subtaskSchema.parse(parsed);
                return validated;
            } catch (error) {
                console.error("Failed to parse or validate response as JSON:", error);
                throw new Error(`Failed to parse/validate response: ${error instanceof Error ? error.message : String(error)}`);
            }
        } catch (error) {
            console.error("Error in planQueryTool:", error);
            return [
                `Define key concepts and terms in the query: "${topic}"`,
                `Identify relevant domains or disciplines for "${topic}"`,
                `Search for recent literature or data related to "${topic}"`,
                `Compare different approaches or findings for "${topic}"`,
                `Summarize potential implications or conclusions for "${topic}"`,
            ];
        }
    },
});

export type PlanQueryToolOutput = string[];