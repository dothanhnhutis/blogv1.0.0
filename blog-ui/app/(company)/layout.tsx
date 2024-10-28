import DefaultLayout from "@/components/layout/DefaultLayout";
import React from "react";

const CompanyLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <DefaultLayout>{children}</DefaultLayout>;
};

export default CompanyLayout;
