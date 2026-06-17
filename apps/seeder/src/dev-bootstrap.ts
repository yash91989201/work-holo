import { randomBytes, randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { MODULE_IDS } from "@work-holo/api/lib/module-ids";
import { auth } from "@work-holo/auth";
import { db } from "@work-holo/db";
import {
  account,
  member,
  organization,
  team,
  teamMember,
  user,
} from "@work-holo/db/schema/auth";
import {
  orgModuleConfigTable,
  roleAssignmentTable,
  roleTemplateTable,
} from "@work-holo/db/schema/authorization";
import { channelMemberTable, channelTable } from "@work-holo/db/schema/channel";
import { Redis } from "@work-holo/infrastructure";
import { assignOrgUserRole, PermissionManagers } from "@work-holo/permission";
import { hashPassword } from "better-auth/crypto";
import { and, eq, inArray, isNull } from "drizzle-orm";

type OrgRole = "owner" | "admin" | "member";

interface BootstrapUserConfig {
  email: string;
  envKey: string;
  name: string;
  orgRole: OrgRole;
  teamNames: readonly string[];
  username: string;
}

interface BootstrapUser extends BootstrapUserConfig {
  password: string;
}

interface ChannelMemberSeed {
  role: string;
  userId: string;
}

const DEV_ORG = {
  name: "Work Holo Dev Org",
  slug: "work-holo-dev",
} as const;

const TEAM_NAMES = ["IT", "Sales", "HR", "Accounts"] as const;
const SYSTEM_ROLES: readonly OrgRole[] = ["owner", "admin", "member"] as const;
const GENERAL_CHANNEL_NAME = "general";
const NEWLINE_REGEX = /\r?\n/;
const SERVER_ENV_PATH = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../server/.env"
);

const BOOTSTRAP_USERS: readonly BootstrapUserConfig[] = [
  {
    envKey: "USER1",
    email: "owner@gmail.com",
    name: "Owner User",
    orgRole: "owner",
    teamNames: TEAM_NAMES,
    username: "owner",
  },
  {
    envKey: "USER2",
    email: "admin1@gmail.com",
    name: "Admin 1",
    orgRole: "admin",
    teamNames: TEAM_NAMES,
    username: "admin1",
  },
  {
    envKey: "USER3",
    email: "admin2@gmail.com",
    name: "Admin 2",
    orgRole: "admin",
    teamNames: TEAM_NAMES,
    username: "admin2",
  },
  {
    envKey: "USER4",
    email: "member1@gmail.com",
    name: "Member 1",
    orgRole: "member",
    teamNames: ["IT"],
    username: "member1",
  },
  {
    envKey: "USER5",
    email: "member2@gmail.com",
    name: "Member 2",
    orgRole: "member",
    teamNames: ["Sales"],
    username: "member2",
  },
  {
    envKey: "USER6",
    email: "member3@gmail.com",
    name: "Member 3",
    orgRole: "member",
    teamNames: ["HR"],
    username: "member3",
  },
  {
    envKey: "USER7",
    email: "member4@gmail.com",
    name: "Member 4",
    orgRole: "member",
    teamNames: ["Accounts"],
    username: "member4",
  },
] as const;

function generatePassword(): string {
  return `${randomBytes(12).toString("base64url")}Aa1!`;
}

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

async function ensurePermissionManagersInitialized(): Promise<void> {
  await Redis.connect({ url: getRequiredEnv("REDIS_URL") });

  PermissionManagers.initialize({
    db,
    redis: Redis.getClient(),
  });
}

function rolePriority(role: string): number {
  switch (role) {
    case "owner":
      return 3;
    case "admin":
      return 2;
    default:
      return 1;
  }
}

function dedupeChannelMembers(
  members: readonly ChannelMemberSeed[]
): ChannelMemberSeed[] {
  const memberMap = new Map<string, ChannelMemberSeed>();

  for (const candidate of members) {
    const existing = memberMap.get(candidate.userId);
    if (
      !existing ||
      rolePriority(candidate.role) > rolePriority(existing.role)
    ) {
      memberMap.set(candidate.userId, candidate);
    }
  }

  return Array.from(memberMap.values());
}

async function readEnvFile(): Promise<string> {
  try {
    return await fs.readFile(SERVER_ENV_PATH, "utf8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return "";
    }

    throw error;
  }
}

function getExistingPassword(
  envContent: string,
  key: string,
  email: string
): string | null {
  const line = envContent
    .split(NEWLINE_REGEX)
    .find((entry) => entry.startsWith(`${key}=`));

  if (!line) {
    return null;
  }

  const value = line.slice(key.length + 1);
  const separatorIndex = value.indexOf(",");

  if (separatorIndex === -1) {
    return null;
  }

  const storedEmail = value.slice(0, separatorIndex).trim();
  const storedPassword = value.slice(separatorIndex + 1).trim();

  if (storedEmail !== email || storedPassword.length === 0) {
    return null;
  }

  return storedPassword;
}

