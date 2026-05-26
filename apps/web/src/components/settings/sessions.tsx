import {
  IconDeviceDesktop,
  IconDeviceMobile,
  IconTrashFilled,
} from "@tabler/icons-react";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@work-holo/ui/components/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@work-holo/ui/components/item";
import { Separator } from "@work-holo/ui/components/separator";
import { Skeleton } from "@work-holo/ui/components/skeleton";
import { toast } from "sonner";
import { UAParser } from "ua-parser-js";
import { useSession } from "@/hooks/use-session";
import { useSessionList } from "@/hooks/use-session-list";
import { getAuthQueryKey } from "@/lib/auth/query-keys";
import { authClient } from "@/lib/auth-client";
import { getBrowserInformation } from "@/utils";
import { queryClient } from "@/utils/orpc";

function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

export function CurrentSession() {
  const navigate = useNavigate();
  const currentSession = useSession();
  const sessions = useSessionList();

  const currentSessionToken = currentSession?.session.token;
  const currentSessionData = sessions?.find(
    (s) => s.token === currentSessionToken
  );

  async function logout() {
    try {
      const { error } = await authClient.signOut();
      if (error) {
        toast.error(error.message || "Failed to logout");
        return;
      }

      toast.success("Logged out successfully");
      navigate({ to: "/login" });
    } catch {
      toast.error("An unexpected error occurred");
    }
  }

  if (!currentSessionData) {
    return null;
  }

  return (
    <div className="space-y-3">
      <h3>Current session</h3>
      <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
        <Item>
          <ItemContent>
            <ItemTitle className="flex items-center gap-2">
              {new UAParser(currentSessionData.userAgent || "").getResult()
                .device.type === "mobile" ? (
                <IconDeviceMobile className="size-4" />
              ) : (
                <IconDeviceDesktop className="size-4" />
              )}
              {getBrowserInformation(currentSessionData.userAgent)}
            </ItemTitle>
            <ItemDescription>
              Created: {formatDate(currentSessionData.createdAt)} • Expires:{" "}
              {formatDate(currentSessionData.expiresAt)}
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button onClick={logout} size="sm" variant="destructive">
              Logout
            </Button>
          </ItemActions>
        </Item>
      </div>
    </div>
  );
}

export function OtherSessions() {
  const currentSession = useSession();
  const sessions = useSessionList();

  async function revokeSession(sessionToken: string) {
    try {
      const { error } = await authClient.revokeSession({ token: sessionToken });
      if (error) {
        toast.error(error.message || "Failed to revoke session");
        return;
      }

      toast.success("Session revoked successfully");
      // Invalidate session list to refetch data
      await queryClient.invalidateQueries({
        queryKey: getAuthQueryKey.session.list(),
      });
    } catch {
      toast.error("An unexpected error occurred");
    }
  }

  async function revokeOtherSessions() {
    try {
      const { error } = await authClient.revokeOtherSessions();
      if (error) {
        toast.error(error.message || "Failed to revoke other sessions");
        return;
      }

      toast.success("Other sessions revoked successfully");
      // Invalidate session list to refetch data
      await queryClient.invalidateQueries({
        queryKey: getAuthQueryKey.session.list(),
      });
    } catch {
      toast.error("An unexpected error occurred");
    }
  }

  const currentSessionToken = currentSession?.session.token;
  const otherSessions =
    sessions?.filter((s) => s.token !== currentSessionToken) || [];

  return (
    <div className="space-y-3">
      <h3>Other sessions</h3>
      {otherSessions.length > 0 ? (
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
          {otherSessions.map((session, index) => (
            <div key={session.id}>
              <Item>
                <ItemContent>
                  <ItemTitle className="flex items-center gap-2">
                    {new UAParser(session.userAgent || "").getResult().device
                      .type === "mobile" ? (
                      <IconDeviceMobile className="size-4" />
                    ) : (
                      <IconDeviceDesktop className="size-4" />
                    )}
                    {getBrowserInformation(session.userAgent)}
                  </ItemTitle>
                  <ItemDescription>
                    Created: {formatDate(session.createdAt)} • Expires:{" "}
                    {formatDate(session.expiresAt)}
                  </ItemDescription>
                </ItemContent>
                <ItemActions>
                  <Button
                    aria-label="Revoke session"
                    onClick={() => revokeSession(session.token)}
                    size="sm"
                    variant="destructive"
                  >
                    <IconTrashFilled className="size-4" />
                  </Button>
                </ItemActions>
              </Item>
              {index < otherSessions.length - 1 && <Separator />}
            </div>
          ))}
          <Separator />
          <div className="flex justify-end p-4">
            <Button
              onClick={revokeOtherSessions}
              size="sm"
              variant="destructive"
            >
              Revoke All
            </Button>
          </div>
        </div>
      ) : (
        <p className="text-muted-foreground text-sm">
          No other active sessions.
        </p>
      )}
    </div>
  );
}

export function CurrentSessionSkeleton() {
  return (
    <div className="space-y-3">
      <h3>Current session</h3>
      <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
        <Item>
          <ItemContent>
            <ItemTitle className="flex items-center gap-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-48" />
            </ItemTitle>
            <ItemDescription>
              <Skeleton className="h-3 w-64" />
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <Skeleton className="h-8 w-20" />
          </ItemActions>
        </Item>
      </div>
    </div>
  );
}

export function OtherSessionsSkeleton() {
  return (
    <div className="space-y-3">
      <h3>Other sessions</h3>
      <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
        {/* biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list */}
        {Array.from({ length: 2 }).map((_, index) => (
          <div key={index}>
            <Item>
              <ItemContent>
                <ItemTitle className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-40" />
                </ItemTitle>
                <ItemDescription>
                  <Skeleton className="h-3 w-56" />
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <Skeleton className="h-8 w-8" />
              </ItemActions>
            </Item>
            <Separator />
          </div>
        ))}
        <div className="flex justify-end p-4">
          <Skeleton className="h-8 w-24" />
        </div>
      </div>
    </div>
  );
}

CurrentSession.Fallback = CurrentSessionSkeleton;
OtherSessions.Fallback = OtherSessionsSkeleton;
