import { NextRequest, NextResponse } from "next/server";
import { vWorkflowId } from "@convex-dev/workflow";
import { vResultValidator } from "@convex-dev/workpool";
import { mutation } from "@/../convex/_generated/server"
import { v } from "convex/values"
import { workflow } from "@/../convex/index"
import { internal } from "@/../convex/_generated/api";

export async function POST(request: NextRequest) {
    const body = await request.json();
    const query = body.topic;

    if (!query) {
        return NextResponse.json({ error: "No topic provided" }, { status: 400 });
    }

    try {
        const startResearchWorkflowId = mutation({
            args: { query: v.string() },
            handler: async (ctx, { query }) => {
                const workflowId = await workflow.start(ctx, internal.workflow.researchWorkflow, { query })
                return workflowId;
            },
        });

        const handleOnComplete = mutation({
            args: {
                workflowId: vWorkflowId,
                result: vResultValidator,
                context: v.any(),
            },
            handler: async (ctx, args) => {
                console.log("Workflow completed:", args);
            },
        })
        return NextResponse.json({ workflowId: startResearchWorkflowId });
    } catch (error: any) {
        console.error("Error in research agent:", error);

        const errorMessage = error.message || "Failed to decompose query";
        const statusCode = error.statusCode || 500;

        return NextResponse.json({
            error: errorMessage,
            details: error.name || "Unknown error type"
        }, { status: statusCode });
    }
}
