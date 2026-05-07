WITH ranked_role_assignments AS (
  SELECT
    id,
    row_number() OVER (
      PARTITION BY
        "userId",
        "roleTemplateId",
        "organizationId",
        COALESCE("teamId", '__org__')
      ORDER BY "assignedAt" ASC, id ASC
    ) AS rn
  FROM "roleAssignment"
)
DELETE FROM "roleAssignment" AS ra
USING ranked_role_assignments AS ranked
WHERE ra.id = ranked.id
  AND ranked.rn > 1;
--> statement-breakpoint
WITH role_template_canonical AS (
  SELECT
    id,
    first_value(id) OVER (
      PARTITION BY name, COALESCE("organizationId", '__system__')
      ORDER BY "createdAt" ASC, id ASC
    ) AS canonical_id
  FROM "roleTemplate"
),
duplicate_role_permissions AS (
  SELECT rp.id
  FROM "rolePermission" AS rp
  INNER JOIN role_template_canonical AS rtc
    ON rtc.id = rp."roleTemplateId"
  INNER JOIN "rolePermission" AS canonical_rp
    ON canonical_rp."roleTemplateId" = rtc.canonical_id
   AND canonical_rp."permissionNodeId" = rp."permissionNodeId"
  WHERE rtc.id <> rtc.canonical_id
)
DELETE FROM "rolePermission"
WHERE id IN (SELECT id FROM duplicate_role_permissions);
--> statement-breakpoint
WITH role_template_canonical AS (
  SELECT
    id,
    first_value(id) OVER (
      PARTITION BY name, COALESCE("organizationId", '__system__')
      ORDER BY "createdAt" ASC, id ASC
    ) AS canonical_id
  FROM "roleTemplate"
)
UPDATE "rolePermission" AS rp
SET "roleTemplateId" = rtc.canonical_id
FROM role_template_canonical AS rtc
WHERE rp."roleTemplateId" = rtc.id
  AND rtc.id <> rtc.canonical_id;
--> statement-breakpoint
WITH role_template_canonical AS (
  SELECT
    id,
    first_value(id) OVER (
      PARTITION BY name, COALESCE("organizationId", '__system__')
      ORDER BY "createdAt" ASC, id ASC
    ) AS canonical_id
  FROM "roleTemplate"
),
duplicate_role_assignments AS (
  SELECT ra.id
  FROM "roleAssignment" AS ra
  INNER JOIN role_template_canonical AS rtc
    ON rtc.id = ra."roleTemplateId"
  INNER JOIN "roleAssignment" AS canonical_ra
    ON canonical_ra."roleTemplateId" = rtc.canonical_id
   AND canonical_ra."userId" = ra."userId"
   AND canonical_ra."organizationId" = ra."organizationId"
   AND COALESCE(canonical_ra."teamId", '__org__') = COALESCE(ra."teamId", '__org__')
  WHERE rtc.id <> rtc.canonical_id
)
DELETE FROM "roleAssignment"
WHERE id IN (SELECT id FROM duplicate_role_assignments);
--> statement-breakpoint
WITH role_template_canonical AS (
  SELECT
    id,
    first_value(id) OVER (
      PARTITION BY name, COALESCE("organizationId", '__system__')
      ORDER BY "createdAt" ASC, id ASC
    ) AS canonical_id
  FROM "roleTemplate"
)
UPDATE "roleAssignment" AS ra
SET "roleTemplateId" = rtc.canonical_id
FROM role_template_canonical AS rtc
WHERE ra."roleTemplateId" = rtc.id
  AND rtc.id <> rtc.canonical_id;
--> statement-breakpoint
WITH role_template_canonical AS (
  SELECT
    id,
    first_value(id) OVER (
      PARTITION BY name, COALESCE("organizationId", '__system__')
      ORDER BY "createdAt" ASC, id ASC
    ) AS canonical_id
  FROM "roleTemplate"
)
DELETE FROM "roleTemplate" AS rt
USING role_template_canonical AS rtc
WHERE rt.id = rtc.id
  AND rtc.id <> rtc.canonical_id;
--> statement-breakpoint
DROP INDEX IF EXISTS "roleAssignmentUniqueIdx";
--> statement-breakpoint
DROP INDEX IF EXISTS "roleTemplateNameOrganizationIdIdx";
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "roleAssignmentOrgUniqueIdx"
  ON "roleAssignment" USING btree ("userId", "roleTemplateId", "organizationId")
  WHERE "teamId" IS NULL;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "roleAssignmentTeamUniqueIdx"
  ON "roleAssignment" USING btree ("userId", "roleTemplateId", "organizationId", "teamId")
  WHERE "teamId" IS NOT NULL;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "roleTemplateSystemNameIdx"
  ON "roleTemplate" USING btree ("name")
  WHERE "organizationId" IS NULL;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "roleTemplateOrgNameIdx"
  ON "roleTemplate" USING btree ("name", "organizationId")
  WHERE "organizationId" IS NOT NULL;