async function writeCredentialsToEnv(
  users: readonly BootstrapUser[]
): Promise<void> {
  const envContent = await readEnvFile();
  const lines = envContent.length > 0 ? envContent.split(NEWLINE_REGEX) : [];

  for (const config of users) {
    const nextValue = `${config.envKey}=${config.email},${config.password}`;
    const lineIndex = lines.findIndex((line) =>
      line.startsWith(`${config.envKey}=`)
    );

    if (lineIndex === -1) {
      lines.push(nextValue);
    } else {
      lines[lineIndex] = nextValue;
    }
  }

  while (lines.length > 0 && lines.at(-1) === "") {
    lines.pop();
  }

  await fs.writeFile(SERVER_ENV_PATH, `${lines.join("\n")}\n`, "utf8");
}

async function ensureCredentialAccount(
  userId: string,
  password: string
): Promise<void> {
  const hashedPassword = await hashPassword(password);
  const existingAccount = await db.query.account.findFirst({
    where: and(
      eq(account.userId, userId),
      eq(account.providerId, "credential")
    ),
    columns: { id: true },
  });

  if (!existingAccount) {
    const now = new Date();

    await db.insert(account).values({
      accountId: userId,
      createdAt: now,
      id: randomUUID(),
      password: hashedPassword,
      providerId: "credential",
      updatedAt: now,
      userId,
    });
    return;
  }

  await db
    .update(account)
    .set({
      password: hashedPassword,
      updatedAt: new Date(),
    })
    .where(eq(account.id, existingAccount.id));
}

async function ensureUserAccount(config: BootstrapUser): Promise<string> {
  const existingUser = await db.query.user.findFirst({
    where: eq(user.email, config.email),
    columns: { id: true },
  });

  let userId = existingUser?.id;

  if (!userId) {
    const created = await auth.api.createUser({
      body: {
        data: {
          displayUsername: config.name,
          emailVerified: true,
          username: config.username,
        },
        email: config.email,
        name: config.name,
        password: config.password,
      },
    });

    userId = created.user.id;
  }

  if (!userId) {
    throw new Error(`Failed to provision user: ${config.email}`);
  }

  await db
    .update(user)
    .set({
      displayUsername: config.name,
      emailVerified: true,
      name: config.name,
      updatedAt: new Date(),
      username: config.username,
    })
    .where(eq(user.id, userId));

  await ensureCredentialAccount(userId, config.password);
  return userId;
}

async function ensureOrganization(ownerUserId: string): Promise<string> {
  const existingOrganization = await db.query.organization.findFirst({
    where: eq(organization.slug, DEV_ORG.slug),
    columns: { id: true },
  });

  if (existingOrganization) {
    await db
      .update(organization)
      .set({ name: DEV_ORG.name })
      .where(eq(organization.id, existingOrganization.id));

    return existingOrganization.id;
  }

  const created = await auth.api.createOrganization({
    body: {
      name: DEV_ORG.name,
      slug: DEV_ORG.slug,
      userId: ownerUserId,
    },
  });

  return created.id;
}

async function syncOrgRoleAssignments(
  organizationId: string,
  role: OrgRole,
  userId: string
): Promise<void> {
  const templates = await db.query.roleTemplateTable.findMany({
    where: and(
      eq(roleTemplateTable.isSystem, true),
      inArray(roleTemplateTable.name, [...SYSTEM_ROLES])
    ),
    columns: {
      id: true,
      name: true,
    },
  });

  const staleTemplateIds = templates
    .filter((template) => template.name !== role)
    .map((template) => template.id);

  if (staleTemplateIds.length > 0) {
    await db
      .delete(roleAssignmentTable)
      .where(
        and(
          eq(roleAssignmentTable.organizationId, organizationId),
          inArray(roleAssignmentTable.roleTemplateId, staleTemplateIds),
          eq(roleAssignmentTable.userId, userId)
        )
      );
  }

  await assignOrgUserRole(db, userId, organizationId, role);
}

async function ensureOrganizationMember(
  organizationId: string,
  role: OrgRole,
  userId: string
): Promise<void> {
  const existingMembership = await db.query.member.findFirst({
    where: and(
      eq(member.organizationId, organizationId),
      eq(member.userId, userId)
    ),
    columns: {
      id: true,
      role: true,
    },
  });

  if (!existingMembership) {
    await auth.api.addMember({
      body: {
        organizationId,
        role,
        userId,
      },
    });

    await syncOrgRoleAssignments(organizationId, role, userId);
    return;
  }

  if (existingMembership.role !== role) {
    await db
      .update(member)
      .set({ role })
      .where(eq(member.id, existingMembership.id));
  }

  await syncOrgRoleAssignments(organizationId, role, userId);
}

