import { Button } from "@/components/ui/button";
import { Flame } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full min-h-screen">
      <div className="container relative m-0 mx-auto py-10 md:px-10">
        <div className="max-width flex items-center justify-center">
          <Link className="flex flex-col items-center gap-1" href="/">
            <Image
              src={"/talent-olympics.svg"}
              width={186.55}
              height={192}
              alt="logo"
              className="h-16 w-16 md:h-48 md:w-48"
            />
            <h1 className="text-xl hidden lg:flex font-medium md:text-5xl text-white">
              Sol Escrow Ui & Blink
            </h1>
          </Link>
        </div>
        <div className="w-full px-4 pt pt-12 md:px-4 lg:px-8 xl:px-10 2xl:px-0">
          <div className="flex h-full w-full flex-col items-center justify-center ">
            <span
              rel="noreferrer"
              className="mb-6 cursor-pointer rounded-2xl border border-black/50 px-4 py-1 text-xs text-slate-600 transition duration-300 ease-in-out hover:text-slate-700 sm:text-base text-center bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90%"
            >
              Powered by{" "}
              <a
                className="font-bold"
                target="_blank"
                href="https://solana.com/"
              >
                Solana ✨
              </a>
            </span>
            <h1 className="inline-block text-center text-4xl font-medium tracking-tighter text-dark lg:text-7xl">
              Secure Your Financial Transactions{" "}
            </h1>

            <div className="mt-12 flex flex-col gap-4">
              <div className="w-fit items-center space-x-4">
                <Button
                  className="text-xl text-center px-4 py-7 bg-transparent border-purple-500/50"
                  variant={"outline"}
                  asChild
                >
                  <Link
                    href={
                      "https://github.com/HongThaiPham/talent-olympic-escrow-ui-and-blink"
                    }
                    target="_blank"
                  >
                    Star on Github ⭐️
                  </Link>
                </Button>
                <Button
                  className="text-xl text-center px-4 py-7  bg-orange-500 border-none"
                  variant={"outline"}
                  asChild
                >
                  <Link href={"/explorer"}>
                    Get started
                    <Flame className="ml-2 w-5 h-5 " />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
