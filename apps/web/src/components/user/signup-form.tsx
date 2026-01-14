import { useStore } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAppForm } from "@/components/ui/form/hooks";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { SignUpFormSchema } from "@/lib/schemas/auth";
import type { SignUpFormType } from "@/lib/types";

export function SignUpForm() {
  const navigate = useNavigate();

  const { mutateAsync: signup, isPending } = useMutation({
    mutationKey: ["signup"],
    mutationFn: (values: SignUpFormType) => authClient.signUp.email(values),
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
    } satisfies SignUpFormType,
    validators: {
      onSubmit: SignUpFormSchema,
    },
    onSubmit: async ({ value }) => {
      if (isCheckingAvailability || isAvailable === false) return;

      const res = await signup(value);

      if (res.error) {
        toast.error(res.error.message);
        return;
      }

      navigate({ to: "/org/new" });
    },
  });

  const username = useStore(form.store, (state) => state.values.username);

  useEffect(() => {
    if (!username) {
      setIsAvailable(null);
      setUsernameError(null);
      setIsCheckingAvailability(false);
      return;
    }

    setIsCheckingAvailability(true);

    const timeout = setTimeout(async () => {
      try {
        const { data, error } = await authClient.isUsernameAvailable({
          username,
        });

        if (error || !data) {
          setIsAvailable(false);
          setUsernameError("Unable to verify username");
        } else {
          setIsAvailable(data.available);
          setUsernameError(
            data.available ? null : "This username is already taken"
          );
        }
      } catch {
        setIsAvailable(false);
        setUsernameError("Unable to verify username");
      } finally {
        setIsCheckingAvailability(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [username]);

  const getId = (name: string) => `signup-${name}`;

  const getFieldError = (field: any) => {
    const error = field.state.meta.errors?.[0];
    return error ? String(error.message ?? error) : null;
  };

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      {/* Name */}
      <form.Field name="name">
        {(field) => {
          const id = getId(field.name);
          const errorMessage = getFieldError(field);

          return (
            <div>
              <label className="font-medium text-sm" htmlFor={id}>
                Name
              </label>
              <Input
                id={id}
                onChange={(e) => field.handleChange(e.target.value)}
                value={field.state.value}
              />
              {errorMessage && (
                <p className="text-destructive text-xs">{errorMessage}</p>
              )}
            </div>
          );
        }}
      </form.Field>

      {/* Username */}
      <form.Field name="username">
        {(field) => {
          const id = getId(field.name);
          const errorMessage = getFieldError(field);

          return (
            <div>
              <label className="font-medium text-sm" htmlFor={id}>
                Username
              </label>
              <div className="relative">
                <Input
                  className={
                    isAvailable === false
                      ? "border-destructive"
                      : isAvailable === true
                        ? "border-green-600"
                        : ""
                  }
                  id={id}
                  onChange={(e) => {
                    field.handleChange(e.target.value);
                    setIsAvailable(null);
                    setUsernameError(null);
                  }}
                  placeholder="Enter unique username"
                  value={field.state.value}
                />
                {isCheckingAvailability && (
                  <Loader2 className="absolute top-1/2 right-3 size-4 -translate-y-1/2 animate-spin text-muted-foreground" />
                )}
              </div>

              {usernameError && (
                <p className="text-destructive text-xs">{usernameError}</p>
              )}
              {isAvailable === true && !usernameError && (
                <p className="text-green-600 text-xs">Username is available</p>
              )}

              {errorMessage && (
                <p className="text-destructive text-xs">{errorMessage}</p>
              )}
            </div>
          );
        }}
      </form.Field>

      {/* Display Username */}
      <form.Field name="displayUsername">
        {(field) => {
          const id = getId(field.name);
          const errorMessage = getFieldError(field);

          return (
            <div>
              <label className="font-medium text-sm" htmlFor={id}>
                Display Username
              </label>
              <Input
                id={id}
                onChange={(e) => field.handleChange(e.target.value)}
                value={field.state.value}
              />
              {errorMessage && (
                <p className="text-destructive text-xs">{errorMessage}</p>
              )}
            </div>
          );
        }}
      </form.Field>

      {/* Email */}
      <form.Field name="email">
        {(field) => {
          const id = getId(field.name);
          const errorMessage = getFieldError(field);

          return (
            <div>
              <label className="font-medium text-sm" htmlFor={id}>
                Email
              </label>
              <Input
                id={id}
                onChange={(e) => field.handleChange(e.target.value)}
                type="email"
                value={field.state.value}
              />
              {errorMessage && (
                <p className="text-destructive text-xs">{errorMessage}</p>
              )}
            </div>
          );
        }}
      </form.Field>

      {/* Password */}
      <form.Field name="password">
        {(field) => {
          const id = getId(field.name);
          const errorMessage = getFieldError(field);

          return (
            <div>
              <label className="font-medium text-sm" htmlFor={id}>
                Password
              </label>
              <Input
                id={id}
                onChange={(e) => field.handleChange(e.target.value)}
                type="password"
                value={field.state.value}
              />
              {errorMessage && (
                <p className="text-destructive text-xs">{errorMessage}</p>
              )}
            </div>
          );
        }}
      </form.Field>

      {/* Confirm Password */}
      <form.Field name="confirmPassword">
        {(field) => {
          const id = getId(field.name);
          const errorMessage = getFieldError(field);

          return (
            <div>
              <label className="font-medium text-sm" htmlFor={id}>
                Confirm Password
              </label>
              <Input
                id={id}
                onChange={(e) => field.handleChange(e.target.value)}
                type="password"
                value={field.state.value}
              />
              {errorMessage && (
                <p className="text-destructive text-xs">{errorMessage}</p>
              )}
            </div>
          );
        }}
      </form.Field>

      {/* Submit */}
      <Button
        className="w-full"
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
