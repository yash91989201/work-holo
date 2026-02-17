import { IconLoader2, IconLockFilled, IconLockOpen } from "@tabler/icons-react";
import { formOptions } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { useStore } from "@tanstack/react-store";

import { Image } from "@/components/shared/image";
import { Button } from "@/components/ui/button";
import {
  InputGroupAddon,
  InputGroupButton,
} from "@/components/ui/form/form-input-group";
import { useAppForm } from "@/components/ui/form/hooks";
import { authClient } from "@/lib/auth-client";
import { CreateOrgFormSchema } from "@/lib/schemas/org";
import type { CreateOrgFormType } from "@/lib/types";
import { generateSlug } from "@/utils";
import { uploadOrgLogo } from "@/utils/upload-helper";

export const createOrgFormOpts = formOptions({
  defaultValues: {
    name: "",
    slug: "",
    logo: undefined as string | undefined,
    formState: {
      slugLocked: true,
      logo: undefined as File | undefined,
    },
  } satisfies CreateOrgFormType as CreateOrgFormType,
});

export const CreateOrgForm = () => {
  const navigate = useNavigate();

  const form = useAppForm({
    ...createOrgFormOpts,
    validators: {
      onSubmitAsync: CreateOrgFormSchema,
    },
    onSubmit: async ({ value: { formState, ...formData } }) => {
      try {
        let logo = formData.logo;

        if (formState.logo) {
          const file = formState.logo;
          logo = await uploadOrgLogo(file);
        }

        const { data: org, error } = await authClient.organization.create({
          ...formData,
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
    (state) => state.values.formState?.slugLocked ?? false
  );

  return (
    <form.AppForm>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
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
            onChangeListenTo: ["name"],
            onChangeAsync: async ({ value }) => {
              const result =
                await CreateOrgFormSchema.shape.slug.safeParseAsync(value);

              return result.success
                ? undefined
                : result.error.issues[0]?.message;
            },
          }}
        >
          {(field) => (
            <field.InputGroup
              description="This will be a unique name for your Organization. Only a-z, 0-9 and hypens are allowed."
              label="URL Slug"
            >
              <field.InputGroupInput
                disabled={!!slugLocked}
                placeholder="acme-inc"
              />
              <field.InputGroupSpinner />
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
                  {slugLocked ? (
                    <IconLockFilled size={16} />
                  ) : (
                    <IconLockOpen size={16} />
                  )}
                </InputGroupButton>
              </InputGroupAddon>
            </field.InputGroup>
          )}
        </form.AppField>

        <Button
          className="gap-1.5"
          disabled={form.state.isSubmitting}
          type="submit"
        >
          {form.state.isSubmitting ? (
            <>
              <IconLoader2 className="h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            "Create organization"
          )}
        </Button>
      </form>
    </form.AppForm>
  );
};
