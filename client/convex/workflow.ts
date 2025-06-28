import { workflow } from "./index"
import { v } from "convex/values"
import { fetchAction } from "convex/nextjs"
import { api } from "./_generated/api"

export const researchWorkflow = workflow.define({
    args: { query: v.string() },
    handler: async (ctx, { query }) => {
        const result = await fetchAction(api.agent.runSubTaskAgent, { query })
        console.log('result', result);
        let subQueries: string[] = [];
        if (Array.isArray(result.subtasks) && typeof result.subtasks[0] === "string") {
            subQueries = result.subtasks[0]
                .split(/\n\d+\.\s/)
                .map((item) => item.trim())
                .filter((item) => item.length > 0);
        }

        // const searchResults = await Promise.all(subQueries.map(async (subQueries) => {
        //     const result = await fetchAction(api.agent.searchWebAgent, {subQueries: [subQueries]});
        //     return result;
        // }));

        console.log(subQueries);
        return subQueries;
    }
});