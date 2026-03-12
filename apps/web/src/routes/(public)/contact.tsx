import { createFileRoute } from "@tanstack/react-router";
import { ContactPage } from "@/components/landing/contact-page";

export const Route = createFileRoute("/(public)/contact")({
  component: ContactPage,
});
