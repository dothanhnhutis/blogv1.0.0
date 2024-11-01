"use client";
import React from "react";
import Image from "next/image";
import {
  AlarmClockIcon,
  ArrowsUpFromLineIcon,
  BadgeInfoIcon,
  CalendarDaysIcon,
  CircleAlertIcon,
  CircleArrowDownIcon,
  CircleArrowUpIcon,
  CircleCheckIcon,
  CircleIcon,
  CircleMinusIcon,
  ListChecksIcon,
  ListIcon,
  ListTodoIcon,
  LoaderCircleIcon,
  LucideIcon,
  MoveDownIcon,
  MoveRightIcon,
  MoveUpIcon,
  SlidersHorizontalIcon,
  TagsIcon,
} from "lucide-react";
import { clockHook } from "@/hook/clockHook";
import { useTask } from "@/components/provider/task-provider";
import Clock from "./clock";
import { format } from "date-fns";

type TaskListItemType = {
  name: string;
  description: string;
  taskAssignees: string[];
  status: "TO_DO" | "ON_PROGRESS" | "IN_REVIEW" | "COMPLETED";
  tags: string[];
  startDate: string;
  dueDate: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  createdById: string;
  disableAttachment: boolean;
  subTasks: {
    subTaskName: string;
    disableAttachment: boolean;
    isDone: boolean;
  }[];
};

const taskStatusData: Record<
  TaskListItemType["status"],
  { label: string; icon: LucideIcon; className: string }
> = {
  TO_DO: {
    label: "To do",
    icon: CircleIcon,
    className: "shrink-0 size-4 xl:size-5",
  },
  ON_PROGRESS: {
    label: "On Progress",
    icon: LoaderCircleIcon,
    className: "shrink-0 size-4 xl:size-5 text-orange-600 animate-spin",
  },
  IN_REVIEW: {
    label: "In Review",
    icon: CircleAlertIcon,
    className: "shrink-0 size-4 xl:size-5 text-blue-600",
  },
  COMPLETED: {
    label: "Done",
    icon: CircleCheckIcon,
    className: "shrink-0 size-4 xl:size-5 text-green-600",
  },
};

const TaskStatus = ({ status }: { status: TaskListItemType["status"] }) => {
  const Icon = taskStatusData[status].icon;
  return (
    <div className="flex items-center gap-1 text-muted-foreground">
      <Icon className={taskStatusData[status].className} />
      <p className="text-xs lg:text-sm xl:text-base">
        {taskStatusData[status].label}
      </p>
    </div>
  );
};

const TaskProcess = ({
  subTask,
}: {
  subTask?: TaskListItemType["subTasks"];
}) => {
  const Icon: LucideIcon = subTask
    ? subTask.every((s) => s.isDone)
      ? ListChecksIcon
      : subTask.every((s) => !s.isDone)
      ? ListIcon
      : ListTodoIcon
    : ListIcon;
  const process: number = subTask ? subTask.filter((s) => s.isDone).length : 0;
  if (!subTask) return;
  return (
    <div
      className={`flex items-center gap-1 ${
        process == 1
          ? "text-green-500"
          : process == 0
          ? "text-muted-foreground"
          : "text-orange-600"
      }`}
    >
      <Icon className="shrink-0 size-4 lg:size-5 xl:size-6" />
      <p className="text-xs lg:text-sm xl:text-base">
        {process}/{subTask.length}
      </p>
    </div>
  );
};

const TaskListItem = ({ data }: { data: TaskListItemType }) => {
  const classContainer: string =
    data.priority == "HIGH"
      ? "border-2 border-white rounded-lg p-2 bg-gradient-to-b from-red-100 to-white space-y-1"
      : data.priority == "MEDIUM"
      ? "border-2 border-white rounded-lg p-2 bg-gradient-to-b from-yellow-100 to-white space-y-1"
      : data.priority == "LOW"
      ? "border-2 border-white rounded-lg p-2 bg-gradient-to-b from-green-100 to-white space-y-1"
      : "border-2 border-white rounded-lg p-2 bg-gradient-to-b from-blue-100 to-white space-y-1";

  return (
    <div className={classContainer}>
      <h4 className="font-semibold lg:text-lg xl:text-2xl lg:line-clamp-2">
        {data.name}
      </h4>
      <p className="text-sm lg:text-base xl:text-lg text-muted-foreground">
        {data.description}
      </p>
      {data.subTasks && (
        <ul className="list-inside list-disc text-sm lg:text-base xl:text-lg">
          {data.subTasks.map((s, idx) => (
            <li
              key={idx}
              className={`${
                s.isDone ? "text-blue-500" : "text-muted-foreground"
              }`}
            >
              {s.subTaskName}
            </li>
          ))}
        </ul>
      )}

      <div className="flex items-center gap-x-10 flex-wrap">
        <TaskProcess subTask={data.subTasks} />
        <div className="flex items-center gap-1 text-muted-foreground">
          <CalendarDaysIcon className="shrink-0 size-4 xl:size-5" />
          <p className="text-xs lg:text-sm xl:text-base text-muted-foreground">
            {format(new Date(data.startDate), "dd/MM/yy HH:mm")} -{" "}
            {format(new Date(data.startDate), "dd/MM/yy HH:mm")}
          </p>
        </div>
        <TaskStatus status={data.status} />
      </div>
    </div>
  );
};

