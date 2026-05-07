import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import { Button } from "@work-holo/ui/components/button";
import { FieldGroup } from "@work-holo/ui/components/field";
import { useAppForm } from "@work-holo/ui/components/form/hooks";
import {
  InputGroupAddon,
  InputGroupButton,
} from "@work-holo/ui/components/input-group";
import { Spinner } from "@work-holo/ui/components/spinner";
import { toast } from "sonner";
import { acceptOrgInvitation } from "@/lib/auth/invitation";
import { authClient } from "@/lib/auth-client";
import { AcceptInvitationFormSchema } from "@/lib/schemas/auth";
import type { AcceptInvitationFormType } from "@/lib/types";
import { getOrgRouteByRole } from "@/utils";

type AcceptInvitationFormValues = AcceptInvitationFormType;

export function AcceptInvitationForm() {
  const navigate = useNavigate();

  const params = useParams({
    from: "/(auth)/accept-invitation/$id",
  });

  const search = useSearch({
    from: "/(auth)/accept-invitation/$id",
  });

  const invitationId = params.id ?? "";
  const email = search.email ?? "";

  const form = useAppForm({
    defaultValues: {
      email,
      name: "",
      username: "",
      password: "",
      invitationId,
      formState: { showPassword: false },
    } satisfies AcceptInvitationFormValues as AcceptInvitationFormValues,
    validators: {
      onSubmitAsync: AcceptInvitationFormSchema,
    },
    onSubmit: async ({ value }) => {
      await acceptInvitation(value);
    },
  });

  const { mutateAsync: acceptInvitation, isPending } = useMutation({
    mutationKey: ["acceptInvitation", invitationId],
    mutationFn: acceptOrgInvitation,
    onSuccess: async (slug) => {
      toast.success("Invitation accepted successfully!");

      if (slug) {
        const { data: memberData } =
          await authClient.organization.getActiveMemberRole();

        navigate(getOrgRouteByRole(memberData?.role ?? "member", slug));
      } else {
        navigate({ to: "/org/new" });
      }
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : "Failed to accept invitation";

      toast.error(message);

      form.setFieldMeta("password", (prev) => ({
        ...prev,
        errorMap: { onSubmit: message },
      }));
    },
  });

  const formDisabled = isPending || form.state.isSubmitting;

  return (
    <form.AppForm>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <FieldGroup>
          <form.AppField name="name">
            {(field) => (
              <field.Input
                disabled={formDisabled}
                label="Name"
                placeholder="Your full name"
              />
            )}
          </form.AppField>

          <form.AppField
            name="username"
            validators={{
              onChangeAsyncDebounceMs: 500,
              onChangeAsync: async ({ value }) => {
                const result =
                  await AcceptInvitationFormSchema.shape.username.safeParseAsync(
                    value
                  );

                return result.success
                  ? undefined
                  : result.error.issues[0]?.message;
              },
            }}
          >
            {(field) => (
              <field.InputGroup label="Username">
                <field.InputGroupInput
                  disabled={formDisabled}
                  placeholder="Enter unique username"
                />
                <field.InputGroupSpinner />
              </field.InputGroup>
            )}
          </form.AppField>

          <form.AppField name="formState.showPassword">
            {(showPasswordField) => (
              <form.AppField name="password">
                {(field) => (
                  <field.InputGroup label="Password">
                    <field.InputGroupInput
                      disabled={formDisabled}
                      placeholder="Create a password"
                      type={showPasswordField.state.value ? "text" : "password"}
                    />
                    <InputGroupAddon align="inline-end">
                      <InputGroupButton
                        aria-label={
                          showPasswordField.state.value
                            ? "Hide password"
                            : "Show password"
                        }
                        disabled={formDisabled}
                        onClick={() =>
                          showPasswordField.handleChange(
                            !showPasswordField.state.value
                          )
                        }
                      >
                        {showPasswordField.state.value ? (
                          <IconEyeOff className="size-4" />
                        ) : (
                          <IconEye className="size-4" />
                        )}
                      </InputGroupButton>
                    </InputGroupAddon>
                  </field.InputGroup>
                )}
              </form.AppField>
            )}
          </form.AppField>
        </FieldGroup>

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
        >
          {([canSubmit, isSubmitting]) => (
            <Button
              className="w-full"
              disabled={!canSubmit || isSubmitting}
              type="submit"
            >
              {isSubmitting ? (
                <>
                  <Spinner />
                  <span>Accepting...</span>
                </>
              ) : (
                "Accept Invite"
              )}
            </Button>
          )}
        </form.Subscribe>
      </form>
    </form.AppForm>
  );
}
