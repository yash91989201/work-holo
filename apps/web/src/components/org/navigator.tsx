import { Link, useMatches } from "@tanstack/react-router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@work-holo/ui/components/breadcrumb";
import { Fragment } from "react";

type BreadcrumbEntry = {
  label: string;
  path: string;
};

function useBreadcrumbs(): BreadcrumbEntry[] {
  const matches = useMatches();

  return matches.flatMap((match) => {
    if (match.staticData?.crumb) {
      return [{ label: match.staticData.crumb, path: match.pathname }];
    }
    const { loaderData } = match;
    if (
      loaderData !== null &&
      typeof loaderData === "object" &&
      "crumb" in loaderData
    ) {
      const crumb = (loaderData as { crumb: unknown }).crumb;
      if (typeof crumb === "string") {
        return [{ label: crumb, path: match.pathname }];
      }
    }
    return [];
  });
}

export function Navigator() {
  const breadcrumbs = useBreadcrumbs();

  if (breadcrumbs.length === 0) return null;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;

          return (
            <Fragment key={crumb.path}>
              {index !== 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    render={<Link to={crumb.path}>{crumb.label}</Link>}
                  />
                )}
              </BreadcrumbItem>
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
