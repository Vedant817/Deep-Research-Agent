export enum Stage {
    Planning = 'planning',
    Researching = 'researching',
    Finalizing = 'finalizing',
}

export const stages = [
    {
        id: Stage.Planning,
        name: "Planning Research",
        description: "Analyzing the topic and creating research strategy",
        steps: ["Understanding the topic", "Identifying key areas", "Planning approach"]
    },
    {
        id: Stage.Researching,
        name: "Conducting Research",
        description: "Gathering information from various sources",
        steps: ["Searching databases", "Analyzing sources", "Collecting data"]
    },
    {
        id: Stage.Finalizing,
        name: "Finalizing Report",
        description: "Compiling and structuring the final report",
        steps: ["Organizing findings", "Writing report", "Final review"]
    }
];