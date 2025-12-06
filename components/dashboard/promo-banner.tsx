"use client";

import Image from "next/image";
import { UserMenu } from "@/components/auth/user-menu";

export function Header() {
  return (
    <div className="border-b border-primary/20 bg-primary backdrop-blur-sm">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <a
              href="https://app.axolutions.com.br"
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer transition-transform hover:scale-110 active:scale-95 duration-200"
            >
              <div className="animate-axolotl animate-shine-axolotl rounded-lg p-1">
                <Image
                  src="/logo.png"
                  alt="Axolutions Logo"
                  width={32}
                  height={32}
                  className="rounded-lg object-contain"
                />
              </div>
            </a>
            <span className="text-lg font-bold text-white leading-none">Link na Bio</span>
          </div>

          <div className="flex items-center gap-4">
            <UserMenu />
          </div>
        </div>
      </div>
    </div>
  );
}
