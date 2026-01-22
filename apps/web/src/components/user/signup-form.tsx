import { useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useAppForm } from "@/components/ui/form/hooks";
import { authClient } from "@/lib/auth-client";
import { SignUpFormSchema } from "@/lib/schemas/auth";
import type { SignUpFormType } from "@/lib/types";

export function SignUpForm() {
	const navigate = useNavigate();

	const form = useAppForm({
		defaultValues: {
			name: "",
			username: "",
			displayUsername: "",
			email: "",
			password: "",
			confirmPassword: "",
		} satisfies SignUpFormType as SignUpFormType,

		validators: {
			onSubmit: SignUpFormSchema,
		},

		onSubmit: async ({ value }) => {
			try {
				/* 1️⃣ Signup */
				const signupRes = await authClient.signUp.email(value);
				if (signupRes.error) {
					throw new Error(signupRes.error.message);
				}

				/* 2️⃣ Create org */
				const { data: org, error } =
					await authClient.organization.create({
						name: `${value.name}'s Organization`,
						slug: value.username,
					});

				if (error || !org) {
					throw new Error("Failed to create organization");
				}

				/* 3️⃣ Set active org */
				await authClient.organization.setActive({
					organizationId: org.id,
					organizationSlug: org.slug,
				});

				/* 4️⃣ Navigate */
				navigate({
					to: "/org/$slug/manage",
					params: { slug: org.slug },
				});
			} catch (err) {
				toast.error(
					err instanceof Error ? err.message : "Signup failed"
				);
			}
		},
	});

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
					<field.Input label="Name" placeholder="Full name" />
				)}
			</form.AppField>


			<form.AppField
				asyncDebounceMs={400}
				name="username"
				validators={{
					onChange: ({ value }) => {
						if (!value) return "Username is required";
						if (value.length < 4) return "Minimum 4 characters";
						if (value.length > 40) return "Maximum 40 characters";
						if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(value)) {
							return "Only lowercase letters, numbers and - allowed";
						}
						return undefined;
					},
					onChangeAsync: async ({ value }) => {
						if (!value || value.length < 4) return undefined;

						try {
							const { data, error } =
								await authClient.isUsernameAvailable({ username: value });

							if (error || data?.available !== true) {
								return "Username already taken";
							}
							return undefined;
						} catch {
							return "Failed to check username availability";
						}
					},
				}}
			>
				{(field) => {
					const invalid =
						field.state.meta.isTouched && !field.state.meta.isValid;

					return (
						<div className="space-y-1">
							<field.Input
								label="Username"
								aria-invalid={invalid}
								placeholder="unique_username"
							/>

							{field.state.meta.isValidating && (
								<p className="text-xs flex items-center gap-1">
									<Loader2 className="size-3 animate-spin" />
									Checking availability
								</p>
							)}

							{field.state.meta.errors.length > 0 && (
								<p className="text-xs text-destructive">
									{field.state.meta.errors.join(", ")}
								</p>
							)}
						</div>
					);
				}}
			</form.AppField>

			<form.AppField name="displayUsername">
				{(field) => (
					<field.Input
						label="Display Username"
						placeholder="Public name"
					/>
				)}
			</form.AppField>

			<form.AppField name="email">
				{(field) => (
					<field.Input
						label="Email"
						type="email"
						placeholder="Email address"
					/>
				)}
			</form.AppField>

			<form.AppField name="password">
				{(field) => (
					<field.Input
						label="Password"
						type="password"
					/>
				)}
			</form.AppField>

			<form.AppField name="confirmPassword">
				{(field) => (
					<field.Input
						label="Confirm Password"
						type="password"
					/>
				)}
			</form.AppField>

			<Button
				type="submit"
				className="w-full gap-1.5"
				disabled={form.state.isSubmitting}
			>
				{form.state.isSubmitting ? (
					<>
						<Loader2 className="h-4 w-4 animate-spin" />
						Creating account…
					</>
				) : (
					"Create Account"
				)}
			</Button>
		</form>
	);
}
