import { useNavigate } from "@tanstack/react-router";
import { Monitor, Smartphone, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { UAParser } from "ua-parser-js";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { Separator } from "@/components/ui/separator";
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
    } catch (err) {
      toast.error("An unexpected error occurred");
      console.error("Error logging out:", err);
    }
  }

  if (!currentSessionData) {
    return null;
  }

  return (
    <Item>
      <ItemContent>
        <ItemTitle className="flex items-center gap-2">
          {new UAParser(currentSessionData.userAgent || "").getResult().device
            .type === "mobile" ? (
            <Smartphone className="size-4" />
          ) : (
            <Monitor className="size-4" />
          )}
          {getBrowserInformation(currentSessionData.userAgent)}
          <Badge>Current</Badge>
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
    } catch (err) {
      toast.error("An unexpected error occurred");
      console.error("Error revoking session:", err);
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
    } catch (err) {
      toast.error("An unexpected error occurred");
      console.error("Error revoking other sessions:", err);
    }
  }

  const currentSessionToken = currentSession?.session.token;
  const otherSessions =
    sessions?.filter((s) => s.token !== currentSessionToken) || [];

  return (
    <>
      <Item>
        <ItemContent>
          <ItemTitle>Other Sessions</ItemTitle>
          <ItemDescription>
            {otherSessions.length > 0
              ? `${otherSessions.length} other session${otherSessions.length === 1 ? "" : "s"} active`
              : "No other sessions"}
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          {otherSessions.length > 0 && (
            <Button
              onClick={revokeOtherSessions}
              size="sm"
              variant="destructive"
            >
              Revoke All
            </Button>
          )}
        </ItemActions>
      </Item>

      {otherSessions.length > 0 && (
        <>
          <Separator />
          {otherSessions.map((session) => (
            <Item key={session.id}>
              <ItemContent>
                <ItemTitle className="flex items-center gap-2">
                  {new UAParser(session.userAgent || "").getResult().device
                    .type === "mobile" ? (
                    <Smartphone className="size-4" />
                  ) : (
                    <Monitor className="size-4" />
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
                  onClick={() => revokeSession(session.token)}
                  size="sm"
                  variant="destructive"
                >
                  <Trash2 className="size-4" />
                </Button>
              </ItemActions>
            </Item>
          ))}
        </>
      )}
    </>
  );
}

export function ManageSessions() {
  return (
    <div className="space-y-3">
      <h3>Manage sessions</h3>
      <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
        <CurrentSession />
        <Separator />
        <OtherSessions />
      </div>
    </div>
  );
}

export function CurrentSessionSkeleton() {
  return (
    <Item>
      <ItemContent>
        <ItemTitle className="flex items-center gap-2">
          <div className="h-4 w-4 animate-pulse rounded bg-muted" />
          <div className="h-4 w-48 animate-pulse rounded bg-muted" />
          <div className="h-5 w-16 animate-pulse rounded bg-muted" />
        </ItemTitle>
        <ItemDescription>
          <div className="h-3 w-64 animate-pulse rounded bg-muted" />
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <div className="h-8 w-20 animate-pulse rounded bg-muted" />
      </ItemActions>
    </Item>
  );
}

export function OtherSessionsSkeleton() {
  return (
    <>
      <Item>
        <ItemContent>
          <ItemTitle>
            <div className="h-4 w-36 animate-pulse rounded bg-muted" />
          </ItemTitle>
          <ItemDescription>
            <div className="h-3 w-48 animate-pulse rounded bg-muted" />
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <div className="h-8 w-24 animate-pulse rounded bg-muted" />
        </ItemActions>
      </Item>
      <Separator />
      {Array.from({ length: 2 }).map((_, index) => (
        <Item key={index.toString()}>
          <ItemContent>
            <ItemTitle className="flex items-center gap-2">
              <div className="h-4 w-4 animate-pulse rounded bg-muted" />
              <div className="h-4 w-40 animate-pulse rounded bg-muted" />
            </ItemTitle>
            <ItemDescription>
              <div className="h-3 w-56 animate-pulse rounded bg-muted" />
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <div className="h-8 w-8 animate-pulse rounded bg-muted" />
          </ItemActions>
        </Item>
      ))}
    </>
  );
}

export function ManageSessionsSkeleton() {
  return (
    <div className="space-y-3">
      <h3>Manage sessions</h3>
      <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
        <CurrentSessionSkeleton />
        <Separator />
        <OtherSessionsSkeleton />
      </div>
    </div>
  );
}
