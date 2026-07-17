// Uploads a single image file to the backend (Cloudinary) and returns its URL.
// Uses raw fetch + FormData because multipart must NOT have a JSON content-type.
export async function uploadImage(file: File): Promise<string> {
  const fd = new FormData();
  fd.append("image", file);
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: fd,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Upload failed");
  return data.url as string;
}
