import { Box, Container } from "@mui/material";
import { DayCalendar } from "./dayGrid/DayCalendar";
import { TasksList } from "./tasksList/TasksList";
import { withSignedInLayout } from "./SignedInLayout";
import { useState } from "react";
import { OpenDetailsPanelEntity, Task } from "./dayGrid/types";
import { BasicTask } from "./tasksList/types";
import { useDevice } from "@/app/lib/hooks/useDevice";

interface DraggedTask {
    task: BasicTask | Task;
    position: { x: number, y: number };
    width: number;
}

const Dashboard = () => {
    const { isPhabletWidthOrLess } = useDevice();

    const [openDetailsPanelEntity, setOpenDetailsPanelEntityRaw] = useState<OpenDetailsPanelEntity | null>(null);
    const [draggedTask, setDraggedTask] = useState<DraggedTask | null>(null);

    const setOpenDetailsPanelEntity = (newOpenEntity: OpenDetailsPanelEntity | null) => {
        setOpenDetailsPanelEntityRaw(newOpenEntity);
        if (newOpenEntity?.type === "TaskInstance" && isPhabletWidthOrLess) {
            let taskInstanceCard = document.getElementById(`task-instance-calendar-card-${newOpenEntity.id}`);
            if (!taskInstanceCard) {
                taskInstanceCard = document.getElementById('new-task-instance-calendar-card');
            }
            if (taskInstanceCard) {
                const topOffset = taskInstanceCard.getBoundingClientRect().top + window.scrollY - (window.innerHeight / 2) + 100;
                window.scrollTo({ top: topOffset, behavior: 'smooth' });
            }
        }
    }

    return (
        <Container sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            flexGrow: 1,
            mt: isPhabletWidthOrLess ? 1 : 2,
            overflow: "hidden",
            height: "100%"
        }}>
            <Box
                sx={{
                    width: "100%",
                    display: "flex",
                    flexGrow: 1,
                    overflow: "hidden",
                    ...(
                        isPhabletWidthOrLess
                            ? {
                                flexDirection: "column",
                                gap: 2,
                                height: "100%"
                            }
                            : {
                                justifyContent: "center",
                            }
                    )
                }

                }
            >
                {
                    !isPhabletWidthOrLess && (
                        <>
                            <Box sx={{
                                maxWidth: isPhabletWidthOrLess ? undefined : "380px",
                                minWidth: 0,
                                flexGrow: 1,
                                flexShrink: 5,
                                p: 2
                            }}>
                                <TasksList
                                    setOpenDetailsPanelEntity={setOpenDetailsPanelEntity}
                                    setDraggedTask={setDraggedTask}
                                    draggedTask={draggedTask}
                                />
                            </Box>
                            <Box
                                sx={{
                                    width: "1px",
                                    bgcolor: "grey.200",
                                }}
                            />
                        </>
                    )}

                <Box
                    sx={{
                        flexGrow: 1,
                        flexShrink: 1,
                        mt: -1,
                        p: 2,
                        maxWidth: isPhabletWidthOrLess ? undefined : "400px",
                        minWidth: "MIN(360px, 100%)",
                        overflowY: "hidden",
                    }}
                >
                    <DayCalendar
                        openDetailsPanelEntity={openDetailsPanelEntity}
                        setOpenDetailsPanelEntity={setOpenDetailsPanelEntity}
                        draggedTask={draggedTask}
                        setDraggedTask={setDraggedTask}
                    />
                </Box>
                {
                    isPhabletWidthOrLess && (
                        <>
                            <Box sx={{
                                minWidth: 0,
                                p: 2
                            }}>
                                <TasksList
                                    setOpenDetailsPanelEntity={setOpenDetailsPanelEntity}
                                    setDraggedTask={setDraggedTask}
                                    draggedTask={draggedTask}
                                />
                            </Box>
                        </>
                    )
                }
            </Box>
        </Container>
    );
};

export default withSignedInLayout(Dashboard);
