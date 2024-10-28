import React from "react";
import { format, FormatOptions } from "date-fns";

export const clockHook = (formatStr?: string, options?: FormatOptions) => {
  const [time, setTime] = React.useState(new Date());

  React.useEffect(() => {
    // navigator.geolocation.getCurrentPosition(
    //   (position) => {
    //     const lat = position.coords.latitude;
    //     const lng = position.coords.longitude;
    //     console.log("Latitude:", lat, "Longitude:", lng);
    //   },
    //   (error) => {
    //     console.error("Error getting location:", error.message);
    //   }
    // );
    const timeOutId = setInterval(() => {
      setTime(new Date());
    });
    return () => clearInterval(timeOutId);
  }, [time]);

  return format(time, formatStr || "dd/MM/yy HH:mm:ss", options);
};
