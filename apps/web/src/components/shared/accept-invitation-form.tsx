import { useMutation } from "@tanstack/react-query";
import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import { Loader } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useAppForm } from "@/components/ui/form/hooks";
import { acceptOrgInvitation } from "@/lib/auth/invitation";
import { AcceptInvitationFormSchema } from "@/lib/schemas/auth";
import type { AcceptInvitationFormType } from "@/lib/types";

export function AcceptInvitationForm() {
	const navigate = useNavigate();

	const params = useParams({
		from: "/(auth)/accept-invitation/$id",
	});

	const search = useSearch({
		from: "/(auth)/accept-invitation/$id",
	});

	const invitationId = params.id ?? "";
	const email = search.email ?? "";

	const form = useAppForm({
		defaultValues: {
			email,              // ✅ always defined
			name: "",
			password: "",
			invitationId,
		} satisfies AcceptInvitationFormType,
		validators: {
			onSubmit: AcceptInvitationFormSchema,
		},
		onSubmit: async ({ value }) => {
			await acceptInvitation(value);
		},
	});

	const { mutateAsync: acceptInvitation, isPending } = useMutation({
		mutationKey: ["acceptInvitation", invitationId],
		mutationFn: acceptOrgInvitation,
		onSuccess: (slug) => {
			toast.success("Invitation accepted successfully!");

			navigate({
				to: slug ? "/org/$slug" : "/org/new",
				params: slug ? { slug } : undefined,
			});
		},
		onError: (error) => {
			const message =
				error instanceof Error ? error.message : "Failed to accept invitation";

			toast.error(message);

			form.setFieldMeta("password", (prev) => ({
				...prev,
				errorMap: { onSubmit: message },
			}));
		},
	});

	const formDisabled = isPending || form.state.isSubmitting;

	return (
		<form
			className="space-y-4"
			onSubmit={(e) => {
				e.preventDefault();
				form.handleSubmit();
			}}
		>
			<form.AppField name="name">
				{(field) => (
					<field.Input
						label="Name"
						placeholder="Your full name"
						disabled={formDisabled}
					/>
				)}
			</form.AppField>

			{/* ✅ READONLY, NOT DISABLED */}
			<form.AppField name="email">
				{(field) => (
					<field.Input
						label="Email"
						type="email"
						readOnly
					/>
				)}
			</form.AppField>

			<form.AppField name="password">
				{(field) => (
					<field.Input
						label="Password"
						type="password"
						placeholder="Create a password"
						disabled={formDisabled}
					/>
				)}
			</form.AppField>

			{/* Hidden field still registered */}
			<form.AppField name="invitationId">
				{(field) => <input type="hidden" value={field.state.value} />}
			</form.AppField>

			<Button className="w-full" disabled={formDisabled}>
				{formDisabled ? (
					<>
						<Loader className="h-4 w-4 animate-spin" />
						<span>Accepting...</span>
					</>
				) : (
					"Accept Invite"
				)}
			</Button>
		</form>
	);
}
