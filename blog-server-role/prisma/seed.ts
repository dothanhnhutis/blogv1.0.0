import prisma from "@/utils/db";
import { hashData } from "@/utils/helper";
const planPermission: string[] = [
  "planMemberRole:create",
  "planMemberRole:read",
  "planMemberRole:update",
  "planMemberRole:delete",
  "task:create",
  "task:read",
  "task:update",
  "task:delete",
  "subtask:create",
  "subtask:read",
  "subtask:update",
  "subtask:delete",
];

const ownerPermission: string[] = ["role:owner", "user:owner", "plan:owner"];

const userPermissions: string[] = [
  "user:create",
  "user:read",
  "user:update",
  "user:delete",

  "plan:create",
  "plan:read",
  "plan:update",
  "plan:delete",
];

async function initDB() {
  const superAdminEmail: string = "gaconght@gmail.com";

  const role = await prisma.role.findFirst({
    where: {
      role_name: "Super Admin",
    },
  });

  await prisma.role.upsert({
    where: {
      role_id: role ? role.role_id : undefined,
    },
    create: {
      role_name: "Super Admin",
      read_only: true,
      permission: ownerPermission,
    },
    update: {
      permission: ownerPermission,
    },
  });

  await prisma.user.upsert({
    where: {
      email: superAdminEmail,
    },
    create: {
      email: superAdminEmail,
      username: "Thanh Nhut",
      password: hashData("@Abc123123"),
      email_verified: true,
      email_verification_token: null,
      email_verification_expires: new Date(),
      role: {
        create: [
          {
            role: {
              create: {
                role_name: "Super Admin",
                read_only: true,
                permission: ownerPermission,
              },
            },
          },
        ],
      },
    },
    update: {},
  });
}

async function createAdminRole(email: string, permission: string[]) {
  await prisma.user.upsert({
    where: {
      email,
    },
    create: {
      email,
      username: "",
      password: hashData("@Abc123123"),
      role: {
        create: [
          {
            role: {
              create: {
                role_name: "Admin",
                read_only: true,
                permission: permission,
              },
            },
          },
        ],
      },
    },
    update: {},
  });
}

async function insertUser(email: string) {}

initDB()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
