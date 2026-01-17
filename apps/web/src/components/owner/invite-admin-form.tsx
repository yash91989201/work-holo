import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { useAppForm } from "@/components/ui/form/hooks";
import { useAuthedSession } from "@/hooks/use-authed-session";
import { getAuthQueryKey } from "@/lib/auth/query-keys";
import { authClient } from "@/lib/auth-client";
import { InviteAdminFormSchema } from "@/lib/schemas/owner";
import type { InviteAdminFormType } from "@/lib/types";
import { queryClient } from "@/utils/orpc";

export const InviteAdminForm = () => {
	const [open, onOpenChange] = useState(false);
	const { session } = useAuthedSession();
	const orgId = session.activeOrganizationId ?? "";

	const form = useAppForm({
		defaultValues: {
			email: "",
		} satisfies InviteAdminFormType as InviteAdminFormType,
		validators: {
			onSubmit: InviteAdminFormSchema,
		},
		onSubmit: async ({ value: formData }) => {
			try {
				const { data: _, error } = await authClient.organization.inviteMember({
					email: formData.email,
					role: "admin",
				});

				if (error != null) {
					throw new Error(error.message);
				}

				queryClient.invalidateQueries({
					queryKey: getAuthQueryKey.organization.invitations(orgId),
				});

				toast.success("Admin invitation sent successfully");
				form.reset();
				onOpenChange(false);
			} catch (error) {
				toast.error(
					error instanceof Error ? error.message : "Something went wrong"
				);
			}
		},
	});

	return (
		<Dialog onOpenChange={onOpenChange} open={open}>
			<DialogTrigger render={<Button>Invite Admin</Button>} />
			<DialogContent className="sm:max-w-105">
				<DialogHeader>
					<DialogTitle>Invite Admin</DialogTitle>
					<DialogDescription>
						Send an invitation to a new admin member
					</DialogDescription>
				</DialogHeader>
				<form className="space-y-4" onSubmit={form.handleSubmit}>
					<form.AppField name="email">
						{(field) => (
							<field.Input
								label="Email"
								placeholder="admin@example.com"
								type="email"
							/>
						)}
					</form.AppField>
					<DialogFooter>
						<Button
							onClick={() => onOpenChange(false)}
							type="button"
							variant="outline"
						>
							Cancel
						</Button>
						<Button disabled={form.state.isSubmitting} type="submit">
							{form.state.isSubmitting ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Sending Invitation...
								</>
							) : (
								<span>Send Invitation</span>
							)}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};
