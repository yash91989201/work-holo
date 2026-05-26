import { Link } from "@tanstack/react-router";
import { buttonVariants } from "@work-holo/ui/components/button";
import { Skeleton } from "@work-holo/ui/components/skeleton";
import { useActiveMemberRole } from "@/hooks/use-active-member-role";
import { useActiveOrgSlug } from "@/hooks/use-active-org-slug";
import { useSession } from "@/hooks/use-session";
import { getOrgRouteByRole } from "@/utils";

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

  const route = getOrgRouteByRole(role, slug);

  return (
    <Link className={buttonVariants({ variant: "outline" })} {...route}>
      My Org
    </Link>
  );
}

export function MyOrgButtonSkeleton() {
  return <Skeleton className="h-9 w-20" />;
}

MyOrgButton.Fallback = MyOrgButtonSkeleton;