const TaskPage = () => {
  const { connected, tasks } = useTask();
  return (
    <div className="bg-gradient-to-r from-blue-300 from-10% via-sky-400 via-30% to-emerald-200 to-90%">
      <div className="sticky top-0 right-0 left-0 bg-white p-2">
        <div className="flex items-center">
          <Clock />

          <div className="flex items-center justify-end gap-2 w-full">
            <button
              type="button"
              className="flex items-center gap-1 px-3 py-1 border rounded-lg"
            >
              <SlidersHorizontalIcon className="shrink-0 size-4" />
              <p className="text-base">Filter</p>
            </button>

            <Image
              src="/logo.png"
              alt="logo.png"
              width="100"
              height="100"
              className="size-10 shrink-0 rounded-full border-2 border-white shadow bg-white"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white">
          <button type="button" className="px-2 py-1 rounded-lg text-sm">
            Today
          </button>
          <button type="button" className="px-2 py-1 rounded-lg text-sm">
            Tomorrow
          </button>
          <div className="flex items-center gap-1 text-muted-foreground border rounded-lg px-2 py-1">
            <CalendarDaysIcon className="shrink-0 size-4 xl:size-5" />
            <p className="text-xs lg:text-sm xl:text-base text-muted-foreground">
              24/09/24 11:17 - 24/09/24 11:17
            </p>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground border rounded-lg px-2 py-1">
            <CircleArrowUpIcon className="shrink-0 size-4 xl:size-5" />
            <p className="text-xs lg:text-sm xl:text-base text-muted-foreground">
              Hight
            </p>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground border rounded-lg px-2 py-1">
            <CircleMinusIcon className="shrink-0 size-4 xl:size-5" />
            <p className="text-xs lg:text-sm xl:text-base text-muted-foreground">
              Medium
            </p>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground border rounded-lg px-2 py-1">
            <CircleArrowDownIcon className="shrink-0 size-4 xl:size-5" />
            <p className="text-xs lg:text-sm xl:text-base text-muted-foreground">
              Low
            </p>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground border rounded-lg px-2 py-1">
            <LoaderCircleIcon className="shrink-0 size-4 xl:size-5 text-orange-600 animate-spin" />
            <p className="text-xs lg:text-sm xl:text-base">On Progress</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 p-2">
        {tasks.map((task, idx) => (
          <TaskListItem key={idx} data={task} />
        ))}
        <div className="border-2 border-white rounded-lg p-2 bg-gradient-to-b from-red-100 to-white space-y-1">
          <h4 className="font-semibold lg:text-lg xl:text-2xl lg:line-clamp-2">
            3 Thùng Khóm Specifies the offset length of the shadow. This
            parameter accepts two, three, or four values. Third and fourth
            values are optional. They are interpreted as follows:
          </h4>
          <p className="text-sm lg:text-base xl:text-lg text-muted-foreground">
            Specifies the offset length of the shadow. This parameter accepts
            two, three, or four values. Third and fourth values are optional.
            They are interpreted as follows. Specifies the offset length of the
            shadow. This parameter accepts two, three, or four values. Third and
            fourth values are optional. They are interpreted as follows.
            Specifies the offset length of the shadow. This parameter accepts
            two, three, or four values. Third and fourth values are optional.
            They are interpreted as follows:
          </p>
          <ul className="list-inside list-disc text-sm lg:text-base xl:text-lg">
            <li className=" text-blue-500">5 cups chopped Porcini mushrooms</li>
            <li className=" text-muted-foreground">
              5 cups chopped Porcini mushrooms
            </li>
          </ul>

          <div className="flex items-center gap-x-10 flex-wrap">
            <div className="flex items-center gap-1 text-muted-foreground">
              <ListIcon className="shrink-0 size-4 lg:size-5 xl:size-6" />
              <p className="text-xs lg:text-sm xl:text-base">0/2</p>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <ListTodoIcon className="shrink-0 size-4 lg:size-5 xl:size-6" />
              <p className="text-xs lg:text-sm xl:text-base">1/2</p>
            </div>
            <div className="flex items-center gap-1 text-green-500">
              <ListChecksIcon className="shrink-0 size-4 lg:size-5 xl:size-6" />
              <p className="text-xs lg:text-sm xl:text-base">2/2</p>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <CalendarDaysIcon className="shrink-0 size-4 xl:size-5" />
              <p className="text-xs lg:text-sm xl:text-base text-muted-foreground">
                24/09/24 11:17 - 24/09/24 11:17
              </p>
            </div>

            <div className="flex items-center gap-1 text-muted-foreground">
              <CircleIcon className="shrink-0 size-4 xl:size-5" />
              <p className="text-xs lg:text-sm xl:text-base">To do</p>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <LoaderCircleIcon className="shrink-0 size-4 xl:size-5 text-orange-600 animate-spin" />
              <p className="text-xs lg:text-sm xl:text-base">On Progress</p>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <CircleAlertIcon className="shrink-0 size-4 xl:size-5 text-blue-600" />
              <p className="text-xs lg:text-sm xl:text-base">In Review</p>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <CircleCheckIcon className="shrink-0 size-4 xl:size-5 text-green-600" />
              <p className="text-xs lg:text-sm xl:text-base">Done</p>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <TagsIcon className="shrink-0 size-4 xl:size-5 " />
              <p className="text-xs lg:text-sm xl:text-base">Done</p>
            </div>
          </div>
        </div>

        <div className="border-2 border-white rounded-lg p-2 bg-gradient-to-b from-yellow-100 to-white space-y-1">
          <h4 className="font-semibold lg:text-lg xl:text-2xl lg:line-clamp-2">
            3 Thùng Khóm Specifies the offset length of the shadow. This
            parameter accepts two, three, or four values. Third and fourth
            values are optional. They are interpreted as follows:
          </h4>
          <p className="text-sm lg:text-base xl:text-lg text-muted-foreground">
            Specifies the offset length of the shadow. This parameter accepts
            two, three, or four values. Third and fourth values are optional.
            They are interpreted as follows. Specifies the offset length of the
            shadow. This parameter accepts two, three, or four values. Third and
            fourth values are optional. They are interpreted as follows.
            Specifies the offset length of the shadow. This parameter accepts
            two, three, or four values. Third and fourth values are optional.
            They are interpreted as follows:
          </p>
          <ul className="list-inside list-disc text-sm lg:text-base xl:text-lg">
            <li className=" text-blue-500">5 cups chopped Porcini mushrooms</li>
            <li className=" text-muted-foreground">
              5 cups chopped Porcini mushrooms
            </li>
          </ul>

          <div className="flex items-center gap-x-10 flex-wrap">
            <div className="flex items-center gap-1 text-muted-foreground">
              <p className="text-xs lg:text-sm xl:text-base">1/2</p>
              <ListTodoIcon className="shrink-0 size-4 lg:size-5 xl:size-6" />
            </div>
            <div className="flex items-center gap-1 text-green-500">
              <p className="text-xs lg:text-sm xl:text-base">2/2</p>
              <ListChecksIcon className="shrink-0 size-4 lg:size-5 xl:size-6" />
            </div>
            <p className="text-xs lg:text-sm xl:text-base text-muted-foreground">
              24/09/24 11:17 - 24/09/24 11:17
            </p>
            <div className="flex items-center gap-1 text-muted-foreground">
              <CircleIcon className="shrink-0 size-4 xl:size-5" />
              <p className="text-xs lg:text-sm xl:text-base">To do</p>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <LoaderCircleIcon className="shrink-0 size-4 xl:size-5 text-orange-600 animate-spin" />
              <p className="text-xs lg:text-sm xl:text-base">On Progress</p>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <BadgeInfoIcon className="shrink-0 size-4 xl:size-5 text-blue-600" />
              <p className="text-xs lg:text-sm xl:text-base">In Review</p>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <CircleCheckIcon className="shrink-0 size-4 xl:size-5 text-green-600" />
              <p className="text-xs lg:text-sm xl:text-base">Done</p>
            </div>
          </div>
        </div>

        <div className="border-2 border-white rounded-lg p-2 bg-gradient-to-b from-green-100 to-white space-y-1">
          <h4 className="font-semibold lg:text-lg xl:text-2xl lg:line-clamp-2">
            3 Thùng Khóm Specifies the offset length of the shadow. This
            parameter accepts two, three, or four values. Third and fourth
            values are optional. They are interpreted as follows:
          </h4>
          <p className="text-sm lg:text-base xl:text-lg text-muted-foreground">
            Specifies the offset length of the shadow. This parameter accepts
            two, three, or four values. Third and fourth values are optional.
            They are interpreted as follows. Specifies the offset length of the
            shadow. This parameter accepts two, three, or four values. Third and
            fourth values are optional. They are interpreted as follows.
            Specifies the offset length of the shadow. This parameter accepts
            two, three, or four values. Third and fourth values are optional.
            They are interpreted as follows:
          </p>
          <ul className="list-inside list-disc text-sm lg:text-base xl:text-lg">
            <li className=" text-blue-500">5 cups chopped Porcini mushrooms</li>
            <li className=" text-muted-foreground">
              5 cups chopped Porcini mushrooms
            </li>
          </ul>

          <div className="flex items-center gap-x-10 flex-wrap">
            <div className="flex items-center gap-1 text-muted-foreground">
              <p className="text-xs lg:text-sm xl:text-base">1/2</p>
              <ListTodoIcon className="shrink-0 size-4 lg:size-5 xl:size-6" />
            </div>
            <div className="flex items-center gap-1 text-green-500">
              <p className="text-xs lg:text-sm xl:text-base">2/2</p>
              <ListChecksIcon className="shrink-0 size-4 lg:size-5 xl:size-6" />
            </div>
            <p className="text-xs lg:text-sm xl:text-base text-muted-foreground">
              24/09/24 11:17 - 24/09/24 11:17
            </p>
            <div className="flex items-center gap-1 text-muted-foreground">
              <CircleIcon className="shrink-0 size-4 xl:size-5" />
              <p className="text-xs lg:text-sm xl:text-base">To do</p>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <LoaderCircleIcon className="shrink-0 size-4 xl:size-5 text-orange-600 animate-spin" />
              <p className="text-xs lg:text-sm xl:text-base">On Progress</p>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <BadgeInfoIcon className="shrink-0 size-4 xl:size-5 text-blue-600" />
              <p className="text-xs lg:text-sm xl:text-base">In Review</p>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <CircleCheckIcon className="shrink-0 size-4 xl:size-5 text-green-600" />
              <p className="text-xs lg:text-sm xl:text-base">Done</p>
            </div>
          </div>
        </div>

        <div className="border-2 border-white rounded-lg p-2 bg-gradient-to-b from-blue-100 to-white space-y-1">
          <h4 className="font-semibold lg:text-lg xl:text-2xl lg:line-clamp-2">
            3 Thùng Khóm Specifies the offset length of the shadow. This
            parameter accepts two, three, or four values. Third and fourth
            values are optional. They are interpreted as follows:
          </h4>
          <p className="text-sm lg:text-base xl:text-lg text-muted-foreground">
            Specifies the offset length of the shadow. This parameter accepts
            two, three, or four values. Third and fourth values are optional.
            They are interpreted as follows. Specifies the offset length of the
            shadow. This parameter accepts two, three, or four values. Third and
            fourth values are optional. They are interpreted as follows.
            Specifies the offset length of the shadow. This parameter accepts
            two, three, or four values. Third and fourth values are optional.
            They are interpreted as follows:
          </p>
          <ul className="list-inside list-disc text-sm lg:text-base xl:text-lg">
            <li className=" text-blue-500">5 cups chopped Porcini mushrooms</li>
            <li className=" text-muted-foreground">
              5 cups chopped Porcini mushrooms
            </li>
          </ul>

          <div className="flex items-center gap-x-10 flex-wrap">
            <div className="flex items-center gap-1 text-muted-foreground">
              <p className="text-xs lg:text-sm xl:text-base">1/2</p>
              <ListTodoIcon className="shrink-0 size-4 lg:size-5 xl:size-6" />
            </div>
            <div className="flex items-center gap-1 text-green-500">
              <p className="text-xs lg:text-sm xl:text-base">2/2</p>
              <ListChecksIcon className="shrink-0 size-4 lg:size-5 xl:size-6" />
            </div>
            <p className="text-xs lg:text-sm xl:text-base text-muted-foreground">
              24/09/24 11:17 - 24/09/24 11:17
            </p>
            <div className="flex items-center gap-1 text-muted-foreground">
              <CircleIcon className="shrink-0 size-4 xl:size-5" />
              <p className="text-xs lg:text-sm xl:text-base">To do</p>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <LoaderCircleIcon className="shrink-0 size-4 xl:size-5 text-orange-600 animate-spin" />
              <p className="text-xs lg:text-sm xl:text-base">On Progress</p>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <BadgeInfoIcon className="shrink-0 size-4 xl:size-5 text-blue-600" />
              <p className="text-xs lg:text-sm xl:text-base">In Review</p>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <CircleCheckIcon className="shrink-0 size-4 xl:size-5 text-green-600" />
              <p className="text-xs lg:text-sm xl:text-base">Done</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskPage;
