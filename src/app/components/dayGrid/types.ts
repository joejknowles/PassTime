export interface Task {
    id: string;
    title: string;
    parentTasks: Task[];
    childTasks: Task[];
}

export interface TaskInstance {
    id: string;
    task: Task;
    start: {
        date: string;
        hour: number;
        minute: number;
    };
    duration: number;
}

export interface DraftTaskInstance {
    title: string;
    start: {
        date: string;
        hour: number;
        minute: number;
    };
    duration: number;
}

export type MoveType = "start" | "end" | "both";

export interface OpenDetailsPanelEntity {
    id: string;
    type: "Task" | "TaskInstance";
}
