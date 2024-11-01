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
  await prisma.roles.deleteMany();
  await prisma.users.deleteMany();

  const role = await prisma.roles.create({
    data: {
      role_name: "Super Admin",
      read_only: true,
      permission: ownerPermission,
    },
  });

  await prisma.users.create({
    data: {
      email: superAdminEmail,
      username: "Thanh Nhut",
      password: hashData("@Abc123123"),
      email_verified: true,
      email_verification_token: null,
      email_verification_expires: new Date(),
      roles: {
        create: [
          {
            role_id: role.role_id,
          },
        ],
      },
    },
  });
}

async function createAdmin() {
  const admin = await prisma.roles.create({
    data: {
      role_name: "Admin",
      permission: userPermissions,
    },
  });
  await prisma.users.create({
    data: {
      email: "gaconght001@gmail.com",
      username: "Thanh Nhut",
      password: hashData("@Abc123123"),
      email_verified: true,
      email_verification_token: null,
      email_verification_expires: new Date(),
      roles: {
        create: [
          {
            role_id: admin.role_id,
          },
        ],
      },
    },
  });
}

async function createNormal() {
  const normal = await prisma.roles.create({
    data: {
      role_name: "Normal",
      permission: [],
    },
  });
  await prisma.users.create({
    data: {
      email: "gaconght002@gmail.com",
      username: "Thanh Nhut",
      password: hashData("@Abc123123"),
      email_verified: true,
      email_verification_token: null,
      email_verification_expires: new Date(),
      roles: {
        create: [
          {
            role_id: normal.role_id,
          },
        ],
      },
    },
  });
  await prisma.users.create({
    data: {
      email: "gaconght003@gmail.com",
      username: "Thanh Nhut",
      password: hashData("@Abc123123"),
      email_verified: true,
      email_verification_token: null,
      email_verification_expires: new Date(),
      roles: {
        create: [
          {
            role_id: normal.role_id,
          },
        ],
      },
    },
  });
  await prisma.users.create({
    data: {
      email: "gaconght004@gmail.com",
      username: "Thanh Nhut",
      password: hashData("@Abc123123"),
      email_verified: true,
      email_verification_token: null,
      email_verification_expires: new Date(),
      roles: {
        create: [
          {
            role_id: normal.role_id,
          },
        ],
      },
    },
  });
}

async function createPlan() {
  const admin = await prisma.users.findUnique({
    where: {
      email: "gaconght001@gmail.com",
    },
  });
  const member1 = await prisma.users.findUnique({
    where: {
      email: "gaconght002@gmail.com",
    },
  });
  const member2 = await prisma.users.findUnique({
    where: {
      email: "gaconght003@gmail.com",
    },
  });
  if (admin) {
    const plant = await prisma.plans.create({
      data: {
        plan_name: "plan name",
        plan_description: "some description",
        start_date: "2024-11-01T08:06:05.597Z",
        due_date: "2024-12-01T08:06:05.597Z",
        create_by_id: admin?.email,
      },
    });
    const planRole1 = await prisma.planRoles.create({
      data: {
        plan_role_name: "plan role 1",
        plan_permission: [
          "planMemberRole:read",
          "task:create",
          "task:read",
          "task:update",
          "task:delete",
          "subtask:create",
          "subtask:read",
          "subtask:update",
          "subtask:delete",
        ],
        plan_id: plant.id,
      },
    });

    const planRole2 = await prisma.planRoles.create({
      data: {
        plan_role_name: "plan role 2",
        plan_permission: [
          "task:create",
          "task:read",
          "task:update",
          "task:delete",
          "subtask:create",
          "subtask:read",
          "subtask:update",
          "subtask:delete",
        ],
        plan_id: plant.id,
      },
    });

    await prisma.planMembers.createMany({
      data: [
        { plan_id: plant.id, user_id: member1!.id },
        { plan_id: plant.id, user_id: member2!.id },
      ],
    });
  }
}

initDB()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

// createPlan()
//   .then(async () => {
//     await prisma.$disconnect();
//   })
//   .catch(async (e) => {
//     console.error(e);
//     await prisma.$disconnect();
//     process.exit(1);
//   });
