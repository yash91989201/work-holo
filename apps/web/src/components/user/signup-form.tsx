import { useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAppForm } from "@/components/ui/form/hooks";
import { authClient } from "@/lib/auth-client";
import { SignUpFormSchema } from "@/lib/schemas/auth";
import type { SignUpFormType } from "@/lib/types";

export function SignUpForm() {
	const navigate = useNavigate();

	const { mutateAsync: signup } = useMutation({
		mutationKey: ["signup"],
		mutationFn: async (values: SignUpFormType) =>
			await authClient.signUp.email(values),
	});


	const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
	const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
	const [usernameError, setUsernameError] = useState<string | null>(null);

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

			if (isCheckingAvailability || isAvailable === false) {
				return;
			}

			try {
				const signupRes = await signup(value);
				if (signupRes.error) {
					throw new Error(signupRes.error.message);
				}

				navigate({ to: "/org/new" });
			} catch (err) {
				toast.error(
					err instanceof Error ? err.message : "Signup failed"
				);
			}
		},
	});


	useEffect(() => {
		let timeoutId: NodeJS.Timeout;

		const checkAvailability = async (usernameValue: string) => {
			if (!usernameValue) {
				setIsAvailable(null);
				setUsernameError(null);
				setIsCheckingAvailability(false);
				return;
			}

			setIsCheckingAvailability(true);
			try {
				const { data, error } =
					await authClient.isUsernameAvailable({
						username: usernameValue,
					});

				if (error) {
					setIsAvailable(false);
					setUsernameError("Unable to verify username availability");
				} else {
					setIsAvailable(data?.available ?? false);
					setUsernameError(
						data?.available ? null : "This username is already taken"
					);
				}
			} catch {
				setIsAvailable(false);
				setUsernameError("Unable to verify username availability");
			} finally {
				setIsCheckingAvailability(false);
			}
		};

		const unsubscribe = form.store.subscribe(() => {
			const username = form.store.state.values.username;
			clearTimeout(timeoutId);

			if (!username) {
				setIsAvailable(null);
				setUsernameError(null);
				setIsCheckingAvailability(false);
				return;
			}

			timeoutId = setTimeout(() => {
				checkAvailability(username);
			}, 300);
		});

		return () => {
			unsubscribe();
			clearTimeout(timeoutId);
		};
	}, [form.store]);

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
				name="username"
				asyncDebounceMs={400}
				validators={{
					onChange: ({ value }) => {
						if (!value) return "Username is required";
						if (value.length < 4) return "Minimum 4 characters";
						if (value.length > 40) return "Maximum 40 characters";
						if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(value)) {
							return "Only lowercase letters, numbers and - allowed";
						}
					},
					onChangeAsync: async ({ value }) => {
						if (!value || value.length < 4) return;

						try {
							const { data, error } =
								await authClient.isUsernameAvailable({
									username: value,
								});

							if (error || !data?.available) {
								return "Username already taken";
							}
						} catch {
							return "Failed to check username availability";
						}
					},
				}}
			>
				{(field) => (
					<div className="space-y-1">
						<field.Input
							label="Username"
							placeholder="Enter unique_username"
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
				)}
			</form.AppField>

			<form.AppField name="displayUsername">
				{(field) => (
					<field.Input
						label="Display Username"
						placeholder="Enter display username"
					/>
				)}
			</form.AppField>

			<form.AppField name="email">
				{(field) => (
					<field.Input
						label="Email"
						type="email"
						placeholder="Enter email address"
					/>
				)}
			</form.AppField>

			<form.AppField name="password">
				{(field) => (
					<field.Input label="Password" type="password" />
				)}
			</form.AppField>

			<form.AppField name="confirmPassword">
				{(field) => (
					<field.Input label="Confirm Password" type="password" />
				)}
			</form.AppField>

			<Button
				type="submit"
				className="w-full gap-1.5"
				disabled={
					form.state.isSubmitting ||
					isCheckingAvailability ||
					isAvailable === false
				}
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
