import type { Metadata } from "next";
import { Suspense } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MediaLibraryGrid } from "@/components/admin/media-library-grid";
import { MediaUploadDialog } from "@/components/admin/media-upload-dialog";
import { requireRole } from "@/lib/auth/require-role";
import { getAdminMedia } from "@/lib/data/admin-media";

export const metadata: Metadata = { title: "Media Library" };

async function MediaList({ search }: { search: string }) {
  const media = await getAdminMedia({ search: search || undefined });
  return <MediaLibraryGrid media={media} />;
}

export default async function AdminMediaPage(props: PageProps<"/admin/media">) {
  await requireRole(["super_admin", "admin", "content_manager"]);

  const params = await props.searchParams;
  const search = typeof params.q === "string" ? params.q : "";

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight">Media Library</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Upload and manage product, machinery and site imagery. Copy a URL into any Image field elsewhere in
            the admin dashboard, or upload directly from that field.
          </p>
        </div>
        <MediaUploadDialog />
      </div>

      <form className="flex gap-2" method="get">
        <Input name="q" placeholder="Search by file name..." defaultValue={search} className="w-64" />
        <Button type="submit" variant="outline">
          Search
        </Button>
      </form>

      <Suspense key={search} fallback={<Skeleton className="h-[400px] w-full rounded-lg" />}>
        <MediaList search={search} />
      </Suspense>
    </div>
  );
}
