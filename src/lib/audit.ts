import { createServiceRoleClient } from "@/lib/supabase/server";
import type { Json } from "@/types/database.types";

/**
 * Writes to audit_logs via the service role — per the table's own RLS
 * comment (0012), inserts are meant to come from server-side actions only,
 * never from a client-issued write. Best-effort: a logging failure must
 * never fail the mutation it's describing.
 */
export async function logAudit(params: {
  actorId: string | null;
  action: "create" | "update" | "delete" | "bulk_update" | "import";
  entityType: string;
  entityId: string;
  diff?: Record<string, unknown>;
}) {
  try {
    const admin = createServiceRoleClient();
    const { error } = await admin.from("audit_logs").insert({
      actor_id: params.actorId,
      action: params.action,
      entity_type: params.entityType,
      entity_id: params.entityId,
      diff: (params.diff ?? null) as Json,
    });
    if (error) console.error("[audit] insert failed", error);
  } catch (err) {
    console.error("[audit] threw", err);
  }
}
