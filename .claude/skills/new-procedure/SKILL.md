---
name: new-procedure
description: Scaffold a complete new oRPC procedure for work-holo following all backend conventions. Creates Zod schemas, router handler, registers the procedure, and refreshes types. Use when adding any new backend feature.
---

You are scaffolding a new oRPC procedure for work-holo's backend (`packages/api`).

## Step 1 — Gather Info

Ask the user (if not already provided):
1. What does this procedure do? (one sentence)
2. Which domain router does it belong to? (attendance, communication, org, user, team, notification, storage, realtime, admin)
3. Which procedure base? (publicProcedure / protectedProcedure / orgProcedure / orgMemberProcedure / adminProcedure)
4. Is a permission check needed? If so, which permission?
5. What does the input look like? (fields and types)
6. What does the output look like?
7. What DB operations are needed?

## Step 2 — Create/Update Zod Schemas

File: `packages/api/src/lib/schemas/<domain>.ts`

Add input and output schemas following this naming convention:
- Input: `<ProcedureName>Input`
- Output: `<ProcedureName>Output`

```ts
// Example
export const MyActionInput = z.object({
  id: z.string(),
  note: z.string().optional(),
})

export const MyActionOutput = z.object({
  id: z.string(),
  status: z.string(),
  updatedAt: z.date(),
})
```

Rules:
- Use `z.string().cuid2()` for ID fields (or plain `z.string()` if Better Auth user ID)
- Use `z.date()` for timestamps — Drizzle returns Date objects
- Never use `z.any()` — define the shape explicitly
- Pagination inputs: `z.number().min(1).max(100).default(50)` for limit, `z.string().optional()` for cursor

## Step 3 — Write the Handler

File: `packages/api/src/routers/<domain>/<file>.ts`

```ts
import { ORPCError } from "@orpc/server"
import { <table> } from "@work-holo/db/schema/index"
import { and, eq } from "drizzle-orm"
import { <BaseProcedure> } from "../../index"
import { MyActionInput, MyActionOutput } from "../../lib/schemas/<domain>"

export const <domain>Router = {
  // ...existing procedures...

  myAction: <BaseProcedure>
    .input(MyActionInput)
    .output(MyActionOutput)
    .handler(async ({ input, context: { db, session, orgId, permission } }) => {
      // 1. Permission check (if mutation or sensitive read)
      await permission.check(permission.<module>().<resource>.<action>())

      // 2. Scope query to user + org + soft delete
      const record = await db.query.<table>.findFirst({
        where: and(
          eq(<table>.id, input.id),
          eq(<table>.userId, session.user.id),
          eq(<table>.organizationId, orgId),
          eq(<table>.isDeleted, false)
        ),
      })

      if (!record) {
        throw new ORPCError("NOT_FOUND", { message: "<Resource> not found." })
      }

      // 3. Business logic
      // ...

      // 4. Return typed output
      return record
    }),
}
```

## Step 4 — Register the Procedure

If adding to an existing router file, the export is already registered.

If creating a **new sub-router file** in an existing domain:
- Export from `packages/api/src/routers/<domain>/index.ts`

If creating a **new top-level domain**:
- Create `packages/api/src/routers/<domain>/index.ts`
- Add to `packages/api/src/routers/index.ts`:
  ```ts
  import { myDomainRouter } from "./<domain>"
  export const appRouter = {
    // ...
    myDomain: myDomainRouter,
  }
  ```

## Step 5 — Refresh Types

Run:
```bash
bun run generate:types
```

Verify the new `*InputType` and `*OutputType` appear in `packages/api/src/lib/types.ts`.

## Step 6 — Review

Run the `work-holo-reviewer` agent on the new files before considering the work done.

## Step 7 — Show Usage Example

Provide the client-side usage:

```ts
// Query (if it's a read)
const { data } = useSuspenseQuery(
  queryUtils.<domain>.myAction.queryOptions({ input: { id: "..." } })
)

// Mutation (if it's a write)
const result = await orpcClient.<domain>.myAction({ id: "...", note: "..." })
await queryClient.invalidateQueries({
  queryKey: queryUtils.<domain>.relatedReadProcedure.queryOptions({}).queryKey
})
```
