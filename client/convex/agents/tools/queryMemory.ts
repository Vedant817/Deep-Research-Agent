import { tool } from "ai";
import { z } from "zod";
import { llmChat } from "../models/modelClient";
import { generateText } from "ai";

export const queryMemoryTool = tool({
    description:
        "Summarizes a document into key points.",
    parameters: z.object({
        text: z.string().describe("Text content to summarize"),
    }),
    async execute({ text }) {
        const response = await generateText({
            model: llmChat,
            messages: [
                {
                    role: "system",
                    content: "Summarize the following text into concise key points:",
                },
                {
                    role: "user",
                    content: text,
                },
            ]
        });
        return response.text;
    },
});
