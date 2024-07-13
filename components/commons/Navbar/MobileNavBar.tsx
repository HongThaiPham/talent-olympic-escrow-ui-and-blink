"use client";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import React from "react";

import { ThemeSwitcherButton } from "../ThemeSwitcherButton";
import Logo from "../Logo";
import { NAVBAR_ITEMS } from "@/lib/constants";
import ConnectWalletButton from "@/components/ConnectWalletButton";
import NavBarItem from "./NavBarItem";

type Props = {};

const MobileNavBar: React.FC<Props> = ({}) => {
  const [isOpened, setIsOpened] = React.useState(false);

  return (
    <div className="block border-separate bg-background md:hidden">
      <nav className="container flex items-center justify-between px-8">
        <Sheet open={isOpened} onOpenChange={setIsOpened}>
          <SheetTrigger asChild>
            <Button variant={"ghost"} size={"icon"}>
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[400px] sm:w-[540px]" side={"left"}>
            <Logo />
            <div className="flex flex-col gap-1 pt-4">
              {NAVBAR_ITEMS.map((item) => (
                <NavBarItem
                  key={item.label}
                  item={item}
                  onClick={() => setIsOpened((prev) => !prev)}
                />
              ))}
            </div>
          </SheetContent>
        </Sheet>
        <div className="flex h-[80px] min-h-[60px] items-center gap-x-4">
          <Logo isMobile />
        </div>
        <div className="flex items-center gap-2">
          <ThemeSwitcherButton />
          <ConnectWalletButton />
        </div>
      </nav>
    </div>
  );
};

export default MobileNavBar;
