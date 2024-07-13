import NavBar from "@/components/commons/Navbar";
import React, { PropsWithChildren } from "react";

type Props = {};

const DashboardLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <main className="relative flex h-screen w-full flex-col">
      <NavBar />
      {children}
    </main>
  );
};

export default DashboardLayout;
