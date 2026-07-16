import Link from "next/link";
import { LayoutGrid } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-auto border-t bg-muted/30">
      <div className="mx-auto flex max-w-[1600px] flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-semibold text-foreground">
          <LayoutGrid className="h-4 w-4 text-primary" />
          Kayease Themes
        </Link>
        <nav className="flex gap-6">
          <Link href="/" className="transition-colors hover:text-foreground">
            Themes
          </Link>
          <Link href="/categories" className="transition-colors hover:text-foreground">
            Categories
          </Link>
          <Link href="/contact" className="transition-colors hover:text-foreground">
            Contact
          </Link>
        </nav>
        <p>© {new Date().getFullYear()} Kayease Themes. All rights reserved.</p>
      </div>
    </footer>
  );
}
