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

	const { id: invitationId } = useParams({
		from: "/(auth)/accept-invitation/$id",
	});

	const { email } = useSearch({
		from: "/(auth)/accept-invitation/$id",
	});

	const { mutateAsync: acceptInvitation, isPending } = useMutation({
		mutationKey: ["acceptInvitation", invitationId],
		mutationFn: (formValues: AcceptInvitationFormType) =>
			acceptOrgInvitation({ ...formValues, invitationId }),
		onSuccess: (slug) => {
			toast.success("Invitation accepted successfully!");

			if (slug) {
				navigate({
					to: "/org/$slug",
					params: { slug },
				});
				return;
			}

			navigate({
				to: "/org/new",
			});
		},
		onError: (error) => {
			const message =
				error instanceof Error ? error.message : "Failed to accept invitation";

			form.setFieldMeta("password", (prev) => ({
				...prev,
				errorMap: {
					onSubmit: message,
				},
			}));
			toast.error(message);
		},
	});

	const form = useAppForm({
		defaultValues: {
			email,
			name: "",
			password: "",
			invitationId,
		} satisfies AcceptInvitationFormType as AcceptInvitationFormType,
		validators: {
			onSubmit: AcceptInvitationFormSchema,
		},
		onSubmit: async ({ value }) => {
			await acceptInvitation({ ...value, invitationId });
		},
	});

	const formDisabled = isPending || form.state.isSubmitting;

	return (
		<form className="space-y-4" onSubmit={form.handleSubmit}>
			<form.AppField name="name">
				{(field) => (
					<field.Input
						autoComplete="name"
						disabled={formDisabled}
						label="Name"
						placeholder="Your full name"
					/>
				)}
			</form.AppField>

			<form.AppField name="email">
				{(field) => (
					<field.Input disabled label="Email" readOnly type="email" />
				)}
			</form.AppField>

			<form.AppField name="password">
				{(field) => (
					<field.Input
						autoComplete="new-password"
						disabled={formDisabled}
						label="Password"
						placeholder="Create a password"
						type="password"
					/>
				)}
			</form.AppField>

			<form.AppField name="invitationId">
				{(field) => <input hidden type="hidden" value={field.state.value} />}
			</form.AppField>

			<Button className="w-full" disabled={formDisabled}>
				{form.state.isSubmitting ? (
					<>
						<Loader className="h-4 w-4 animate-spin" />
						<span>Accepting...</span>
					</>
				) : (
					<span>Accept Invite</span>
				)}
			</Button>
		</form>
	);
}
