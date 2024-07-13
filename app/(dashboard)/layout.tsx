import NavBar from "@/components/commons/Navbar";
import React, { PropsWithChildren, Suspense } from "react";

const DashboardLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <main className="relative flex min-h-screen w-full flex-col">
      <NavBar />
      <Suspense
        fallback={
          <div className="text-center my-32">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        }
      >
        {children}
      </Suspense>
    </main>
  );
};

export default DashboardLayout;
