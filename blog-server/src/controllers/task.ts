import { CreateTaskReq } from "@/schema/task";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export function createTask(
  req: Request<{}, {}, CreateTaskReq["body"]>,
  res: Response
) {
  console.log(req.body);
  return res.status(StatusCodes.OK).send("Server health check oker");
}
