import { Link } from "@tanstack/react-router";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useActiveMemberRole } from "@/hooks/use-active-member-role";
import { useActiveOrgSlug } from "@/hooks/use-active-org-slug";
import { useSession } from "@/hooks/use-session";

export function MyOrgButton() {
  const slug = useActiveOrgSlug();
  const session = useSession();
  const role = useActiveMemberRole();

  if (!(session && role)) {
    return null;
  }

  if (!slug) {
    return (
      <Link className={buttonVariants({ variant: "outline" })} to="/org/new">
        Create Org
      </Link>
    );
  }

  return (
    <Link
      className={buttonVariants({ variant: "outline" })}
      params={{ slug }}
      to="/org/$slug/attendance"
    >
      My Org
    </Link>
  );
}

export function MyOrgButtonSkeleton() {
  return <Skeleton className="h-9 w-20" />;
}
