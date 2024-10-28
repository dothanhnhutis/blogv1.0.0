import * as z from "zod";

const taskStatus = ["TO_DO", "ON_PROGRESS", "IN_REVIEW", "COMPLETED"] as const;
const taskPriority = ["LOW", "MEDIUM", "HIGH"] as const;

export const subTask = z.object({
  subTaskName: z.string({
    required_error: "subTaskName is required",
    invalid_type_error: "subTaskName must be string",
  }),
  disableAttachment: z.boolean({
    required_error: "disableAttachment is required",
    invalid_type_error: "disableAttachment must be boolean",
  }),
});

export const createTaskSchema = z.object({
  body: z
    .object({
      name: z.string({
        required_error: "name is required",
        invalid_type_error: "name must be string",
      }),
      description: z.string({
        required_error: "description is required",
        invalid_type_error: "description must be string",
      }),
      taskAssignees: z
        .array(
          z.string({
            invalid_type_error: "taskAssignee must be string",
          }),
          {
            required_error: "taskAssignees is required",
            invalid_type_error: "taskAssignees must be array",
          }
        )
        .nonempty(),
      status: z.enum(taskStatus),
      tags: z
        .array(z.string({ invalid_type_error: "tag[] must be string" }), {
          required_error: "tags is required",
          invalid_type_error: "tags must be array",
        })
        .default([]),
      startDate: z.string().datetime("startDate invalid datetime"),
      dueDate: z.string().datetime("dueDate invalid datetime"),
      priority: z.enum(taskPriority),
      createdById: z.string({
        required_error: "createdById is required",
        invalid_type_error: "createdById must be string",
      }),
      disableAttachment: z.boolean({
        required_error: "disableAttachment is required",
        invalid_type_error: "disableAttachment must be boolean",
      }),
      subTasks: z.array(subTask).nonempty("subTasks cannot empty").optional(),
    })
    .strict()
    .refine((val) => new Date(val.dueDate) >= new Date(val.startDate), {
      message: "startDate cannot be greater than dueDate",
      path: ["dueDate"],
    })
    .refine(
      (val) =>
        !val.disableAttachment ||
        !val.subTasks ||
        val.subTasks.every((s) => s.disableAttachment),

      {
        message:
          "If a task disables attachments, its subtasks cannot have attachments either.",
        path: ["subTasks", "disableAttachment"],
      }
    ),
});

export type CreateTaskReq = z.infer<typeof createTaskSchema>;
