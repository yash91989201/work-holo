import { formOptions } from "@tanstack/react-form";

export const channelFormOpts = formOptions({
	defaultValues: {
		name: "",
		description: undefined as string | undefined,
		isPublic: true,
		type: "team" as "team" | "group" | "direct",
		teamId: undefined as string | undefined,
		memberIds: [] as string[],
		createdBy: "",
	},
});
