import { DotLoader } from "@/components/ui/dot-loader";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-(--ed-dark, #0B0F19)">
      <DotLoader />
    </div>
  );
}
