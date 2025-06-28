import { tool } from "ai";
import { z } from "zod";
import { llmChat } from "../models/modelClient";
import { generateText } from "ai";

export const fetchWebResultsTool = tool({
    description:
        "Fetches web results for a given topic.",
    parameters: z.object({
        topic: z.string().min(1, "Topic cannot be empty").describe("The topic to search for"),
    }),
    async execute({ topic }: { topic: string }) {
        try {
            const response = await generateText({
                model: llmChat,
                messages: [
                    {
                        role: "user",
                        content: `
You are a web search expert. Fetch web results for the following topic:
${topic}

Return only the web results in a JSON array format. Do not include any additional text or explanation.`,
                    },
                ],
            });

            const results = JSON.parse(response.text);
            return results;
        } catch (error) {
            console.error("Error fetching web results:", error);
            throw new Error("Failed to fetch web results");
        }
    },
});
