"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/require-role";

type ActionResult<T = undefined> =
  | { success: true; data: T }
  | { success: false; error: string };

const MEDIA_ROLES = ["super_admin", "admin", "content_manager"] as const;
const MAX_SIZE_BYTES = 10 * 1024 * 1024;
const ALLOWED_MIME_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif", "image/svg+xml"];

function sanitizeFileName(name: string) {
  return name.trim().replace(/[^a-zA-Z0-9._-]/g, "-").slice(-100);
}

export async function uploadMedia(formData: FormData): Promise<ActionResult<{ id: string; url: string }>> {
  const { user } = await requireRole([...MEDIA_ROLES]);

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { success: false, error: "No file provided" };
  }
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return { success: false, error: "Unsupported file type. Upload a PNG, JPEG, WEBP, GIF or SVG image." };
  }
  if (file.size > MAX_SIZE_BYTES) {
    return { success: false, error: "File is too large. Maximum size is 10MB." };
  }

  const supabase = await createClient();
  const storagePath = `${crypto.randomUUID()}-${sanitizeFileName(file.name)}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await supabase.storage
    .from("media")
    .upload(storagePath, buffer, { contentType: file.type });

  if (uploadError) return { success: false, error: uploadError.message };

  const { data: row, error: insertError } = await supabase
    .from("media")
    .insert({
      bucket: "media",
      storage_path: storagePath,
      file_name: file.name,
      mime_type: file.type,
      size_bytes: file.size,
      uploaded_by: user.id,
    })
    .select("id")
    .single();

  if (insertError) {
    await supabase.storage.from("media").remove([storagePath]);
    return { success: false, error: insertError.message };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("media").getPublicUrl(storagePath);

  revalidatePath("/admin/media");
  return { success: true, data: { id: row.id, url: publicUrl } };
}

export async function updateMediaAltText(mediaId: string, altText: string): Promise<ActionResult> {
  await requireRole([...MEDIA_ROLES]);

  const supabase = await createClient();
  const { error } = await supabase
    .from("media")
    .update({ alt_text: altText.trim() || null })
    .eq("id", mediaId);

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/media");
  return { success: true, data: undefined };
}

export async function deleteMedia(mediaId: string): Promise<ActionResult> {
  await requireRole([...MEDIA_ROLES]);

  const supabase = await createClient();
  const { data: row, error: fetchError } = await supabase
    .from("media")
    .select("bucket, storage_path")
    .eq("id", mediaId)
    .single();

  if (fetchError) return { success: false, error: fetchError.message };

  const { error: removeError } = await supabase.storage.from(row.bucket).remove([row.storage_path]);
  if (removeError) return { success: false, error: removeError.message };

  const { error: deleteError } = await supabase.from("media").delete().eq("id", mediaId);
  if (deleteError) return { success: false, error: deleteError.message };

  revalidatePath("/admin/media");
  return { success: true, data: undefined };
}