async function ensureTeam(
  name: string,
  organizationId: string
): Promise<string> {
  const existingTeam = await db.query.team.findFirst({
    where: and(eq(team.name, name), eq(team.organizationId, organizationId)),
    columns: { id: true },
  });

  if (existingTeam) {
    return existingTeam.id;
  }

  const created = await auth.api.createTeam({
    body: {
      name,
      organizationId,
    },
  });

  return created.id;
}

async function ensureTeamMembership(
  teamId: string,
  userId: string
): Promise<void> {
  const existingTeamMember = await db.query.teamMember.findFirst({
    where: and(eq(teamMember.teamId, teamId), eq(teamMember.userId, userId)),
    columns: { id: true },
  });

  if (existingTeamMember) {
    return;
  }

  await db.insert(teamMember).values({
    createdAt: new Date(),
    id: randomUUID(),
    role: "member",
    teamId,
    userId,
  });
}

async function ensureDirectMessageAccess(
  organizationId: string,
  updatedBy: string
): Promise<void> {
  await db
    .insert(orgModuleConfigTable)
    .values({
      mode: "org_wide",
      module: MODULE_IDS.DIRECT_MESSAGE,
      organizationId,
      updatedBy,
    })
    .onConflictDoUpdate({
      target: [
        orgModuleConfigTable.organizationId,
        orgModuleConfigTable.module,
      ],
      set: {
        mode: "org_wide",
        updatedAt: new Date(),
        updatedBy,
      },
    });
}

async function ensureChannel(
  values:
    | {
        createdBy: string;
        description: string;
        name: string;
        organizationId: string;
        type: "group";
      }
    | {
        createdBy: string;
        description: string;
        name: string;
        organizationId: string;
        teamId: string;
        type: "team";
      }
): Promise<string> {
  const channelWhere =
    values.type === "team"
      ? and(
          eq(channelTable.name, values.name),
          eq(channelTable.organizationId, values.organizationId),
          eq(channelTable.teamId, values.teamId),
          eq(channelTable.type, values.type)
        )
      : and(
          eq(channelTable.name, values.name),
          eq(channelTable.organizationId, values.organizationId),
          isNull(channelTable.teamId),
          eq(channelTable.type, values.type)
        );

  const existingChannel = await db.query.channelTable.findFirst({
    where: channelWhere,
    columns: { id: true },
  });

  if (existingChannel) {
    await db
      .update(channelTable)
      .set({
        createdBy: values.createdBy,
        description: values.description,
        updatedAt: new Date(),
      })
      .where(eq(channelTable.id, existingChannel.id));

    return existingChannel.id;
  }

  const [createdChannel] = await db
    .insert(channelTable)
    .values({
      createdBy: values.createdBy,
      description: values.description,
      name: values.name,
      organizationId: values.organizationId,
      teamId: values.type === "team" ? values.teamId : undefined,
      type: values.type,
    })
    .returning({ id: channelTable.id });

  if (!createdChannel) {
    throw new Error(`Failed to create channel: ${values.name}`);
  }

  return createdChannel.id;
}

async function ensureChannelMembers(
  channelId: string,
  desiredMembers: readonly ChannelMemberSeed[]
): Promise<void> {
  const dedupedMembers = dedupeChannelMembers(desiredMembers);
  const existingMembers = await db.query.channelMemberTable.findMany({
    where: eq(channelMemberTable.channelId, channelId),
    columns: {
      id: true,
      role: true,
      userId: true,
    },
  });

  const existingByUserId = new Map(
    existingMembers.map((entry) => [entry.userId, entry])
  );

  const newMembers = dedupedMembers.filter(
    (entry) => !existingByUserId.has(entry.userId)
  );

  if (newMembers.length > 0) {
    await db.insert(channelMemberTable).values(
      newMembers.map((entry) => ({
        channelId,
        role: entry.role,
        userId: entry.userId,
      }))
    );
  }

  for (const desiredMember of dedupedMembers) {
    const existingMember = existingByUserId.get(desiredMember.userId);
    if (!existingMember || existingMember.role === desiredMember.role) {
      continue;
    }

    await db
      .update(channelMemberTable)
      .set({ role: desiredMember.role })
      .where(eq(channelMemberTable.id, existingMember.id));
  }
}

