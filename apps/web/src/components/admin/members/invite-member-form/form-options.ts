import { formOptions } from "@tanstack/react-form";
import type { InviteMemberFormType } from "@/lib/types";

export const inviteFormOpts = formOptions({
  defaultValues: {
    email: "",
    teamId: "",
  } satisfies InviteMemberFormType as InviteMemberFormType,
});
