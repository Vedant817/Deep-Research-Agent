import { defineApp } from "convex/server";
import workflow from "@convex-dev/workflow/convex.config";
import agent from "@convex-dev/agent/convex.config";
import cache from "@convex-dev/action-cache/convex.config";

const app = defineApp();
app.use(workflow);
app.use(agent);
app.use(cache);

export default app;
