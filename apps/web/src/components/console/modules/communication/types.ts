export type ModuleMode = "disabled" | "org_wide" | "team_based" | "user_based";

export const MODE_OPTIONS: {
  value: ModuleMode;
  label: string;
  description: string;
}[] = [
  {
    value: "disabled",
    label: "Disabled",
    description: "Direct messaging is turned off",
  },
  {
    value: "org_wide",
    label: "Organization Wide",
    description: "All members can use this feature",
  },
  {
    value: "team_based",
    label: "Team Based",
    description: "Only selected teams have access",
  },
  {
    value: "user_based",
    label: "User Based",
    description: "Only selected users have access",
  },
];
