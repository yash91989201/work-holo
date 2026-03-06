import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import { pixelBasedPreset, type TailwindConfig } from "@react-email/tailwind";
import type { ReactNode } from "react";

export interface EmailLayoutProps {
  children: ReactNode;
  preview: string;
}

const baseUrl = process.env.WEB_URL ?? "https://app.workholo.com";

export function EmailLayout({ preview, children }: EmailLayoutProps) {
  return (
    <Html dir="ltr" lang="en">
      <Tailwind
        config={
          {
            presets: [pixelBasedPreset],
            theme: {
              extend: {
                colors: {
                  brand: "#6366f1",
                  "brand-dark": "#4f46e5",
                  muted: "#6b7280",
                  surface: "#f9fafb",
                },
              },
            },
          } satisfies TailwindConfig as Record<string, unknown>
        }
      >
        <Head />
        <Preview>{preview}</Preview>
        <Body className="bg-surface font-sans">
          <Container className="mx-auto max-w-xl py-5">
            <Section className="rounded-lg bg-white p-6 shadow-sm">
              <Img
                alt="WorkHolo"
                className="mb-4"
                height="32"
                src={`${baseUrl}/logo.png`}
                width="120"
              />
              {children}
            </Section>
            <Section className="mt-4 text-center">
              <Hr className="border-gray-200" />
              <Text className="text-muted text-xs">
                You received this email because of your notification settings.{" "}
                <Link
                  className="text-brand underline"
                  href={`${baseUrl}/settings/notifications`}
                >
                  Manage preferences
                </Link>
              </Text>
              <Text className="text-muted text-xs">
                &copy; {new Date().getFullYear()} WorkHolo. All rights reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
