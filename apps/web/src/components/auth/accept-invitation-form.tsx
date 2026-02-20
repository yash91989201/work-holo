import { useMutation } from "@tanstack/react-query";
import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { useAppForm } from "@/components/ui/form/hooks";
import { Spinner } from "@/components/ui/spinner";
import { acceptOrgInvitation } from "@/lib/auth/invitation";
import { AcceptInvitationFormSchema } from "@/lib/schemas/auth";
import type { AcceptInvitationFormType } from "@/lib/types";

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
      password: "",
      invitationId,
    } satisfies AcceptInvitationFormType,
    validators: {
      onSubmit: AcceptInvitationFormSchema,
    },
    onSubmit: async ({ value }) => {
      await acceptInvitation(value);
    },
  });

  const { mutateAsync: acceptInvitation, isPending } = useMutation({
    mutationKey: ["acceptInvitation", invitationId],
    mutationFn: acceptOrgInvitation,
    onSuccess: (slug) => {
      toast.success("Invitation accepted successfully!");

      navigate({
        to: slug ? "/org/$slug" : "/org/new",
        params: slug ? { slug } : undefined,
      });
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

          <form.AppField name="password">
            {(field) => (
              <field.Input
                disabled={formDisabled}
                label="Password"
                placeholder="Create a password"
                type="password"
              />
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
