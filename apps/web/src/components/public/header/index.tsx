import { Link } from "@tanstack/react-router";
import { Suspense } from "react";
import { Image } from "@/components/shared/image";
import { AccountDropdown } from "./account-dropdown";
import { MyOrgButton } from "./my-org-button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link className="mr-6 flex items-center space-x-2" to="/">
            <Image
              alt="Work Holo logo"
              height={32}
              src="/logo.webp"
              width={48}
            />
            <h2 className="hidden font-bold text-xl sm:inline-block xl:text-2xl">
              Workholo
            </h2>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center space-x-2">
            <Suspense fallback={<MyOrgButton.Fallback />}>
              <MyOrgButton />
            </Suspense>
            <Suspense fallback={<AccountDropdown.Fallback />}>
              <AccountDropdown />
            </Suspense>
          </nav>
        </div>
      </div>
    </header>
  );
}
