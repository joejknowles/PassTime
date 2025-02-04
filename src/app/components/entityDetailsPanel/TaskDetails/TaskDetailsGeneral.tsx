import { Box, Typography, Autocomplete, TextField, Chip, Select, MenuItem, SelectChangeEvent, FormControl, InputLabel, ClickAwayListener, Button, Link, duration } from "@mui/material";
import { DetailedTask, Task } from "../../dayGrid/types";
import { durationOptions } from "../../../lib/utils/durationOptions";
import { useTasks } from "@/app/lib/hooks/useTasks";
import { useState } from "react";
import { displayMinutes } from "../../utils/date";

interface TaskDetailsGeneralProps {
    task: Task | DetailedTask;
    goToTaskDetails: (taskId: string) => void;
}

export const TaskDetailsGeneral = ({ task, goToTaskDetails }: TaskDetailsGeneralProps) => {
    const { tasks, updateTask, error: taskUpdateErrorRaw } = useTasks();
    const taskUpdateError = taskUpdateErrorRaw?.graphQLErrors[0];
    const genericErrorMessage = !taskUpdateError?.extensions?.fieldName && taskUpdateError?.message || taskUpdateErrorRaw?.message;
    const [isAddingParentTask, setIsAddingParentTask] = useState(false);
    const [showFullHistory, setShowFullHistory] = useState(false);

    const handleDurationChange = async (event: SelectChangeEvent<number>) => {
        if (event.target.value) {
            await updateTask(task.id, { defaultDuration: event.target.value as number });
        }
    };

    const handleParentTaskChange = async (_e: any, selection: any) => {
        if (selection) {
            await updateTask(task.id, { parentTaskId: selection.id });
            setIsAddingParentTask(false);
        }
    };

    const latestTaskInstance = task.taskInstances[0];

    const durationToday = "progress" in task ? task.progress.today : null;
    const durationThisWeek = "progress" in task ? task.progress.thisWeek : null;
    const durationAllTime = "progress" in task ? task.progress.allTime : null;

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, flexGrow: 1 }}>
            <Box>
                {genericErrorMessage && (
                    <Typography variant="subtitle2" color="error" sx={{ mb: 2 }}>
                        {genericErrorMessage}
                    </Typography>
                )}
                <Box>
                    <Typography variant="caption" color="textSecondary">
                        Parent Tasks:
                    </Typography>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                            {task.parentTasks.map((parentTask) => (
                                <Chip
                                    key={parentTask.id}
                                    label={parentTask.title}
                                    size="small"
                                    onClick={() => goToTaskDetails(parentTask.id)}
                                />
                            ))}
                            {!isAddingParentTask && (
                                <Chip
                                    label="+ Add"
                                    size="small"
                                    onClick={() => setIsAddingParentTask(true)}
                                />
                            )}
                        </Box>
                        {(isAddingParentTask || taskUpdateErrorRaw) && (
                            <ClickAwayListener onClickAway={() => {
                                setTimeout(() => {
                                    setIsAddingParentTask(false)
                                }, 100)
                            }}>
                                <Autocomplete
                                    openOnFocus
                                    options={tasks?.map((task) => ({ label: task.title, id: task.id })) || []}
                                    size="small"
                                    onChange={handleParentTaskChange}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            autoFocus
                                            label="Parent Task"
                                            error={taskUpdateError?.extensions?.fieldName === "parentTaskId"}
                                            helperText={taskUpdateError?.extensions?.fieldName === "parentTaskId" && taskUpdateError.message}
                                        />
                                    )}
                                />
                            </ClickAwayListener>
                        )}
                    </Box>
                </Box>
                {task.childTasks.length > 0 && (
                    <Box sx={{ marginTop: 1 }}>
                        <Typography variant="caption" color="textSecondary">
                            Child Tasks:
                        </Typography>
                        <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                            {task.childTasks.map((childTask) => (
                                <Chip
                                    key={childTask.id}
                                    label={childTask.title}
                                    size="small"
                                    onClick={() => goToTaskDetails(childTask.id)}
                                />
                            ))}
                        </Box>
                    </Box>
                )}
                <Box sx={{ mt: 4 }}>
                    <FormControl sx={{ minWidth: 150 }} variant="outlined">
                        <InputLabel id="duration-label">Default duration</InputLabel>
                        <Select
                            labelId="duration-label"
                            label="Default duration"
                            value={task.defaultDuration}
                            onChange={handleDurationChange}
                            MenuProps={{
                                disablePortal: true,
                                sx: {
                                    maxHeight: 350,
                                },
                            }}
                        >
                            {durationOptions.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
            </Box>
            <Box sx={{ mt: 'auto' }}>
                <Typography variant="caption">Usage</Typography>
                {
                    durationAllTime === null && (
                        "..."
                    )
                }
                {
                    durationAllTime !== null &&
                    durationToday !== null &&
                    durationThisWeek !== null &&
                    (
                        <>
                            {durationAllTime > 0 && (
                                <>
                                    <Typography variant="body2">
                                        {displayMinutes(durationToday)}{" "}
                                        <Typography
                                            variant="body2"
                                            component="span"
                                            color="textSecondary"
                                        >
                                            today
                                        </Typography>
                                    </Typography>
                                    <Typography variant="body2">
                                        {displayMinutes(durationThisWeek)}{" "}
                                        <Typography
                                            variant="body2"
                                            component="span"
                                            color="textSecondary"
                                        >
                                            this week
                                        </Typography>
                                    </Typography>
                                </>
                            )}
                            <Typography variant="body2">
                                {displayMinutes(durationAllTime)}{" "}
                                <Typography
                                    variant="body2"
                                    component="span"
                                    color="textSecondary"
                                >
                                    all time
                                </Typography>
                            </Typography>
                        </>
                    )}
                {
                    latestTaskInstance && (
                        <>
                            <Typography variant="body2">Latest: {latestTaskInstance?.start.date}</Typography>
                            <Link component="button" variant="body2" onClick={() => setShowFullHistory(!showFullHistory)}>
                                {showFullHistory ? "Hide" : "More"}
                            </Link>
                            {showFullHistory && (
                                <Box sx={{ my: 2 }}>
                                    {task.taskInstances.map((instance, index) => (
                                        <Typography key={index} variant="body2">
                                            {instance.start.date} - {displayMinutes(instance.duration)}
                                        </Typography>
                                    ))}
                                </Box>
                            )}
                        </>
                    )}
            </Box>
        </Box>
    );
};
