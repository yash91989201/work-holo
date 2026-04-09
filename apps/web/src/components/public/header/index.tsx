import {
  IconArrowRight,
  IconCircleCheck,
  IconMail,
  IconMenu,
  IconPhone,
} from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { Suspense, useState } from "react";
import { Image } from "@/components/shared/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { AccountDropdown } from "./account-dropdown";
import { MyOrgButton } from "./my-org-button";
import { createPath, NAV_DATA, TOP_BAR } from "./nav-data";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-14 items-center px-4 md:px-6">
        <div className="mr-4 hidden md:flex">
          <Link className="mr-6 flex items-center space-x-2" to="/">
            <Image
              alt="Work Holo logo"
              height={32}
              src="/logo.webp"
              width={32}
            />
            <h2 className="hidden font-bold text-xl sm:inline-block xl:text-2xl">
              Work Holo
            </h2>
          </Link>
          <DesktopNav />
        </div>

        <div className="flex flex-1 items-center justify-between md:justify-end">
          <div className="flex items-center md:hidden">
            <MobileNav />
            <Link className="ml-4 flex items-center space-x-2" to="/">
              <Image
                alt="Work Holo logo"
                height={24}
                src="/logo.webp"
                width={24}
              />
              <span className="font-bold">Work Holo</span>
            </Link>
          </div>

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

