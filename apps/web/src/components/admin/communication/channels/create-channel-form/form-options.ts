import { formOptions } from "@tanstack/react-form";
import type { CreateChannelFormType } from "@/lib/types";

export const channelFormOpts = formOptions({
  defaultValues: {
    name: "",
    description: undefined,
    isPublic: true,
    type: "team",
    teamId: undefined,
    memberIds: [],
    createdBy: "",
  } satisfies CreateChannelFormType as CreateChannelFormType,
});
