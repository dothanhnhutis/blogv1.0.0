import prisma from "@/utils/db";

async function initDB() {
  const superAdminEmail: string = "gaconght@gmail.com";

  const permissions: string[] = [
    "user_create",
    "user_read",
    "user_update",
    "user_delete",
    "plan_create",
    "plan_read",
    "plan_update",
    "plan_delete",
    "plan_member_role_create",
    "plan_member_role_read",
    "plan_member_role_update",
    "plan_member_role_delete",
    "task_create",
    "task_read",
    "task_update",
    "task_delete",
    "subtask_create",
    "subtask_read",
    "subtask_update",
    "subtask_delete",
  ];

  const role = await prisma.role.create({
    data: {
      role_name: "Super Admin",
      role_permission: {
        create: permissions.map((permission_name) => ({
          permission: {
            connectOrCreate: {
              create: {
                permission_name,
              },
              where: {
                permission_name,
              },
            },
          },
        })),
      },
    },
  });

  const user = await prisma.user.create({
    data: {
      email: superAdminEmail,
      username: "Thanh Nhut",
      role: {
        create: [
          {
            role_name: "",
            role: {
              connectOrCreate: {
                create: {},
                where: {},
              },
            },
          },
        ],
      },
    },
  });
}

async function seed() {
  const superAdminEmail: string = "gaconght@gmail.com";
  const permissions: string[] = [
    "user_create",
    "user_read",
    "user_update",
    "user_delete",
    "plan_create",
    "plan_read",
    "plan_update",
    "plan_delete",
    "plan_member_role_create",
    "plan_member_role_read",
    "plan_member_role_update",
    "plan_member_role_delete",
    "task_create",
    "task_read",
    "task_update",
    "task_delete",
    "subtask_create",
    "subtask_read",
    "subtask_update",
    "subtask_delete",
  ];

  await prisma.permission.deleteMany({
    where: {
      permission_name: {
        notIn: permissions,
      },
    },
  });

  await prisma.role.upsert({
    where: { role_name: "Super Admin" },
    create: {
      role_name: "Super Admin",
      role_permission: {
        create,
      },
    },
    update: {},
  });

  // let superAdminRole = await prisma.role.findFirst({
  //   where: {
  //     role_name: "Super Admin",
  //   },
  // });

  // Tạo hoặc cập nhật cho "Super Admin"
  // if (superAdminRole) {
  //   await prisma.role.upsert({
  //     where: {
  //       id: superAdminRole.id,
  //     },
  //     update: {
  //       role_permission: {
  //         connectOrCreate: permissions.map((permission_name) => ({
  //           where: {
  //             role_id_permission_name: {
  //               permission_name,
  //               role_id: superAdminRole.id,
  //             },
  //           },
  //           create: {
  //             permission: {
  //               connectOrCreate: {
  //                 where: {
  //                   permission_name,
  //                 },
  //                 create: {
  //                   permission_name,
  //                 },
  //               },
  //             },
  //           },
  //         })),
  //       },
  //     },
  //     create: {
  //       role_name: "Super Admin",
  //       role_permission: {
  //         create: permissions.map((permission_name) => ({
  //           permission: {
  //             connectOrCreate: {
  //               where: {
  //                 permission_name,
  //               },
  //               create: {
  //                 permission_name,
  //               },
  //             },
  //           },
  //         })),
  //       },
  //     },
  //   });
  // } else {
  //   await prisma.role.create({
  //     data: {
  //       role_name: "Super Admin",
  //       role_permission: {
  //         create: permissions.map((permission_name) => ({
  //           permission: {
  //             connectOrCreate: {
  //               where: {
  //                 permission_name,
  //               },
  //               create: {
  //                 permission_name,
  //               },
  //             },
  //           },
  //         })),
  //       },
  //     },
  //   });
  // }
}

// seed()
//   .then(async () => {
//     await prisma.$disconnect();
//   })
//   .catch(async (e) => {
//     console.error(e);
//     await prisma.$disconnect();
//     process.exit(1);
//   });
