import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionHeader } from "./section-header";
import { SectionWrapper } from "./section-wrapper";

const securityFeatures = [
  {
    title: "Single Sign-On (SSO)",
    description:
      "Integrate with your existing identity provider for seamless authentication.",
  },
  {
    title: "Two-Factor Auth (2FA)",
    description:
      "Add an extra layer of security with TOTP-based two-factor authentication.",
  },
  {
    title: "Data Encryption",
    description:
      "All data is encrypted at rest and in transit with AES-256 encryption.",
  },
  {
    title: "Audit Logs",
    description:
      "Track every action with comprehensive audit logging for compliance.",
  },
];

const integrations = [
  {
    title: "Google Workspace",
    description:
      "Drive, Calendar, and Meet integration for seamless workflows.",
  },
  {
    title: "Developer APIs",
    description:
      "RESTful APIs and webhooks for custom integrations and automations.",
  },
];

export function SecuritySection() {
  return (
    <SectionWrapper variant="gray">
      <SectionHeader
        subtitle="Protect your data with advanced security measures while connecting WorkHolo to the tools your team already uses."
        title="Enterprise-grade security meets seamless integration."
      />

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {securityFeatures.map((feature) => (
          <Card className="border shadow-sm" key={feature.title}>
            <CardHeader>
              <CardTitle className="text-lg">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </CardContent>
          </Card>
        ))}

        {integrations.map((feature) => (
          <Card className="border shadow-sm" key={feature.title}>
            <CardHeader>
              <CardTitle className="text-lg">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </SectionWrapper>
  );
}
