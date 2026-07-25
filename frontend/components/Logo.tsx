import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

// Brand logo (Kayease wordmark). The art keeps its real colours; because its
// wordmark is dark ink, in dark mode we sit it on a light pill so it stays
// legible on the dark navbar/footer.
export default function Logo({
  className,
  imgClassName = "h-12",
}: {
  className?: string;
  imgClassName?: string;
}) {
  return (
    <Link
      href="/"
      aria-label="Kayease Themes — home"
      className={cn("flex items-center", className)}
    >
      <Image
        src="/Kayease-logo.avif"
        alt="Kayease Themes"
        width={384}
        height={209}
        priority
        className={cn(
          "w-auto dark:rounded-md dark:bg-white dark:p-1",
          imgClassName
        )}
      />
    </Link>
  );
}
