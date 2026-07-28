"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  FileText,
  ImageIcon,
  Code2,
  User,
  Search,
  Globe,
  DollarSign,
  Tag,
  Save,
} from "lucide-react";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import TagInput from "@/components/admin/TagInput";
import ImageUpload from "@/components/admin/ImageUpload";
import type { Theme, Category } from "@/lib/types";

const FRAMEWORKS = [
  "HTML/CSS",
  "React",
  "Next.js",
  "Vue",
  "Angular",
  "Svelte",
  "Shopify",
  "WordPress",
  "Tailwind",
  "Bootstrap",
];
const FORMATS = ["ZIP", "RAR", "TAR"];


// A titled card section
function Section({
  icon,
  title,
  children,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border bg-card p-6">
      <div className="mb-5 flex items-center gap-2">
        <span className="text-muted-foreground">{icon}</span>
        <h2 className="font-semibold">{title}</h2>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

type FormState = {
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  price: string;
  originalPrice: string;
  pricingType: "free" | "premium";
  image: string;
  screenshots: string[];
  framework: string;
  version: string;
  demoUrl: string;
  downloadUrl: string;
  keyFeatures: string[];
  technologies: string[];
  browserSupport: string[];
  fileFormat: string;
  fileSize: string;
  authorName: string;
  authorEmail: string;
  supportUrl: string;
  documentationUrl: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  category: string;
  tags: string[];
  status: "draft" | "published";
  visible: boolean;
  featured: boolean;
  priority: string;
};

function initial(theme?: Theme): FormState {
  return {
    title: theme?.title ?? "",
    slug: theme?.slug ?? "",
    shortDescription: theme?.shortDescription ?? "",
    description: theme?.description ?? "",
    price: theme ? String(theme.price) : "",
    originalPrice: theme?.originalPrice ? String(theme.originalPrice) : "",
    pricingType: theme?.pricingType ?? "premium",
    image: theme?.image ?? "",
    screenshots: theme?.screenshots ?? [],
    framework: theme?.framework ?? "",
    version: theme?.version ?? "1.0.0",
    demoUrl: theme?.demoUrl ?? "",
    downloadUrl: theme?.downloadUrl ?? "",
    keyFeatures: theme?.keyFeatures ?? [],
    technologies: theme?.technologies ?? [],
    browserSupport: theme?.browserSupport ?? [],
    fileFormat: theme?.fileFormat ?? "ZIP",
    fileSize: theme?.fileSize ?? "",
    authorName: theme?.authorName ?? "",
    authorEmail: theme?.authorEmail ?? "",
    supportUrl: theme?.supportUrl ?? "",
    documentationUrl: theme?.documentationUrl ?? "",
    metaTitle: theme?.metaTitle ?? "",
    metaDescription: theme?.metaDescription ?? "",
    keywords: theme?.keywords ?? [],
    category: theme?.category ?? "",
    tags: theme?.tags ?? [],
    status: theme?.status ?? "published",
    visible: theme?.visible ?? true,
    featured: theme?.featured ?? false,
    priority: theme ? String(theme.priority || 999) : "999",
  };
}

// Auto-generate a slug from the title
const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export default function ThemeForm({ theme }: { theme?: Theme }) {
  const router = useRouter();
  const isEdit = !!theme;
  const [form, setForm] = useState<FormState>(initial(theme));
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    apiFetch("/categories")
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Price is only required for premium themes — free themes are forced to 0
    // below, so an empty price field is valid for them.
    const priceMissing = form.pricingType === "premium" && !form.price;
    if (!form.title || !form.description || !form.category || priceMissing) {
      toast.error("Please fill in the required fields (name, description, category, price).");
      return;
    }
    setSaving(true);
    const payload = {
      ...form,
      slug: form.slug || slugify(form.title),
      price: form.pricingType === "free" ? 0 : Number(form.price),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : 0,
      priority: Number(form.priority) || 999,
    };
    try {
      if (isEdit) {
        await apiFetch(`/themes/${theme!._id}`, {
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
      router.push("/admin/themes");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Sticky header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {isEdit ? "Edit Theme" : "Add New Theme"}
          </h1>
          <p className="text-sm text-muted-foreground">
            Update theme information, assets, and pricing.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/themes")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            <Save className="h-4 w-4" />
            {saving ? "Saving…" : isEdit ? "Update Theme" : "Create Theme"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main column */}
        <div className="space-y-6 lg:col-span-2">
          <Section icon={<FileText className="h-5 w-5" />} title="General Information">
            <div className="space-y-1.5">
              <Label htmlFor="title">
                Theme Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => {
                  set("title", e.target.value);
                  if (!isEdit) set("slug", slugify(e.target.value));
                }}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="slug">
                Slug <span className="text-destructive">*</span>
              </Label>
              <div className="flex items-center overflow-hidden rounded-lg border">
                <span className="bg-muted px-3 py-2 text-sm text-muted-foreground">
                  themes/
                </span>
                <input
                  id="slug"
                  value={form.slug}
                  onChange={(e) => set("slug", e.target.value)}
                  className="flex-1 bg-transparent px-3 py-2 text-sm outline-none"
                  required
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="shortDescription">Short Description</Label>
              <Textarea
                id="shortDescription"
                rows={2}
                value={form.shortDescription}
                onChange={(e) => set("shortDescription", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="description">
                Full Description <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="description"
                rows={6}
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                required
              />
            </div>
          </Section>

          <Section icon={<ImageIcon className="h-5 w-5" />} title="Media Assets">
            <ImageUpload
              label="Cover Image"
              value={form.image}
              onChange={(v) => set("image", v)}
            />
            <ImageUpload
              label="Preview Screenshots"
              multiple
              value={form.screenshots}
              onChange={(v) => set("screenshots", v)}
            />
          </Section>

          <Section icon={<Code2 className="h-5 w-5" />} title="Technical Specs">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Framework</Label>
                <Select
                  value={form.framework}
                  onValueChange={(v) => set("framework", v)}
                  placeholder="Select framework"
                  options={FRAMEWORKS.map((f) => ({ value: f, label: f }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="version">Version</Label>
                <Input
                  id="version"
                  value={form.version}
                  onChange={(e) => set("version", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="demoUrl">Demo URL</Label>
                <Input
                  id="demoUrl"
                  value={form.demoUrl}
                  onChange={(e) => set("demoUrl", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="downloadUrl">Download URL</Label>
                <Input
                  id="downloadUrl"
                  value={form.downloadUrl}
                  onChange={(e) => set("downloadUrl", e.target.value)}
                />
              </div>
            </div>
            <TagInput
              label="Key Features"
              values={form.keyFeatures}
              onChange={(v) => set("keyFeatures", v)}
              placeholder="Add a feature…"
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <TagInput
                label="Technologies Used"
                values={form.technologies}
                onChange={(v) => set("technologies", v)}
                placeholder="e.g. Tailwind…"
              />
              <TagInput
                label="Browser Support"
                values={form.browserSupport}
                onChange={(v) => set("browserSupport", v)}
                placeholder="e.g. Chrome…"
              />
            </div>
          </Section>

          <Section icon={<User className="h-5 w-5" />} title="Author & Support">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="authorName">Author Name</Label>
                <Input
                  id="authorName"
                  value={form.authorName}
                  onChange={(e) => set("authorName", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="authorEmail">Author Email</Label>
                <Input
                  id="authorEmail"
                  type="email"
                  value={form.authorEmail}
                  onChange={(e) => set("authorEmail", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="supportUrl">Support URL</Label>
                <Input
                  id="supportUrl"
                  value={form.supportUrl}
                  onChange={(e) => set("supportUrl", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="documentationUrl">Documentation URL</Label>
                <Input
                  id="documentationUrl"
                  value={form.documentationUrl}
                  onChange={(e) => set("documentationUrl", e.target.value)}
                />
              </div>
            </div>
          </Section>

          <Section icon={<Search className="h-5 w-5" />} title="Search Engine Optimization">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="metaTitle">Meta Title</Label>
                <span className="text-xs text-muted-foreground">
                  {form.metaTitle.length}/60
                </span>
              </div>
              <Input
                id="metaTitle"
                maxLength={60}
                value={form.metaTitle}
                onChange={(e) => set("metaTitle", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="metaDescription">Meta Description</Label>
                <span className="text-xs text-muted-foreground">
                  {form.metaDescription.length}/160
                </span>
              </div>
              <Textarea
                id="metaDescription"
                maxLength={160}
                rows={3}
                value={form.metaDescription}
                onChange={(e) => set("metaDescription", e.target.value)}
              />
            </div>
            <TagInput
              label="Keywords"
              values={form.keywords}
              onChange={(v) => set("keywords", v)}
              placeholder="e.g. portfolio…"
            />
          </Section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Section icon={<Globe className="h-5 w-5" />} title="Publishing">
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select
                value={form.status}
                onValueChange={(v) => set("status", v as FormState["status"])}
                options={[
                  { value: "published", label: "Published" },
                  { value: "draft", label: "Draft" },
                ]}
              />
            </div>
            <label className="flex cursor-pointer items-center justify-between">
              <span className="text-sm font-medium">Visible on site</span>
              <input
                type="checkbox"
                checked={form.visible}
                onChange={(e) => set("visible", e.target.checked)}
                className="h-4 w-4 accent-primary"
              />
            </label>
            <label className="flex cursor-pointer items-center justify-between">
              <span className="text-sm font-medium">Featured item</span>
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => set("featured", e.target.checked)}
                className="h-4 w-4 accent-primary"
              />
            </label>
            <div className="space-y-1.5 pt-2">
              <Label htmlFor="priority">
                Featured Priority
              </Label>
              <Input
                id="priority"
                type="number"
                min="1"
                max="999"
                value={form.priority}
                onChange={(e) => set("priority", e.target.value)}
                placeholder="999"
              />
              <p className="text-xs text-muted-foreground">
                Rank (1 = first). Use 999 for unranked themes.
              </p>
            </div>
          </Section>

          <Section icon={<DollarSign className="h-5 w-5" />} title="Pricing">
            <div className="flex gap-4">
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="pricingType"
                  checked={form.pricingType === "premium"}
                  onChange={() => set("pricingType", "premium")}
                  className="accent-primary"
                />
                Premium (Paid)
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="pricingType"
                  checked={form.pricingType === "free"}
                  onChange={() => set("pricingType", "free")}
                  className="accent-primary"
                />
                Free
              </label>
            </div>
            {form.pricingType === "premium" && (
              <>
                <div className="space-y-1.5">
                  <Label htmlFor="price">
                    Price ($) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    value={form.price}
                    onChange={(e) => set("price", e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="originalPrice">
                    Original Price (for sale)
                  </Label>
                  <Input
                    id="originalPrice"
                    type="number"
                    min="0"
                    placeholder="0.00"
                    value={form.originalPrice}
                    onChange={(e) => set("originalPrice", e.target.value)}
                  />
                </div>
              </>
            )}
          </Section>

          <Section icon={<Tag className="h-5 w-5" />} title="Organization">
            <div className="space-y-1.5">
              <Label>
                Category <span className="text-destructive">*</span>
              </Label>
              <Select
                value={form.category}
                onValueChange={(v) => set("category", v)}
                placeholder="Select category"
                required
                options={categories.map((c) => ({
                  value: c.name,
                  label: c.name,
                }))}
              />
            </div>
            <TagInput
              label="Tags"
              values={form.tags}
              onChange={(v) => set("tags", v)}
              placeholder="Add tag…"
            />
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Format</Label>
                <Select
                  value={form.fileFormat}
                  onValueChange={(v) => set("fileFormat", v)}
                  options={FORMATS.map((f) => ({ value: f, label: f }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="fileSize">Size</Label>
                <Input
                  id="fileSize"
                  placeholder="e.g. 15MB"
                  value={form.fileSize}
                  onChange={(e) => set("fileSize", e.target.value)}
                />
              </div>
            </div>
          </Section>
        </div>
      </div>
    </form>
  );
}
