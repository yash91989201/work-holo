import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { withForm } from "@/components/ui/form/hooks";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { authClient } from "@/lib/auth-client";
import { inviteFormOpts } from "./form-options";

export const TeamsDropdown = withForm({
	...inviteFormOpts,
	render({ form }) {
		const { slug } = useParams({
			from: "/(authenticated)/org/$slug",
		});

		const { data: teams } = useSuspenseQuery({
			queryKey: ["teams"],
			queryFn: async () => {
				const { data, error } = await authClient.organization.listTeams();

				if (error !== null) {
					return [];
				}

				return data;
			},
		});

		return (
			<form.AppField name="teamId">
				{(field) => (
					<div className="space-y-2">
						<span className="font-medium text-sm">Team</span>
						{teams.length > 0 ? (
							<>
								<Select
									defaultValue={field.state.value}
									onValueChange={(value) => field.handleChange(value ?? "")}
								>
									<SelectTrigger className="h-11 w-full">
										<SelectValue>
											{field.state.value
												? teams.find((t) => t.id === field.state.value)?.name
												: "Select a team"}
										</SelectValue>
									</SelectTrigger>
									<SelectContent>
										{teams.map((team) => (
											<SelectItem key={team.id} value={team.id}>
												{team.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								{field.state.meta.errors.length > 0 && (
									<p className="font-medium text-destructive text-sm">
										{field.state.meta.errors.join(", ")}
									</p>
								)}
							</>
						) : (
							<div className="space-y-2">
								<div className="flex h-11 w-full items-center justify-center rounded-md border border-input bg-background text-muted-foreground text-sm">
									No teams available
								</div>
								<Button
									className="h-11 w-full"
									render={
										<Link params={{ slug }} to="/org/$slug/dashboard/teams">
											Create Team
										</Link>
									}
									variant="outline"
								/>
							</div>
						)}
					</div>
				)}
			</form.AppField>
		);
	},
});