async function seedChannels(
  bootstrapUsers: readonly BootstrapUser[],
  organizationId: string,
  ownerUserId: string,
  teamIdsByName: ReadonlyMap<string, string>,
  userIdsByEmail: ReadonlyMap<string, string>
): Promise<void> {
  const orgMembers = await db.query.member.findMany({
    where: eq(member.organizationId, organizationId),
    columns: {
      role: true,
      userId: true,
    },
  });

  const orgRoleByUserId = new Map(
    orgMembers.map((entry) => [entry.userId, entry.role])
  );
  const elevatedMembers = orgMembers.filter((entry) => entry.role !== "member");

  const generalChannelId = await ensureChannel({
    createdBy: ownerUserId,
    description: "Organization-wide channel for the local bootstrap workspace.",
    name: GENERAL_CHANNEL_NAME,
    organizationId,
    type: "group",
  });

  await ensureChannelMembers(
    generalChannelId,
    bootstrapUsers.map((entry) => {
      const userId = userIdsByEmail.get(entry.email);
      if (!userId) {
        throw new Error(`Missing user for bootstrap channel: ${entry.email}`);
      }

      return {
        role: orgRoleByUserId.get(userId) ?? "member",
        userId,
      };
    })
  );

  for (const [teamName, teamId] of teamIdsByName.entries()) {
    const teamChannelId = await ensureChannel({
      createdBy: ownerUserId,
      description: `${teamName} team channel for the local bootstrap workspace.`,
      name: teamName,
      organizationId,
      teamId,
      type: "team",
    });

    const teamMembers = await db.query.teamMember.findMany({
      where: eq(teamMember.teamId, teamId),
      columns: { userId: true },
    });

    await ensureChannelMembers(teamChannelId, [
      ...elevatedMembers.map((entry) => ({
        role: entry.role,
        userId: entry.userId,
      })),
      ...teamMembers.map((entry) => ({
        role: orgRoleByUserId.get(entry.userId) ?? "member",
        userId: entry.userId,
      })),
    ]);
  }
}

export async function seedDevBootstrap(): Promise<void> {
  console.log("👥 Bootstrapping development workspace data...");
  await ensurePermissionManagersInitialized();

  const envContent = await readEnvFile();
  const bootstrapUsers: BootstrapUser[] = BOOTSTRAP_USERS.map((entry) => ({
    ...entry,
    password:
      getExistingPassword(envContent, entry.envKey, entry.email) ??
      generatePassword(),
  }));

  const userIdsByEmail = new Map<string, string>();

  for (const config of bootstrapUsers) {
    const userId = await ensureUserAccount(config);
    userIdsByEmail.set(config.email, userId);
    console.log(`  ✅ Ready user: ${config.email}`);
  }

  const ownerUserId = userIdsByEmail.get("owner@gmail.com");
  if (!ownerUserId) {
    throw new Error("Owner account was not provisioned.");
  }

  const organizationId = await ensureOrganization(ownerUserId);
  console.log(`  🏢 Organization ready: ${DEV_ORG.name}`);

  for (const config of bootstrapUsers) {
    const userId = userIdsByEmail.get(config.email);
    if (!userId) {
      throw new Error(`Missing user id for ${config.email}`);
    }

    await ensureOrganizationMember(organizationId, config.orgRole, userId);
  }

  const teamIdsByName = new Map<string, string>();
  for (const teamName of TEAM_NAMES) {
    const teamId = await ensureTeam(teamName, organizationId);
    teamIdsByName.set(teamName, teamId);
    console.log(`  👥 Team ready: ${teamName}`);
  }

  for (const config of bootstrapUsers) {
    const userId = userIdsByEmail.get(config.email);
    if (!userId) {
      throw new Error(`Missing user id for ${config.email}`);
    }

    for (const teamName of config.teamNames) {
      const teamId = teamIdsByName.get(teamName);
      if (!teamId) {
        throw new Error(`Missing team id for ${teamName}`);
      }

      await ensureTeamMembership(teamId, userId);
    }
  }

  await ensureDirectMessageAccess(organizationId, ownerUserId);
  await seedChannels(
    bootstrapUsers,
    organizationId,
    ownerUserId,
    teamIdsByName,
    userIdsByEmail
  );
  await writeCredentialsToEnv(bootstrapUsers);

  console.log("  💬 Channels ready: general + one team channel per team");
  console.log("  🔐 Credentials written to apps/server/.env");
  for (const config of bootstrapUsers) {
    console.log(`     ${config.envKey}=${config.email},${config.password}`);
  }
  console.log("✨ Development workspace bootstrap complete.");
}

if (import.meta.main) {
  seedDevBootstrap().catch((error) => {
    console.error("❌ Dev bootstrap failed:", error);
    process.exit(1);
  });
}
