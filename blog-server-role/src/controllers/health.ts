import { BadRequestError, PermissionError } from "@/error-handler";
import prisma from "@/utils/db";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

const email = "gaconght@gmail.com";
const email1 = "gaconght001@gmail.com";
const email2 = "gaconght002@gmail.com";

export async function test(_: Request, res: Response) {
  const user = await prisma.users.findUnique({
    where: {
      email: email2,
    },
    include: {
      roles: {
        select: {
          role: true,
        },
      },
    },
  });
  if (!user) throw new BadRequestError("no user");
  const allRole = user.roles.map(({ role }) => role.permission).flat();
  console.log(allRole);
  if (!allRole.includes("plan:owner") && !allRole.includes("plan:create"))
    throw new PermissionError();

  return res.status(StatusCodes.OK).json(user);
}
