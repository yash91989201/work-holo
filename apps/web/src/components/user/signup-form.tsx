import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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

  const form = useForm<SignUpFormType>({
    resolver: standardSchemaResolver(SignUpFormSchema),
    defaultValues: {
      name: "",
      username: "",
      displayUsername: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const username = form.watch("username");

  // Debounced username availability check
  useEffect(() => {
    // Skip checking if username is empty
    if (!username) {
      setIsCheckingAvailability(false);
      setIsAvailable(null);
      setUsernameError(null);
      return;
    }

    // Debounce the availability check
    setIsCheckingAvailability(true);
    const timeoutId = setTimeout(async () => {
      try {
        const { data: response, error: checkError } =
          await authClient.isUsernameAvailable({
            username,
          });

        if (checkError) {
          setIsAvailable(false);
          setUsernameError("Unable to verify username availability");
        } else {
          setIsAvailable(response?.available ?? false);
          if (!response?.available) {
            setUsernameError("This username is already taken");
          }
        }
      } catch {
        setIsAvailable(false);
        setUsernameError("Unable to verify username availability");
      } finally {
        setIsCheckingAvailability(false);
      }
    }, 300);

    return () => {
      clearTimeout(timeoutId);
      setIsCheckingAvailability(false);
    };
  }, [username]);

  const onSubmit: SubmitHandler<SignUpFormType> = async (values) => {
    // Don't submit if username is unavailable or still checking
    if (isCheckingAvailability || isAvailable === false) {
      return;
    }

    const signupRes = await signup(values);
    if (signupRes.error !== null) {
      toast.error(signupRes.error.message);
      return;
    }

    navigate({
      to: "/org/new",
    });
  };

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your full name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    placeholder="Enter unique username"
                    {...field}
                    className={
                      usernameError && isAvailable === false
                        ? "border-destructive"
                        : isAvailable === true
                          ? "border-green-600"
                          : ""
                    }
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      setUsernameError(null);
                      setIsAvailable(null);
                    }}
                  />
                  {isCheckingAvailability && (
                    <div className="-translate-y-1/2 absolute top-1/2 right-3">
                      <Loader2 className="size-4 animate-spin text-muted-foreground" />
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage />
              {usernameError && isAvailable === false && (
                <p className="text-destructive text-xs">{usernameError}</p>
              )}
              {isAvailable === true && !usernameError && (
                <p className="text-green-600 text-xs">Username is available</p>
              )}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="displayUsername"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Display Username</FormLabel>
              <FormControl>
                <Input placeholder="Enter display username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter your email" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your password"
                  type="password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input
                  placeholder="Confirm your password"
                  type="password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          disabled={
            isPending ||
            form.formState.isSubmitting ||
            isCheckingAvailability ||
            isAvailable === false
          }
        >
          {isPending || form.formState.isSubmitting
            ? "Signing up..."
            : "Sign Up"}
        </Button>
      </form>
    </Form>
  );
}
