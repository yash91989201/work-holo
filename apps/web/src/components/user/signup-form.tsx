import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAppForm } from "@/components/ui/form/hooks";
import { authClient } from "@/lib/auth-client";
import { SignUpFormSchema } from "@/lib/schemas/auth";
import type { SignUpFormType } from "@/lib/types";

export function SignUpForm() {
	const navigate = useNavigate();

	const { mutateAsync: signup, isPending } = useMutation({
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
			// Don't submit if username is unavailable or still checking
			if (isCheckingAvailability || isAvailable === false) {
				return;
			}

			const signupRes = await signup(value);
			if (signupRes.error !== null) {
				toast.error(signupRes.error.message);
				return;
			}

			navigate({
				to: "/org/new",
			});
		},
	});

	// Debounced username availability check
	useEffect(() => {
		let timeoutId: NodeJS.Timeout;

		const checkAvailability = async (usernameValue: string) => {
			if (!usernameValue) {
				setIsCheckingAvailability(false);
				setIsAvailable(null);
				setUsernameError(null);
				return;
			}

			setIsCheckingAvailability(true);
			try {
				const { data: response, error: checkError } =
					await authClient.isUsernameAvailable({
						username: usernameValue,
					});

				if (checkError) {
					setIsAvailable(false);
					setUsernameError("Unable to verify username availability");
				} else {
					setIsAvailable(response?.available ?? false);
					if (response?.available) {
						setUsernameError(null);
					} else {
						setUsernameError("This username is already taken");
					}
				}
			} catch {
				setIsAvailable(false);
				setUsernameError("Unable to verify username availability");
			} finally {
				setIsCheckingAvailability(false);
			}
		};

		const unsubscribe = form.store.subscribe(() => {
			const currentUsername = form.store.state.values.username;
			clearTimeout(timeoutId);

			if (!currentUsername) {
				setIsCheckingAvailability(false);
				setIsAvailable(null);
				setUsernameError(null);
				return;
			}

			timeoutId = setTimeout(() => {
				checkAvailability(currentUsername);
			}, 300);
		});

		return () => {
			unsubscribe();
			clearTimeout(timeoutId);
		};
	});

	return (
		<form className="space-y-4" onSubmit={form.handleSubmit}>
			<form.AppField name="name">
				{(field) => (
					<field.Input label="Name" placeholder="Enter your full name" />
				)}
			</form.AppField>

			<form.AppField name="username">
				{(field) => {
					let borderClass = "";
					if (usernameError && isAvailable === false) {
						borderClass = "border-destructive";
					} else if (isAvailable === true) {
						borderClass = "border-green-600";
					}

					return (
						<div className="space-y-2">
							<label className="font-medium text-sm" htmlFor={field.name}>
								Username
							</label>
							<div className="relative">
								<field.Input
									className={borderClass}
									label="Username"
									onChange={(e) => {
										field.handleChange(e.target.value);
										setUsernameError(null);
										setIsAvailable(null);
									}}
									placeholder="Enter unique username"
								/>
								{isCheckingAvailability && (
									<div className="absolute top-1/2 right-3 -translate-y-1/2">
										<Loader2 className="size-4 animate-spin text-muted-foreground" />
									</div>
								)}
							</div>
							{field.state.meta.errors.length > 0 ? (
								<p className="text-destructive text-xs">
									{String(field.state.meta.errors[0])}
								</p>
							) : null}
							{usernameError && isAvailable === false ? (
								<p className="text-destructive text-xs">{usernameError}</p>
							) : null}
							{isAvailable === true && !usernameError ? (
								<p className="text-green-600 text-xs">Username is available</p>
							) : null}
						</div>
					);
				}}
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
						placeholder="Enter your email"
						type="email"
					/>
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

			<form.AppField name="confirmPassword">
				{(field) => (
					<field.Input
						label="Confirm Password"
						placeholder="Confirm your password"
						type="password"
					/>
				)}
			</form.AppField>

			<Button
				disabled={
					isPending ||
					form.state.isSubmitting ||
					isCheckingAvailability ||
					isAvailable === false
				}
				type="submit"
			>
				{isPending || form.state.isSubmitting ? "Signing up..." : "Sign Up"}
			</Button>
		</form>
	);
}
