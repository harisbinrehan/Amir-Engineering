"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { CopyIcon, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/common/empty-state";
import { DeleteMediaButton } from "@/components/admin/delete-media-button";
import { updateMediaAltText } from "@/lib/actions/media";
import type { getAdminMedia } from "@/lib/data/admin-media";

function formatSize(bytes: number | null) {
  if (!bytes) return "—";
  if (bytes < 1024) return "< 1 KB";
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function MediaCard({ item }: { item: Awaited<ReturnType<typeof getAdminMedia>>[number] }) {
  const [, startTransition] = useTransition();

  const saveAltText = (value: string) => {
    startTransition(async () => {
      const result = await updateMediaAltText(item.id, value);
      if (!result.success) toast.error(result.error);
    });
  };

  const copyUrl = async () => {
    await navigator.clipboard.writeText(item.url);
    toast.success("URL copied");
  };

  return (
    <div className="overflow-hidden rounded-lg border">
      <div className="bg-muted relative aspect-square">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.url} alt={item.alt_text ?? item.file_name} className="h-full w-full object-cover" />
      </div>
      <div className="space-y-2 p-3">
        <p className="truncate text-sm font-medium" title={item.file_name}>
          {item.file_name}
        </p>
        <p className="text-muted-foreground text-xs">{formatSize(item.size_bytes)}</p>
        <Input
          placeholder="Alt text (for accessibility)"
          defaultValue={item.alt_text ?? ""}
          onBlur={(e) => saveAltText(e.target.value)}
          className="h-8 text-xs"
        />
        <div className="flex items-center justify-between">
          <Button type="button" variant="ghost" size="sm" onClick={copyUrl} className="text-muted-foreground gap-1 text-xs">
            <CopyIcon className="size-3.5" />
            Copy URL
          </Button>
          <DeleteMediaButton mediaId={item.id} />
        </div>
      </div>
    </div>
  );
}

export function MediaLibraryGrid({ media }: { media: Awaited<ReturnType<typeof getAdminMedia>> }) {
  if (media.length === 0) {
    return (
      <EmptyState
        icon={ImageIcon}
        title="No images yet"
        description="Upload your first image to start building the media library."
      />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {media.map((item) => (
        <MediaCard key={item.id} item={item} />
      ))}
    </div>
  );
}
