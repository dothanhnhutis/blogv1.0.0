import {
  BadgeInfoIcon,
  BellRingIcon,
  CalendarDaysIcon,
  CircleCheckIcon,
  CircleIcon,
  LayoutListIcon,
  ListCheckIcon,
  ListChecksIcon,
  ListTodoIcon,
  LoaderCircleIcon,
  LogInIcon,
  Rows3Icon,
} from "lucide-react";
import Image from "next/image";
import React from "react";

const FactoryTask = () => {
  return (
    <div className="flex bg-gradient-to-r from-blue-300 from-10% via-sky-400 via-30% to-emerald-200 to-90%">
      <div className="sticky top-0 left-0 right-0 h-screen p-2">
        <div className="shadow rounded-full p-2 flex flex-col items-center justify-center bg-white h-full">
          <p className="pt-2">
            00<span>:</span>00
          </p>

          <div className="h-full  flex flex-col justify-center items-center gap-2 text-muted-foreground">
            <button
              type="button"
              className="p-2 bg-blue-50 rounded-full text-primary"
            >
              <BellRingIcon className="shrink-0 size-6" />
            </button>
            <button
              type="button"
              className="p-2 bg-blue-50 rounded-full text-primary"
            >
              <Rows3Icon className="shrink-0 size-6" />
            </button>
            <button type="button" className="p-2 hover:bg-blue-50 rounded-full">
              <CalendarDaysIcon className="shrink-0 size-6" />
            </button>
          </div>
          <Image
            src="/logo.png"
            alt="logo.png"
            width="100"
            height="100"
            className="size-10 shrink-0 rounded-full border"
          />
          <button
            type="button"
            className="p-[7px] rounded-full border text-muted-foreground"
          >
            <LogInIcon className="shrink-0 size-6" />
          </button>
        </div>
      </div>
      <div className="w-full pr-2">
        <div className="sticky top-0 right-0">
          <div className="flex items-center gap-2 py-2 ">
            <button
              type="button"
              className="bg-white px-2 py-1 rounded-lg text-sm"
            >
              Today
            </button>
            <button
              type="button"
              className="bg-white px-2 py-1 rounded-lg text-sm"
            >
              Tomorrow
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-2 pb-2">
          <div className="border-2 border-white rounded-lg p-2 bg-gradient-to-b from-red-100 to-white space-y-1">
            {/* <Image
                src="/logo.png"
                alt="logo.png"
                width="100"
                height="100"
                className="size-12 shrink-0 rounded-full border-2 border-white shadow-sm shadow-red-300 bg-white"
              /> */}

            <h4 className="font-semibold lg:text-lg xl:text-2xl lg:line-clamp-2">
              3 Thùng Khóm Specifies the offset length of the shadow. This
              parameter accepts two, three, or four values. Third and fourth
              values are optional. They are interpreted as follows:
            </h4>
            <p className="text-sm lg:text-base xl:text-lg text-muted-foreground">
              Specifies the offset length of the shadow. This parameter accepts
              two, three, or four values. Third and fourth values are optional.
              They are interpreted as follows. Specifies the offset length of
              the shadow. This parameter accepts two, three, or four values.
              Third and fourth values are optional. They are interpreted as
              follows. Specifies the offset length of the shadow. This parameter
              accepts two, three, or four values. Third and fourth values are
              optional. They are interpreted as follows:
            </p>
            <ul className="list-inside list-disc text-sm lg:text-base xl:text-lg">
              <li className=" text-blue-500">
                5 cups chopped Porcini mushrooms
              </li>
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

          <div className="border-2 border-white rounded-lg p-2 bg-gradient-to-b from-yellow-100 to-white space-y-1">
            <h4 className="font-semibold lg:text-lg xl:text-2xl lg:line-clamp-2">
              3 Thùng Khóm Specifies the offset length of the shadow. This
              parameter accepts two, three, or four values. Third and fourth
              values are optional. They are interpreted as follows:
            </h4>
            <p className="text-sm lg:text-base xl:text-lg text-muted-foreground">
              Specifies the offset length of the shadow. This parameter accepts
              two, three, or four values. Third and fourth values are optional.
              They are interpreted as follows. Specifies the offset length of
              the shadow. This parameter accepts two, three, or four values.
              Third and fourth values are optional. They are interpreted as
              follows. Specifies the offset length of the shadow. This parameter
              accepts two, three, or four values. Third and fourth values are
              optional. They are interpreted as follows:
            </p>
            <ul className="list-inside list-disc text-sm lg:text-base xl:text-lg">
              <li className=" text-blue-500">
                5 cups chopped Porcini mushrooms
              </li>
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
              They are interpreted as follows. Specifies the offset length of
              the shadow. This parameter accepts two, three, or four values.
              Third and fourth values are optional. They are interpreted as
              follows. Specifies the offset length of the shadow. This parameter
              accepts two, three, or four values. Third and fourth values are
              optional. They are interpreted as follows:
            </p>
            <ul className="list-inside list-disc text-sm lg:text-base xl:text-lg">
              <li className=" text-blue-500">
                5 cups chopped Porcini mushrooms
              </li>
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
              They are interpreted as follows. Specifies the offset length of
              the shadow. This parameter accepts two, three, or four values.
              Third and fourth values are optional. They are interpreted as
              follows. Specifies the offset length of the shadow. This parameter
              accepts two, three, or four values. Third and fourth values are
              optional. They are interpreted as follows:
            </p>
            <ul className="list-inside list-disc text-sm lg:text-base xl:text-lg">
              <li className=" text-blue-500">
                5 cups chopped Porcini mushrooms
              </li>
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

          <div className="border-2 border-white rounded-lg p-2 bg-gradient-to-b from-yellow-100 to-white h-[200px]">
            <Image
              src="/logo.png"
              alt="logo.png"
              width="100"
              height="100"
              className="size-12 shrink-0 rounded-full border-2 border-white shadow-sm shadow-yellow-300 bg-white"
            />
          </div>

          <div className="border-2 border-white rounded-lg p-2 bg-gradient-to-b from-green-100 to-white h-[200px]">
            <Image
              src="/logo.png"
              alt="logo.png"
              width="100"
              height="100"
              className="size-12 shrink-0 rounded-full border-2 border-white shadow-sm shadow-green-300 bg-white"
            />
          </div>

          <div className="border-2 border-white rounded-lg p-2 bg-gradient-to-b from-blue-100 to-white h-[200px]">
            <Image
              src="/logo.png"
              alt="logo.png"
              width="100"
              height="100"
              className="size-12 shrink-0 rounded-full border-2 border-white shadow-sm shadow-blue-300 bg-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FactoryTask;