function DesktopNav() {
  const [activeSubItem, setActiveSubItem] = useState<string | null>(null);

  return (
    <NavigationMenu className="hidden lg:flex">
      <NavigationMenuList>
        {NAV_DATA.map((nav) => (
          <NavigationMenuItem key={nav.title}>
            {nav.hasMegaMenu ? (
              <>
                <NavigationMenuTrigger className="bg-transparent transition-colors hover:text-primary">
                  {nav.title}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="flex w-[800px] p-0 lg:w-[1000px] xl:w-[1200px]">
                    <div className="w-[280px] shrink-0 border-r bg-muted/50 p-6 lg:w-[320px] lg:p-8">
                      <h3 className="mb-6 font-black text-[12px] text-primary uppercase tracking-widest">
                        {nav.title} Categories
                      </h3>
                      <div className="space-y-2">
                        {nav.items?.map((item) => (
                          <button
                            className={cn(
                              "group flex w-full items-start gap-3 rounded-xl p-3 text-left transition-all",
                              activeSubItem === item.id
                                ? "bg-background shadow-md ring-1 ring-border"
                                : "hover:bg-background/50"
                            )}
                            key={item.id}
                            onMouseEnter={() => setActiveSubItem(item.id)}
                            type="button"
                          >
                            <div
                              className={cn(
                                "shrink-0 rounded-lg p-2.5 transition-all",
                                activeSubItem === item.id
                                  ? "scale-110 bg-primary text-primary-foreground"
                                  : "bg-background text-primary shadow-sm"
                              )}
                            >
                              <item.icon size={20} />
                            </div>
                            <div>
                              <div
                                className={cn(
                                  "font-bold text-[14px] leading-tight",
                                  activeSubItem === item.id
                                    ? "text-primary"
                                    : "text-foreground"
                                )}
                              >
                                {item.label}
                              </div>
                              <p className="mt-1 line-clamp-2 text-[12px] text-muted-foreground leading-snug">
                                {item.description}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex-1 bg-background p-6 lg:p-10">
                      {nav.title === "Home" ? (
                        <div className="space-y-6">
                          <h4 className="font-black text-[12px] text-muted-foreground uppercase tracking-widest">
                            {nav.centerContent?.title}
                          </h4>
                          <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                            {nav.centerContent?.links.map((link) => (
                              <Link
                                className="group block"
                                key={link.label}
                                to={createPath("home", link.label)}
                              >
                                <h5 className="font-bold text-[15px] text-foreground transition-colors group-hover:text-primary">
                                  {link.label}
                                </h5>
                                <p className="mt-1 text-[13px] text-muted-foreground leading-relaxed">
                                  {link.desc}
                                </p>
                                <div className="mt-2 flex -translate-x-2 items-center gap-1 font-bold text-[12px] text-primary opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100">
                                  Learn More <IconArrowRight size={12} />
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          <h4 className="font-black text-[12px] text-muted-foreground uppercase tracking-widest">
                            {
                              nav.items?.find(
                                (i) =>
                                  i.id === (activeSubItem || nav.items[0]?.id)
                              )?.label
                            }{" "}
                            Features
                          </h4>
                          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                            {nav.items
                              ?.find(
                                (i) =>
                                  i.id === (activeSubItem || nav.items[0]?.id)
                              )
                              ?.links.map((link) => (
                                <Link
                                  className="group flex flex-col rounded-xl p-3 transition-all hover:bg-muted/50"
                                  key={link.label}
                                  to={createPath(nav.title, link.label)}
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="font-bold text-[14px] text-foreground transition-colors group-hover:text-primary">
                                      {link.label}
                                    </span>
                                    <IconArrowRight
                                      className="-translate-x-2 text-primary opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
                                      size={16}
                                    />
                                  </div>
                                  <span className="mt-1 text-[12px] text-muted-foreground">
                                    {link.desc}
                                  </span>
                                </Link>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="relative flex w-[280px] shrink-0 flex-col justify-between overflow-hidden bg-primary p-6 text-primary-foreground lg:w-[320px] lg:p-10">
                      <div className="absolute top-0 right-0 -mt-32 -mr-32 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
                      <div className="relative z-10">
                        <h3 className="mb-6 border-white/20 border-b pb-4 font-black text-[16px] lg:text-[18px]">
                          {nav.whySection?.title}
                        </h3>
                        <ul className="space-y-4 lg:space-y-6">
                          {nav.whySection?.points.map((point) => (
                            <li className="flex items-start gap-3" key={point}>
                              <IconCircleCheck
                                className="mt-0.5 shrink-0 text-white"
                                size={18}
                              />
                              <span className="font-medium text-[13px] text-white/90 leading-tight lg:text-[14px]">
                                {point}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <Button
                        asChild
                        className="group relative z-10 mt-8 flex w-full items-center justify-center gap-2 rounded-xl py-6 font-black text-[15px] text-primary shadow-xl hover:bg-background"
                        variant="secondary"
                      >
                        <Link to="/contact">
                          {nav.whySection?.buttonText}
                          <IconArrowRight
                            className="transition-transform group-hover:translate-x-1"
                            size={20}
                          />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </NavigationMenuContent>
              </>
            ) : (
              <Link
                to={nav.title === "Home" ? "/" : `/${nav.title.toLowerCase()}`}
              >
                <NavigationMenuLink
                  className={cn(navigationMenuTriggerStyle(), "bg-transparent")}
                >
                  {nav.title}
                </NavigationMenuLink>
              </Link>
            )}
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="md:hidden" size="icon" variant="ghost">
          <IconMenu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        className="flex w-[85vw] max-w-[400px] flex-col border-r-0 p-0"
        side="left"
      >
        <div className="flex items-center gap-2 border-b p-6">
          <Image alt="Work Holo logo" height={32} src="/logo.webp" width={32} />
          <span className="font-black text-lg">WORKHOLO</span>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-2">
          <Accordion className="w-full" type="multiple">
            {NAV_DATA.map((nav, index) =>
              nav.hasMegaMenu ? (
                <AccordionItem
                  className="border-b-0"
                  key={nav.title}
                  value={`item-${index}`}
                >
                  <AccordionTrigger className="py-4 font-bold text-[16px] hover:no-underline">
                    {nav.title}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 rounded-xl bg-muted/50 p-4">
                      {nav.items?.map((item) => (
                        <div className="space-y-2" key={item.id}>
                          <div className="flex items-center gap-3">
                            <div className="rounded-md bg-background p-1.5 text-primary shadow-sm">
                              <item.icon size={16} />
                            </div>
                            <span className="font-bold text-[14px]">
                              {item.label}
                            </span>
                          </div>
                          <div className="flex flex-col gap-2 pl-9">
                            {nav.title === "Home"
                              ? nav.centerContent?.links.map((link) => (
                                  <SheetClose asChild key={link.label}>
                                    <Link
                                      className="text-[13px] text-muted-foreground transition-colors hover:text-primary"
                                      to={createPath("home", link.label)}
                                    >
                                      {link.label}
                                    </Link>
                                  </SheetClose>
                                ))
                              : item.links.map((link) => (
                                  <SheetClose asChild key={link.label}>
                                    <Link
                                      className="text-[13px] text-muted-foreground transition-colors hover:text-primary"
                                      to={createPath(nav.title, link.label)}
                                    >
                                      {link.label}
                                    </Link>
                                  </SheetClose>
                                ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ) : (
                <div className="py-4" key={nav.title}>
                  <SheetClose asChild>
                    <Link
                      className="block w-full font-bold text-[16px]"
                      to={
                        nav.title === "Home"
                          ? "/"
                          : `/${nav.title.toLowerCase()}`
                      }
                    >
                      {nav.title}
                    </Link>
                  </SheetClose>
                </div>
              )
            )}
          </Accordion>
        </div>

        <div className="space-y-6 border-t bg-muted/30 p-6">
          <div className="space-y-4">
            <a
              className="flex items-center gap-3 font-bold text-[14px] text-muted-foreground transition-colors hover:text-foreground"
              href={`tel:${TOP_BAR.phone1}`}
            >
              <IconPhone className="text-primary" size={18} />
              {TOP_BAR.phone1}
            </a>
            <a
              className="flex items-center gap-3 font-bold text-[14px] text-muted-foreground transition-colors hover:text-foreground"
              href={`mailto:${TOP_BAR.email}`}
            >
              <IconMail className="text-primary" size={18} />
              {TOP_BAR.email}
            </a>
          </div>
          <SheetClose asChild>
            <Button
              asChild
              className="w-full rounded-xl py-6 font-black shadow-lg transition-shadow hover:shadow-xl"
            >
              <Link to="/contact">Get Started</Link>
            </Button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}
