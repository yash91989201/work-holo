import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useAppForm } from "@/components/ui/form/hooks";
import { authClient } from "@/lib/auth-client";
import { LogInFormSchema } from "@/lib/schemas/auth";
import type { LogInFormType } from "@/lib/types";

export function LogInForm() {
	const navigate = useNavigate();

	const { mutateAsync: login, isPending } = useMutation({
		mutationKey: ["login"],
		mutationFn: async (values: LogInFormType) =>
			await authClient.signIn.email(values),
	});

	const form = useAppForm({
		defaultValues: {
			email: "",
			password: "",
		} satisfies LogInFormType as LogInFormType,
		validators: {
			onSubmit: LogInFormSchema,
		},
		onSubmit: async ({ value }) => {
			try {
				const loginResult = await login(value);

				if (loginResult.error) {
					throw new Error(loginResult.error.message);
				}

				const { data: orgs, error: orgListError } =
					await authClient.organization.list();

				if (orgListError !== null) {
					throw new Error(orgListError.message);
				}

				const org = orgs[0];

				await authClient.organization.setActive({
					organizationId: org.id,
					organizationSlug: org.slug,
				});

				if (org) {
					navigate({
						to: "/org/$slug/attendance",
						params: {
							slug: org.slug,
						},
					});
					return;
				}

				navigate({
					to: "/org/new",
				});
			} catch (error) {
				form.setFieldMeta("email", (prev) => ({
					...prev,
					errorMap: {
						onSubmit: error instanceof Error ? error.message : "Login failed",
					},
				}));
			}
		},
	});

	return (
		<form className="space-y-4" onSubmit={form.handleSubmit}>
			<form.AppField name="email">
				{(field) => (
					<field.Input label="Email" placeholder="Enter your email" />
				)}
			</form.AppField>
			<form.AppField name="password">
				{(field) => (
					<field.Input
						label="Password"
						placeholder="Enter your password"
						type="password"
					/>
				)}
			</form.AppField>
			<Button disabled={isPending || form.state.isSubmitting}>
				{isPending || form.state.isSubmitting ? "Logging in..." : "Log In"}
			</Button>
		</form>
	);
}
