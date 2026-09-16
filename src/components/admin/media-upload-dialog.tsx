"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2Icon, UploadIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { uploadMedia } from "@/lib/actions/media";

export function MediaUploadDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isUploading, startTransition] = useTransition();
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files?.length) return;
    const list = Array.from(files);

    startTransition(async () => {
      setProgress({ done: 0, total: list.length });
      let failures = 0;

      for (const file of list) {
        const formData = new FormData();
        formData.set("file", file);
        const result = await uploadMedia(formData);
        if (!result.success) {
          failures += 1;
          toast.error(`${file.name}: ${result.error}`);
        }
        setProgress((prev) => (prev ? { ...prev, done: prev.done + 1 } : prev));
      }

      setProgress(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

      if (failures < list.length) {
        toast.success(list.length - failures === 1 ? "Image uploaded" : `${list.length - failures} images uploaded`);
        router.refresh();
      }
      if (failures === 0) setOpen(false);
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-industrial text-industrial-foreground hover:bg-industrial/90">
          <UploadIcon />
          Upload Images
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Images</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed py-10 text-center">
          <UploadIcon className="text-muted-foreground size-6" />
          <p className="text-muted-foreground text-sm">PNG, JPEG, WEBP, GIF or SVG — up to 10MB each</p>
          <Button type="button" variant="outline" disabled={isUploading} onClick={() => fileInputRef.current?.click()}>
            {isUploading && <Loader2Icon className="animate-spin" />}
            {progress ? `Uploading ${progress.done}/${progress.total}...` : "Choose files"}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
