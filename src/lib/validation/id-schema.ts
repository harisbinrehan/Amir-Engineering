import { z } from "zod";

/**
 * A database-generated id, validated as UUID-*shaped* only.
 *
 * zod's built-in `.uuid()` enforces the full RFC 4122 version/variant
 * nibbles, but Postgres's `uuid` column type does not — it accepts any
 * 8-4-4-4-12 hex string. Several seed rows in this project use readable
 * "vanity" ids (e.g. `77777777-7777-7777-7777-777777770101`) that are valid
 * Postgres uuids but fail strict RFC 4122 validation, since the variant
 * nibble isn't one of 8/9/a/b. Using `.uuid()` here rejected real product
 * and machinery ids client-side even though the database accepted them.
 */
export const idSchema = z
  .string()
  .regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, "Invalid id");
