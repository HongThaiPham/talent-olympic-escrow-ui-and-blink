import React from "react";
import Logo from "../Logo";
import { NAVBAR_ITEMS } from "@/lib/constants";
import NavBarItem from "./NavBarItem";
import { ThemeSwitcherButton } from "../ThemeSwitcherButton";
import ConnectWalletButton from "@/components/ConnectWalletButton";

type Props = {};

const DesktopNavBar: React.FC<Props> = ({}) => {
  return (
    <div className="hidden border-separate border-b bg-background md:block">
      <nav className="container flex items-center justify-between px-8">
        <div className="flex h-[80px] min-h-[60px] items-center gap-x-4">
          <Logo />
          <div className="flex h-full">
            {NAVBAR_ITEMS.map((item) => (
              <NavBarItem key={item.label} item={item} />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeSwitcherButton />
          <ConnectWalletButton />
        </div>
      </nav>
    </div>
  );
};

export default DesktopNavBar;
