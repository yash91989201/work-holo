/** biome-ignore-all lint/style/useFilenamingConvention: <explanation> */
import ComponentsTest from "@/ComponentsTest";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(public)/componentsTest")({
  component: RouteComponent,
});

function RouteComponent() {
  return <ComponentsTest />;
}
