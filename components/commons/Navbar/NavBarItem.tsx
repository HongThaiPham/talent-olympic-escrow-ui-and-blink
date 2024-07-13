"use client";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NavBarItemType } from "@/types/NavBarItem.type";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

type Props = {
  item: NavBarItemType;
  onClick?: () => void;
};

const NavBarItem: React.FC<Props> = ({ item, onClick }) => {
  const pathname = usePathname();
  const isActive = pathname === item.link;
  return (
    <div className="relative flex items-center">
      <Link
        href={item.link}
        className={cn(
          buttonVariants({
            variant: "ghost",
          }),
          "w-full justify-start text-lg text-muted-foreground hover:text-foreground",
          isActive && "text-foreground"
        )}
        onClick={
          onClick
            ? (e) => {
                e.preventDefault();
                onClick();
              }
            : undefined
        }
      >
        {item.label}
      </Link>
      {isActive ? (
        <div className="absolute -bottom-[2px] left-1/2 hidden h-[2px] w-[80%] -translate-x-1/2 rounded-xl bg-lime-500 md:block"></div>
      ) : null}
    </div>
  );
};

export default NavBarItem;
