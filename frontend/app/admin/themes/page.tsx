"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { Pencil, Trash2, Plus } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Theme } from "@/lib/types";

const emptyForm = {
  title: "",
  slug: "",
  description: "",
  price: "",
  category: "",
  image: "",
  demoUrl: "",
  tags: "",
};

export default function AdminThemesPage() {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // File uploads use FormData + raw fetch (NOT apiFetch, which forces JSON)
  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload failed");
      setForm((prev) => ({ ...prev, image: data.url }));
      toast.success("Image uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const loadThemes = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch("/themes?limit=100");
      setThemes(data.themes);
    } catch {
      toast.error("Failed to load themes");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadThemes();
  }, [loadThemes]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const openEdit = (t: Theme) => {
    setEditingId(t._id);
    setForm({
      title: t.title,
      slug: t.slug,
      description: t.description,
      price: String(t.price),
      category: t.category,
      image: t.image,
      demoUrl: t.demoUrl,
      tags: t.tags.join(", "),
    });
    setOpen(true);
  };

  const update = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      price: Number(form.price),
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };
    try {
      if (editingId) {
        await apiFetch(`/themes/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        toast.success("Theme updated");
      } else {
        await apiFetch("/themes", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        toast.success("Theme created");
      }
      setOpen(false);
      loadThemes();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this theme? This cannot be undone.")) return;
    try {
      await apiFetch(`/themes/${id}`, { method: "DELETE" });
      toast.success("Theme deleted");
      setThemes((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  };

  return (
    <>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Themes</h1>
          <p className="text-sm text-muted-foreground">
            Manage your theme catalog.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" /> Add Theme
        </Button>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : themes.length === 0 ? (
        <p className="text-muted-foreground">No themes yet. Add your first one.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50 text-left">
              <tr>
                <th className="p-3 font-medium">Title</th>
                <th className="p-3 font-medium">Category</th>
                <th className="p-3 font-medium">Price</th>
                <th className="p-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {themes.map((t) => (
                <tr key={t._id} className="border-b last:border-0">
                  <td className="p-3 font-medium">{t.title}</td>
                  <td className="p-3">
                    <Badge variant="secondary">{t.category}</Badge>
                  </td>
                  <td className="p-3">${t.price}</td>
                  <td className="p-3">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="icon-sm"
                        variant="outline"
                        onClick={() => openEdit(t)}
                        aria-label="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon-sm"
                        variant="destructive"
                        onClick={() => handleDelete(t._id)}
                        aria-label="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create / Edit dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit theme" : "Add theme"}</DialogTitle>
            <DialogDescription>Fill in the theme details below.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  required
                  value={form.title}
                  onChange={(e) => update("title", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  required
                  value={form.slug}
                  onChange={(e) => update("slug", e.target.value)}
                  placeholder="modern-portfolio"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  required
                  value={form.category}
                  onChange={(e) => update("category", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  required
                  value={form.price}
                  onChange={(e) => update("price", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="imageFile">Image</Label>
              <div className="flex items-center gap-3">
                {form.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={form.image}
                    alt="Theme preview"
                    className="h-12 w-16 rounded border object-cover"
                  />
                )}
                <Input
                  id="imageFile"
                  type="file"
                  accept="image/*"
                  onChange={handleFile}
                  disabled={uploading}
                  className="flex-1"
                />
              </div>
              <Input
                id="image"
                value={form.image}
                onChange={(e) => update("image", e.target.value)}
                placeholder="…or paste an image URL"
              />
              {uploading && (
                <p className="text-xs text-muted-foreground">Uploading…</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="demoUrl">Demo URL</Label>
              <Input
                id="demoUrl"
                value={form.demoUrl}
                onChange={(e) => update("demoUrl", e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={form.tags}
                onChange={(e) => update("tags", e.target.value)}
                placeholder="minimal, dark, creative"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                required
                rows={3}
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
              />
            </div>

            <DialogFooter>
              <Button type="submit" disabled={saving}>
                {saving ? "Saving…" : "Save theme"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
