import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export function currentUser(req: Request, res: Response) {
  const { password, ...noPass } = req.user!;

  return res
    .status(StatusCodes.OK)
    .json({ ...noPass, hasPassword: !!password });
}
