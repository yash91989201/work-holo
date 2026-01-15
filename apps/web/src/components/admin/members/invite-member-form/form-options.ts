import { formOptions } from "@tanstack/react-form";

export const inviteFormOpts = formOptions({
	defaultValues: {
		email: "",
		teamId: "",
	},
});
