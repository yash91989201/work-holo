import { useMutation } from "@tanstack/react-query";
import { useStore } from "@tanstack/react-store";
import { Loader, Plus } from "lucide-react";
import { Suspense, useState } from "react";
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
import { SelectItem } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuthedSession } from "@/hooks/use-authed-session";
import { CreateChannelFormSchema } from "@/lib/schemas/memeber/channel";
import { queryClient, queryUtils } from "@/utils/orpc";
import { channelFormOpts } from "./form-options";
import { MembersSelect, MembersSelectSkeleton } from "./members-select";
import { TeamSelect, TeamSelectSkeleton } from "./team-select";

export const CreateChannelForm = () => {
	const [dialogOpen, setDialogOpen] = useState(false);

	const { user } = useAuthedSession();

	const { mutateAsync: createChannel } = useMutation(
		queryUtils.communication.channel.create.mutationOptions({
			onSuccess: () => {
				queryClient.refetchQueries({
					queryKey: queryUtils.communication.channel.list.queryKey({
						input: {},
					}),
				});

				toast.success("Channel created successfully");
				form.reset();
			},
			onError: (error) => {
				toast.message("Failed to create channel", {
					description:
						error instanceof Error ? error.message : "Unknown error occurred",
				});
			},
		})
	);

	const form = useAppForm({
		...channelFormOpts,
		defaultValues: {
			...channelFormOpts.defaultValues,
			createdBy: user.id,
		},
		validators: {
			onSubmit: (value) => CreateChannelFormSchema.parse(value),
		},
		onSubmit: async ({ value: formData }) => {
			await createChannel(formData);
			setDialogOpen(false);
		},
	});

	const channelType = useStore(form.store, (state) => state.values.type);

	const onReset = () => {
		form.reset({
			...channelFormOpts.defaultValues,
			createdBy: user.id,
		});
	};

	return (
		<Dialog onOpenChange={setDialogOpen} open={dialogOpen}>
			<DialogTrigger asChild>
				<Button>
					<Plus />
					<span>New channel</span>
				</Button>
			</DialogTrigger>

			<DialogContent className="sm:max-w-106">
				<DialogHeader>
					<DialogTitle>Create New Channel</DialogTitle>
					<DialogDescription>
						Create a new channel for your team to communicate and collaborate.
					</DialogDescription>
				</DialogHeader>
				<form.AppForm>
					<form
						className="space-y-4"
						onReset={onReset}
						onSubmit={form.handleSubmit}
					>
						<form.AppField name="name">
							{(field) => (
								<field.Input
									label="Channel Name"
									placeholder="Enter channel name"
								/>
							)}
						</form.AppField>

						<form.AppField name="description">
							{(field) => (
								<div className="space-y-2">
									<span className="font-medium text-sm">Description</span>
									<Textarea
										className="resize-none"
										onChange={(e) =>
											field.handleChange(e.target.value || undefined)
										}
										placeholder="Enter channel description"
										rows={3}
										value={field.state.value ?? ""}
									/>
									{field.state.meta.errors.length > 0 && (
										<p className="text-destructive text-xs">
											{field.state.meta.errors[0]}
										</p>
									)}
								</div>
							)}
						</form.AppField>

						<form.AppField name="type">
							{(field) => (
								<field.Select label="Channel Type">
									<SelectItem value="team">Team</SelectItem>
									<SelectItem value="group">Group</SelectItem>
								</field.Select>
							)}
						</form.AppField>

						{channelType === "team" ? (
							<Suspense fallback={<TeamSelectSkeleton />}>
								<TeamSelect form={form} />
							</Suspense>
						) : (
							<Suspense fallback={<MembersSelectSkeleton />}>
								<MembersSelect form={form} />
							</Suspense>
						)}

						<DialogFooter className="flex-row">
							<Button type="reset" variant="outline">
								Reset
							</Button>
							<Button disabled={form.state.isSubmitting}>
								{form.state.isSubmitting ? (
									<>
										<Loader className="mr-1.5 animate-spin" />
										<span>Creating ...</span>
									</>
								) : (
									<span>Create Channel</span>
								)}
							</Button>
						</DialogFooter>
					</form>
				</form.AppForm>
			</DialogContent>
		</Dialog>
	);
};
