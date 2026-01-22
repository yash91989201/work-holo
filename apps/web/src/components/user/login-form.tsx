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
		mutationFn: async (values: LogInFormType) => {
			return authClient.signIn.email(values);
		},
	});

	const form = useAppForm({
		defaultValues: {
			email: "",
			password: "",
		},
		validators: {
			onSubmit: LogInFormSchema,
		},
		onSubmit: async ({ value }) => {
			try {
				const loginResult = await login(value);

				if (loginResult?.error) {
					throw new Error(loginResult.error.message);
				}

				const { data: orgs, error } =
					await authClient.organization.list();

				if (error) {
					throw new Error(error.message);
				}

				// If user has an org
				if (orgs && orgs.length > 0) {
					const org = orgs[0];

					await authClient.organization.setActive({
						organizationId: org.id,
						organizationSlug: org.slug,
					});

					navigate({
						to: "/org/$slug/attendance",
						params: { slug: org.slug },
					});
					return;
				}

				// If no org exists
				navigate({ to: "/org/new" });
			} catch (err) {
				form.setFieldMeta("email", (prev) => ({
					...prev,
					errorMap: {
						onSubmit:
							err instanceof Error ? err.message : "Login failed",
					},
				}));
			}
		},
	});

	return (
		<form
			className="space-y-4"
			onSubmit={(e) => {
				e.preventDefault(); // 🔐 PREVENT URL LEAK
				form.handleSubmit();
			}}
		>
			<form.AppField name="email">
				{(field) => (
					<field.Input
						label="Email"
						placeholder="Enter your email"
						type="email"
					/>
				)}
			</form.AppField>

			<form.AppField name="password">
				{(field) => (
					<field.Input
						label="Password"
						type="password"
						placeholder="Enter your password"
					/>
				)}
			</form.AppField>

			<Button
				type="submit"
				disabled={isPending || form.state.isSubmitting}
				className="w-full"
			>
				{isPending || form.state.isSubmitting
					? "Logging in..."
					: "Log In"}
			</Button>
		</form>
	);
}
