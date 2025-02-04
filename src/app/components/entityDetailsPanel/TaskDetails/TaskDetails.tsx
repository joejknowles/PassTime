/** @jsxImportSource @emotion/react */
import { Box, Typography, IconButton, ClickAwayListener, Tabs, Tab } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useState, useRef, useEffect } from "react";
import { DetailedTask, Task } from "../../dayGrid/types";
import { TaskDetailsGeneral } from "./TaskDetailsGeneral";
import { TaskDetailsSuggestions } from "./Suggestions/TaskDetailsSuggestions";
import { useCallOnEscapePress } from "@/app/lib/hooks/useCallOnEscapePress";
import { useQuery } from "@apollo/client";
import { GET_TASK } from "@/app/lib/graphql/queries";

interface TaskInstanceDetailsProps {
    task: Task;
    onClose: () => void;
    isMovingATask: boolean;
    goBack?: () => void;
    goToTaskDetails: (taskId: string) => void
}

const secondsInMs = (seconds: number) => seconds * 1000;

export const TaskDetails = ({
    task: standardTask,
    isMovingATask,
    goBack,
    onClose,
    goToTaskDetails,
}: TaskInstanceDetailsProps) => {
    const detailsRef = useRef<HTMLDivElement | null>(null);
    const [tabIndex, setTabIndex] = useState(0);

    const { data: detailedTaskData, refetch: refetchDetailedTask } = useQuery<{ task: DetailedTask }>(GET_TASK, {
        variables: { taskId: standardTask.id },
        fetchPolicy: "cache-and-network",
        pollInterval: secondsInMs(60),
    });
    const detailedTask = detailedTaskData?.task;

    const task = detailedTask || standardTask;

    useEffect(() => {
        refetchDetailedTask();
    }, [JSON.stringify(standardTask)]);

    useCallOnEscapePress(onClose);

    if (!task) {
        return null;
    }

    const closeIfNotMoving = () => {
        if (!isMovingATask) {
            onClose();
        }
    };

    return (
        <ClickAwayListener onClickAway={closeIfNotMoving}>
            <Box
                ref={detailsRef}
                sx={{
                    backgroundColor: "white",
                    padding: 3,
                    width: "100%",
                    height: "100%",
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: 16,
                        right: 16,
                        display: "flex",
                        gap: 1,
                        zIndex: 10,
                    }}
                >
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        marginBottom: 3,
                        marginRight: "38px"
                    }}
                >
                    {goBack && (
                        <IconButton onClick={goBack}>
                            <ArrowBackIcon />
                        </IconButton>
                    )}
                    <Typography variant="h6">{task.title}</Typography>
                </Box>
                <Tabs
                    value={tabIndex}
                    onChange={(_, newValue) => setTabIndex(newValue)}
                    sx={{ mb: 2 }}
                >
                    <Tab label="General" />
                    <Tab label="Suggestions" />
                </Tabs>
                {tabIndex === 0 && (
                    <TaskDetailsGeneral
                        task={task}
                        goToTaskDetails={goToTaskDetails}
                    />
                )}
                {tabIndex === 1 && <TaskDetailsSuggestions task={task} />}
            </Box>
        </ClickAwayListener>
    );
};
