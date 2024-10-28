import TaskProvider from "@/components/provider/task-provider";
import React from "react";

const TaskLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <TaskProvider>{children}</TaskProvider>;
};

export default TaskLayout;
