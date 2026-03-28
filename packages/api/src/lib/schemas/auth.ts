import { z } from "zod";

export const AdminRoleSchema = z.enum(["super_admin", "admin", "support"]);
