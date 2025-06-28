import { tool } from "ai";
import { z } from "zod";
import { llmChat } from "../models/modelClient";
import { generateText } from "ai";

export const generateReportTool = tool({
    description:
        "Generates a final report based on research findings.",
    parameters: z.object({
        query: z.string().describe("Query to search memory for"),
    }),
    async execute({ query }) {
        const response = await generateText({
            model: llmChat,
            messages: [
                {
                    role: "system",
                    content: "Generate a final report based on research findings:",
                },
                {
                    role: "user",
                    content: query,
                },
            ]
        });
        return response.text;
    },
});
