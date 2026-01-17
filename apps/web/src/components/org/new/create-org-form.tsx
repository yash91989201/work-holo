import { useNavigate } from "@tanstack/react-router";
import { useStore } from "@tanstack/react-store";
import { Loader2, Lock, Unlock } from "lucide-react";
import { Image } from "@/components/shared/image";
import { Button } from "@/components/ui/button";
import {
	Field,
	FieldContent,
	FieldDescription,
	FieldLabel,
} from "@/components/ui/field";
import { useAppForm } from "@/components/ui/form/hooks";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import { CreateOrgFormSchema } from "@/lib/schemas/org";
import type { CreateOrgFormType } from "@/lib/types";
import { generateSlug } from "@/utils";
import { uploadOrgLogo } from "@/utils/upload-helper";

export const CreateOrgForm = () => {
	const navigate = useNavigate();

	const form = useAppForm({
		defaultValues: {
			name: "",
			slug: "",
			logo: undefined as string | undefined,
			formState: {
				slugLocked: true,
				logo: undefined as File | undefined,
			},
		} satisfies CreateOrgFormType as CreateOrgFormType,
		validators: {
			onSubmit: CreateOrgFormSchema,
		},
		onSubmit: async ({ value: values }) => {
			try {
				let logo = values.logo;

				if (values.formState.logo) {
					const file = values.formState.logo;
					logo = await uploadOrgLogo(file);
				}

				const { data: org, error } = await authClient.organization.create({
					...values,
					logo,
				});

				if (error !== null) {
					throw new Error(error.message);
				}

				if (org === null) {
					throw new Error("Organization creation failed, please try again.");
				}

				navigate({
					to: "/org/$slug/manage",
					params: {
						slug: org.slug,
					},
				});
			} catch (error) {
				console.error(error);
			}
		},
	});

	const slugLocked = useStore(
		form.store,
		(state) => state.values.formState?.slugLocked
	);

	return (
		<form className="space-y-4" onSubmit={form.handleSubmit}>
			<div className="flex flex-col items-center space-y-4">
				<Image
					alt="Work Holo"
					className="rounded-lg"
					height={120}
					src="/logo.webp"
					width={120}
				/>
			</div>
			<form.AppField name="formState.logo">
				{(field) => (
					<field.FileInput
						accept={{ "image/*": [] }}
						description="Upload your organization logo (max 5MB)"
						label="Organization Logo"
						maxSize={5 * 1024 * 1024}
						selectionMode="single"
					/>
				)}
			</form.AppField>

			<form.AppField
				listeners={{
					onChange: ({ value }) => {
						if (slugLocked) {
							const newSlug = generateSlug(value || "");
							form.setFieldValue("slug", newSlug);
						}
					},
				}}
				name="name"
			>
				{(field) => (
					<field.Input label="Organization Name" placeholder="Acme Inc." />
				)}
			</form.AppField>

			<form.AppField
				asyncDebounceMs={500}
				name="slug"
				validators={{
					onChange: ({ value }) => {
						if (!value) {
							return "Slug is required";
						}
						if (value.length < 4) {
							return "Slug must be at least 4 characters";
						}
						if (value.length > 40) {
							return "Slug must be at most 40 characters";
						}
						if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(value)) {
							return "Only a-z, 0-9 and - are allowed.";
						}
						return undefined;
					},
					onChangeListenTo: ["name"],
					onChangeAsync: async ({ value }) => {
						if (!value || value.length < 4) {
							return undefined;
						}
						try {
							const { data, error } = await authClient.organization.checkSlug({
								slug: value,
							});
							if (error || data?.status !== true) {
								return "This slug is already taken";
							}
							return undefined;
						} catch {
							return "Failed to validate slug availability";
						}
					},
				}}
			>
				{(field) => {
					const isInvalid =
						field.state.meta.isTouched && !field.state.meta.isValid;

					return (
						<Field data-invalid={isInvalid}>
							<FieldContent>
								<FieldLabel htmlFor={field.name}>URL Slug</FieldLabel>
								<FieldDescription>
									This will be a unique name for your Organization. Only a-z,
									0-9 and hypens are allowed.
								</FieldDescription>
							</FieldContent>
							<InputGroup>
								<InputGroupInput
									aria-invalid={isInvalid}
									disabled={!!slugLocked}
									id={field.name}
									name={field.name}
									onBlur={field.handleBlur}
									onChange={(e) => {
										field.handleChange(e.target.value);
									}}
									placeholder="acme-inc"
									value={field.state.value}
								/>
								{field.state.meta.isValidating ? (
									<InputGroupAddon align="inline-end">
										<Spinner />
									</InputGroupAddon>
								) : null}
								<InputGroupAddon align="inline-end">
									<InputGroupButton
										aria-label={slugLocked ? "Unlock slug" : "Lock slug"}
										onClick={() => {
											const nextLocked = !slugLocked;
											form.setFieldValue("formState.slugLocked", nextLocked);
										}}
										size="icon-xs"
										title={slugLocked ? "Unlock slug" : "Lock slug"}
									>
										{slugLocked ? <Lock size={16} /> : <Unlock size={16} />}
									</InputGroupButton>
								</InputGroupAddon>
							</InputGroup>
							{field.state.meta.errors.length > 0 && (
								<p className="text-destructive text-sm" role="alert">
									{field.state.meta.errors.join(", ")}
								</p>
							)}
						</Field>
					);
				}}
			</form.AppField>

			<Button
				className="gap-1.5"
				disabled={form.state.isSubmitting}
				type="submit"
			>
				{form.state.isSubmitting ? (
					<>
						<Loader2 className="h-4 w-4 animate-spin" />
						Creating...
					</>
				) : (
					"Create organization"
				)}
			</Button>
		</form>
	);
};
