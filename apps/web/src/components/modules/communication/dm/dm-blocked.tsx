import { IconLock } from "@tabler/icons-react";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@work-holo/ui/components/empty";

type DmBlockedReason = "org_disabled" | "team_restricted" | "user_restricted";

interface DmBlockedProps {
  reason: DmBlockedReason;
}

export function DmBlocked({ reason }: DmBlockedProps) {
  const isOrgDisabled = reason === "org_disabled";

  return (
    <Empty>
      <EmptyMedia variant="icon">
        <IconLock />
      </EmptyMedia>
      <EmptyHeader>
        <EmptyTitle>
          {isOrgDisabled ? "Direct Messages Disabled" : "Access Restricted"}
        </EmptyTitle>
        <EmptyDescription>
          {isOrgDisabled
            ? "This organization has the Direct Messages feature disabled. Contact your administrator for access."
            : "You do not have access to the Direct Messages feature. Contact your administrator for access."}
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
