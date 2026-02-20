import { formOptions } from "@tanstack/react-form";
import type { InvitationFormType } from "@/lib/types";

export const inviteFormOpts = formOptions({
  defaultValues: {
    email: "",
    role: "member" as const,
    teamId: "",
  } satisfies InvitationFormType as InvitationFormType,
});
