"use client";

import { useRef, useState } from "react";
import { X, Upload, Link2 } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { uploadImage } from "@/lib/upload";

type Props = {
  label?: string;
} & (
  | { multiple?: false; value: string; onChange: (v: string) => void }
  | { multiple: true; value: string[]; onChange: (v: string[]) => void }
);

export default function ImageUpload(props: Props) {
  const { label } = props;
  const multiple = props.multiple ?? false;
  const fileRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  // Normalize current value to an array for rendering.
  // Narrow on props.multiple directly so TS can resolve the union.
  const images: string[] = props.multiple
    ? props.value
    : props.value
      ? [props.value]
      : [];

  const commit = (next: string[]) => {
    if (props.multiple) props.onChange(next);
    else props.onChange(next[0] ?? "");
  };

  const addUrls = (urls: string[]) => {
    if (!urls.length) return;
    commit(props.multiple ? [...images, ...urls] : [urls[urls.length - 1]]);
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || !files.length) return;
    setUploading(true);
    try {
      const uploaded = await Promise.all(
        Array.from(files).map((f) => uploadImage(f))
      );
      addUrls(uploaded);
      toast.success(`Uploaded ${uploaded.length} image(s)`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const addUrl = () => {
    const v = url.trim();
    if (!v) return;
    addUrls([v]);
    setUrl("");
  };

  const removeAt = (i: number) => commit(images.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-3">
      {label && <Label>{label}</Label>}

      {/* Previews */}
      {images.length > 0 && (
        <div
          className={
            multiple
              ? "grid grid-cols-3 gap-3 sm:grid-cols-4"
              : "max-w-xs"
          }
        >
          {images.map((src, i) => (
            <div
              key={`${src}-${i}`}
              className="group relative aspect-video overflow-hidden rounded-lg border bg-muted"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`preview ${i + 1}`}
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeAt(i)}
                className="absolute right-1.5 top-1.5 rounded-md bg-destructive/90 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                aria-label="Remove image"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload from device */}
      <div className="flex flex-wrap items-center gap-2">
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
        >
          <Upload className="h-4 w-4" />
          {uploading ? "Uploading…" : multiple ? "Add images" : "Upload"}
        </Button>
        <span className="text-xs text-muted-foreground">or</span>
        <div className="flex flex-1 gap-2">
          <div className="relative flex-1">
            <Link2 className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addUrl();
                }
              }}
              placeholder="Paste image URL"
              className="pl-8"
            />
          </div>
          <Button type="button" variant="secondary" size="sm" onClick={addUrl}>
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}
