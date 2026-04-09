import { Link, useLocation } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ABOUT_LINKS = [
  { href: "/about/company-overview", label: "Company Overview" },
  { href: "/about/vision-mission", label: "Vision & Mission" },
  { href: "/about/leadership-team", label: "Leadership Team" },
  { href: "/about/our-journey", label: "Our Journey" },
  { href: "/about/awards-recognition", label: "Awards & Recognition" },
  { href: "/about/nasscom-membership", label: "NASSCOM Membership" },
  { href: "/about/life-at-workholo-labs", label: "Life at WorkHolo" },
];

export function AboutNav() {
  const { pathname } = useLocation();

  return (
    <nav className="flex flex-col space-y-1">
      {ABOUT_LINKS.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Button
            asChild
            className={cn(
              "justify-start text-left font-medium",
              isActive ? "bg-muted font-semibold" : "text-muted-foreground"
            )}
            key={link.href}
            variant={isActive ? "secondary" : "ghost"}
          >
            <Link to={link.href}>{link.label}</Link>
          </Button>
        );
      })}
    </nav>
  );
}
