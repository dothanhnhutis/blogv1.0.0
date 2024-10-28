"use client";
import { clockHook } from "@/hook/clockHook";
import { AlarmClockIcon } from "lucide-react";
import React from "react";

const Clock = () => {
  return (
    <div className="flex gap-2 items-center flex-shrink-0">
      <AlarmClockIcon className="shrink-0 size-8" />
      <p>{clockHook()}</p>
    </div>
  );
};

export default Clock;
