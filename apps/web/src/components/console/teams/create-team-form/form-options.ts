import type { CreateTeamFormType } from "@/lib/types";

const baseModules = [
  { id: "communication", name: "Communication" },
  { id: "attendance", name: "Attendance" },
];

export const createTeamFormOpts = {
  defaultValues: {
    name: "",
    modules: baseModules.map((m) => m.id),
    memberIds: [],
  } satisfies CreateTeamFormType as CreateTeamFormType,
};

export { baseModules };
