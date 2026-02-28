export const MODULE_IDS = {
  DIRECT_MESSAGE: "direct_message",
} as const;

export type ModuleId = (typeof MODULE_IDS)[keyof typeof MODULE_IDS];
