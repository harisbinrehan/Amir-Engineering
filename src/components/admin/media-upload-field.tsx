"use client";

import { useRef, useTransition } from "react";
import { toast } from "sonner";
import { Loader2Icon, UploadIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldContent, FieldError, FieldLabel } from "@/components/ui/field";
import { uploadMedia } from "@/lib/actions/media";

export function MediaUploadField({
  id = "imageUrl",
  label = "Image",
  value,
  onChange,
  error,
}: {
  id?: string;
  label?: string;
  value: string;
  onChange: (url: string) => void;
  error?: { message?: string };
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, startTransition] = useTransition();

  const handleFile = (file: File | undefined) => {
    if (!file) return;

    const formData = new FormData();
    formData.set("file", file);

    startTransition(async () => {
      const result = await uploadMedia(formData);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      onChange(result.data.url);
      toast.success("Image uploaded");
    });

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <Field data-invalid={!!error}>
      <FieldLabel htmlFor={`${id}-url`}>{label}</FieldLabel>
      <FieldContent>
        <div className="flex flex-wrap items-center gap-4">
          {value && (
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={value} alt="Preview" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => onChange("")}
                className="bg-background/90 text-foreground hover:text-destructive absolute top-1 right-1 rounded-full border p-0.5"
                aria-label="Remove image"
              >
                <XIcon className="size-3.5" />
              </button>
            </div>
          )}

          <Button type="button" variant="outline" disabled={isUploading} onClick={() => fileInputRef.current?.click()}>
            {isUploading ? <Loader2Icon className="animate-spin" /> : <UploadIcon />}
            {value ? "Replace image" : "Upload image"}
          </Button>

          <input
            ref={fileInputRef}
            id={`${id}-file`}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </div>

        <Input
          id={`${id}-url`}
          placeholder="Or paste an image URL"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-2"
        />
        <FieldError errors={[error]} />
      </FieldContent>
    </Field>
  );
}
