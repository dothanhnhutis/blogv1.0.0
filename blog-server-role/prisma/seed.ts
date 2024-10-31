import prisma from "@/utils/db";

async function seed() {
  const permissions = [
    { permission_name: "create_user" },
    { permission_name: "edit_user" },
    { permission_name: "delete_user" },
    { permission_name: "view_user" },

    { permission_name: "create_plan" },
    { permission_name: "edit_plan" },
    { permission_name: "delete_plan" },
    { permission_name: "view_plan" },

    { permission_name: "create_post" },
    { permission_name: "edit_post" },
    { permission_name: "delete_post" },
    { permission_name: "view_post" },
  ];

  const superRole = await prisma.role.create({
    data: {
      role_name: "Super Admin",
      role_permissions: {
        create: permissions.map((per) => ({
          permission: {
            connectOrCreate: {
              where: per,
              create: per,
            },
          },
        })),
      },
    },
  });

  const adminRole = await prisma.role.create({
    data: {
      role_name: "Admin",
      role_permissions: {
        create: permissions
          .filter((per) => !per.permission_name.endsWith("user"))
          .map((per) => ({
            permission: {
              connectOrCreate: {
                where: per,
                create: per,
              },
            },
          })),
      },
    },
  });

  await prisma.user.upsert({
    where: {
      email: "gaconght@gmail.com",
    },
    update: {},
    create: {
      username: "thanh nhut",
      email: "gaconght@gmail.com",
      password: "@Abc123123",
      userRole: {
        create: [
          {
            role: {
              connect: {
                id: superRole.id,
              },
            },
          },
        ],
      },
    },
  });

  const kk = await prisma.user.findUnique({
    where: { email: "gaconght@gmail.com" },

    select: {
      userRole: {
        select: {
          role: {
            select: {
              role_permissions: {
                select: {
                  permission: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const permissionsData: Record<string, number> = {};
  kk!.userRole.forEach((userRole) => {
    userRole.role.role_permissions.forEach((rolePermission) => {
      permissionsData[rolePermission.permission.permission_name] = 1;
    });
  });
  console.log(permissionsData);
}

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
