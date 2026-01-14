import { useMutation } from "@tanstack/react-query";
import { Card, useThemeColor } from "heroui-native";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import type { z } from "zod";
import { useAppForm } from "@/components/ui/form/hooks"; // path check
import { authClient } from "@/lib/auth-client";
import { SignInSchema } from "@/lib/schemas/auth";
import { queryClient } from "@/utils/orpc";

type SignInForm = z.infer<typeof SignInSchema>;
type SignInError = { error?: { message?: string } } | unknown;

export function SignIn() {
  const [error, setError] = useState<string | null>(null);

  const mutedColor = useThemeColor("muted");
  const foregroundColor = useThemeColor("foreground");
  const accentColor = useThemeColor("accent");
  const dangerColor = useThemeColor("danger");

  // ---------------- Mutation ----------------
  const signInMutation = useMutation({
    mutationKey: ["signin"],
    mutationFn: (values: SignInForm) => authClient.signIn.email(values),
    onError: (err: SignInError) => {
      if (typeof err === "object" && err !== null && "error" in err) {
        setError((err as any).error?.message ?? "Failed to sign in");
      } else {
        setError("Failed to sign in");
      }
    },
    onSuccess: () => {
      form.reset();
      queryClient.refetchQueries();
      setError(null);
    },
  });

  // ---------------- App Form ----------------
  const form = useAppForm({
    defaultValues: { email: "", password: "" },
    validators: SignInSchema,
    onSubmit: async (values: SignInForm) => {
      await signInMutation.mutateAsync(values);
    },
  });

  return (
    <Card style={{ marginTop: 24, padding: 16 }} variant="secondary">
      <Card.Title style={{ marginBottom: 16 }}>Sign In</Card.Title>

      {error && (
        <View
          style={{
            marginBottom: 16,
            padding: 12,
            borderRadius: 8,
            backgroundColor: `${dangerColor}20`,
          }}
        >
          <Text style={{ color: dangerColor, fontSize: 14 }}>{error}</Text>
        </View>
      )}

      <TextInput
        autoCapitalize="none"
        keyboardType="email-address"
        onChangeText={(text) => form.setFieldValue("email", text)}
        placeholder="Email"
        placeholderTextColor={mutedColor}
        style={{
          marginBottom: 12,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: mutedColor,
          paddingHorizontal: 16,
          paddingVertical: 12,
          color: foregroundColor,
        }}
        value={form.values.email}
      />

      <TextInput
        onChangeText={(text) => form.setFieldValue("password", text)}
        placeholder="Password"
        placeholderTextColor={mutedColor}
        secureTextEntry
        style={{
          marginBottom: 16,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: mutedColor,
          paddingHorizontal: 16,
          paddingVertical: 12,
          color: foregroundColor,
        }}
        value={form.values.password}
      />

      <Pressable
        disabled={signInMutation.isLoading}
        onPress={form.handleSubmit}
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 8,
          backgroundColor: accentColor,
          paddingVertical: 12,
        }}
      >
        {signInMutation.isLoading ? (
          <ActivityIndicator color={foregroundColor} size="small" />
        ) : (
          <Text style={{ color: foregroundColor, fontWeight: "500" }}>
            Sign In
          </Text>
        )}
      </Pressable>
    </Card>
  );
}
