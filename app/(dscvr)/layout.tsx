import Logo from "@/components/commons/Logo";
import { Metadata } from "next";
import Link from "next/link";
import React, { PropsWithChildren } from "react";

const baseURL =
  process.env.NODE_ENV === "production"
    ? (process.env.NEXT_PUBLIC_DOMAIN as string)
    : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(baseURL),
  title: "DSCVR Canvas - Escrow & Blink",
  description: "DSCVR Canvas - Escrow & Blink",
  other: {
    "dscvr:canvas:version": "vNext",
  },
};

const DscvrLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="h-screen min-h-screen">
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 border-separate border-b bg-background">
        <nav className="container mx-auto flex items-center px-8">
          <div className="flex h-[50px] min-h-[45px] items-center gap-x-4 justify-between w-full">
            <Logo />
            <div className="text-white text-sm">
              Build on{" "}
              <span className="font-bold">
                <Link href={"https://dscvr.one/"} target="_blank">
                  DSCVR
                </Link>
              </span>
            </div>
          </div>
        </nav>
      </div>
      <div className="container mx-auto max-w-[450px] h-full py-5">
        {children}
      </div>
    </div>
  );
};

export default DscvrLayout;
