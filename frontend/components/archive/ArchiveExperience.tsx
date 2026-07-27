"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Lenis from "lenis";
import { MotionConfig, useReducedMotion } from "motion/react";
import { useIsDesktop } from "@/lib/motion";
import { CursorProvider } from "@/components/home/cursor";
import ArchiveHeader from "@/components/archive/ArchiveHeader";
import HeroMorph from "@/components/archive/HeroCards";
import DiscoveryBar from "@/components/archive/DiscoveryBar";
import ThemeGallery from "@/components/archive/ThemeGallery";
import IndexView from "@/components/archive/IndexView";
import FilterDrawer from "@/components/archive/FilterDrawer";
import QuickView from "@/components/archive/QuickView";
import type { Theme, Category } from "@/lib/types";

/* THE THEME ARCHIVE — /themes
   Editorial + exploratory + functional. The homepage is cinematic; this page
   is a working archive: discover → search → filter → preview → choose.

   Architecture: the catalog is fetched ONCE on the server and every
   search/filter/sort runs client-side (same rules as the backend query), so
   the grid can FLIP-animate between states instead of remounting on a server
   round-trip. The URL stays the single source of truth — filters are written
   with shallow history.replaceState (which Next syncs back into
   useSearchParams), so links stay shareable and back/forward still works. */

export type SortKey = "" | "popular" | "price-asc" | "price-desc" | "name";
export type PricingKey = "" | "free" | "premium";

export type ArchiveFilters = {
  search: string;
  category: string;
  framework: string;
  pricing: PricingKey;
  sort: SortKey;
};

export type FacetEntry = { name: string; count: number };

export const isFree = (t: Theme) => t.pricingType === "free" || t.price === 0;

const SORT_KEYS: SortKey[] = ["", "popular", "price-asc", "price-desc", "name"];

/** Mirrors the backend's GET /themes filtering so URLs mean the same thing. */
export function applyFilters(themes: Theme[], f: ArchiveFilters): Theme[] {
  let list = themes;
  if (f.category) list = list.filter((t) => t.category === f.category);
  if (f.framework) list = list.filter((t) => t.framework === f.framework);
  if (f.pricing === "free") list = list.filter(isFree);
  if (f.pricing === "premium") list = list.filter((t) => !isFree(t));
  if (f.search.trim()) {
    const q = f.search.trim().toLowerCase();
    list = list.filter((t) =>
      [t.title, t.category, t.framework, t.shortDescription, ...(t.tags ?? [])]
        .filter(Boolean)
        .some((v) => v.toLowerCase().includes(q))
    );
  }
  // the API returns newest-first, so "newest" keeps the original order
  if (f.sort === "popular")
    list = [...list].sort(
      (a, b) => (b.downloads ?? 0) + (b.views ?? 0) - ((a.downloads ?? 0) + (a.views ?? 0))
    );
  else if (f.sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
  else if (f.sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
  else if (f.sort === "name")
    list = [...list].sort((a, b) => a.title.localeCompare(b.title));
  return list;
}

export default function ArchiveExperience({
  themes,
  categories,
  total,
}: {
  themes: Theme[];
  categories: Category[];
  total: number;
}) {
  const reduced = useReducedMotion();
  const desktop = useIsDesktop();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  /* Own the scroll so the browser never restores/anchors us away from the top. */
  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
  }, []);

  /* Lenis smooth scroll — same setup as the homepage shell. We lenis.stop() and
     hold the page at the top until the user actually scrolls (or a long
     fallback), so involuntary load-time scroll (Lenis momentum / layout shifts /
     image loads) can never drag the page — and thus the morph — off the arc
     before the entrance has played. The user's first scroll releases it. */
  useEffect(() => {
    if (reduced) return;
    const html = document.documentElement;
    const lenis = new Lenis({ lerp: 0.115 });
    lenis.scrollTo(0, { immediate: true });
    lenis.stop();
    // genuinely non-scrollable so NOTHING (native anchoring, Lenis, layout
    // shifts) can move the page off the arc during the entrance
    html.style.overflow = "hidden";
    window.scrollTo(0, 0);
    let released = false;
    const release = () => {
      if (released) return;
      released = true;
      html.style.overflow = "";
      lenis.scrollTo(0, { immediate: true });
      lenis.start();
      window.removeEventListener("wheel", release);
      window.removeEventListener("touchstart", release);
      window.removeEventListener("pointerdown", release);
      window.removeEventListener("keydown", onKey);
      clearTimeout(fallback);
    };
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "].includes(e.key))
        release();
    };
    // don't listen until the intro is underway, so an early flick can't skip it
    const arm = setTimeout(() => {
      window.addEventListener("wheel", release, { passive: true });
      window.addEventListener("touchstart", release, { passive: true });
      window.addEventListener("pointerdown", release, { passive: true });
      window.addEventListener("keydown", onKey);
    }, 3200);
    const fallback = setTimeout(release, 9000);
    let raf = requestAnimationFrame(function loop(time) {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    });
    return () => {
      clearTimeout(arm);
      clearTimeout(fallback);
      window.removeEventListener("wheel", release);
      window.removeEventListener("touchstart", release);
      window.removeEventListener("pointerdown", release);
      window.removeEventListener("keydown", onKey);
      cancelAnimationFrame(raf);
      html.style.overflow = "";
      lenis.destroy();
    };
  }, [reduced]);

  /* ---- URL → state (single source of truth) ---- */
  const filters: ArchiveFilters = useMemo(() => {
    const sort = searchParams.get("sort") ?? "";
    const pricing = searchParams.get("pricing") ?? "";
    return {
      search: searchParams.get("search") ?? "",
      category: searchParams.get("category") ?? "",
      framework: searchParams.get("framework") ?? "",
      pricing: pricing === "free" || pricing === "premium" ? pricing : "",
      sort: (SORT_KEYS as string[]).includes(sort) ? (sort as SortKey) : "",
    };
  }, [searchParams]);

  /* state → URL, without a server round-trip (shallow routing) */
  const setFilters = (patch: Partial<ArchiveFilters>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(patch).forEach(([k, v]) => {
      if (v) params.set(k, v);
      else params.delete(k);
    });
    params.delete("page"); // legacy param from the old paginated page
    const qs = params.toString();
    window.history.replaceState(null, "", qs ? `${pathname}?${qs}` : pathname);
  };
  const clearAll = () =>
    setFilters({ search: "", category: "", framework: "", pricing: "", sort: filters.sort });

  /* ---- derived, real data ---- */
  const categoryFacets: FacetEntry[] = useMemo(
    () =>
      categories
        .map((c) => ({
          name: c.name,
          count: themes.filter((t) => t.category === c.name).length,
        }))
        .filter((c) => c.count > 0),
    [categories, themes]
  );
  const frameworkFacets: FacetEntry[] = useMemo(() => {
    const counts = new Map<string, number>();
    themes.forEach((t) => {
      if (t.framework) counts.set(t.framework, (counts.get(t.framework) ?? 0) + 1);
    });
    return [...counts.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [themes]);

  const filtered = useMemo(() => applyFilters(themes, filters), [themes, filters]);

  /* ---- view mode (grid / index) — session preference, not URL state ---- */
  const [view, setViewState] = useState<"grid" | "index">("grid");
  useEffect(() => {
    const saved = sessionStorage.getItem("kayease-archive-view");
    if (saved === "index") setViewState("index");
  }, []);
  const setView = (v: "grid" | "index") => {
    setViewState(v);
    sessionStorage.setItem("kayease-archive-view", v);
  };

  /* ---- overlays ---- */
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [quickView, setQuickView] = useState<Theme | null>(null);

  const galleryRef = useRef<HTMLDivElement>(null);
  const scrollToGallery = () =>
    galleryRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const activeFilterCount =
    (filters.category ? 1 : 0) + (filters.framework ? 1 : 0) + (filters.pricing ? 1 : 0);

  /* ---- hero → grid morph: only on the pristine, unfiltered grid, and ONLY on
     desktop where the HeroMorph overlay actually runs. On mobile/tablet the
     overlay renders nothing, so gating here is essential — otherwise morphN>0
     would hide the first cards while nothing ever flies in to reveal them. ---- */
  const galleryGridRef = useRef<HTMLUListElement>(null);
  const [landed, setLanded] = useState(false);
  const morphActive =
    desktop &&
    !reduced &&
    view === "grid" &&
    activeFilterCount === 0 &&
    filters.search.trim() === "" &&
    filters.sort === "" &&
    filtered.length > 0;
  const morphN = morphActive ? Math.min(9, filtered.length) : 0;

  return (
    <MotionConfig reducedMotion="user">
      <CursorProvider>
        <div className="editorial relative overflow-x-clip">
          {/* paints behind the transparent navbar + under overscroll */}
          <div aria-hidden className="fixed inset-0 -z-10 bg-(--ed-bg)" />
          {/* the same near-invisible film grain as the homepage */}
          <div
            aria-hidden
            className="pointer-events-none fixed inset-0 z-70 opacity-[0.022]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            }}
          />

          <ArchiveHeader
            total={total || themes.length}
            themes={themes}
            onExplore={scrollToGallery}
          />

          <DiscoveryBar
            filters={filters}
            setFilters={setFilters}
            categories={categoryFacets}
            frameworks={frameworkFacets}
            totalCount={themes.length}
            activeFilterCount={activeFilterCount}
            onOpenFilters={() => setDrawerOpen(true)}
          />

          {/* the covers fly from the hero arc into the real gallery cells */}
          <HeroMorph
            themes={filtered}
            count={morphN}
            gridRef={galleryGridRef}
            active={morphActive}
            onLanded={setLanded}
          />

          <div ref={galleryRef} className="scroll-mt-36">
            {view === "grid" ? (
              <ThemeGallery
                themes={filtered}
                allThemes={themes}
                filters={filters}
                setFilters={setFilters}
                clearAll={clearAll}
                view={view}
                setView={setView}
                onQuickView={setQuickView}
                gridRef={galleryGridRef}
                morphCount={morphN}
                morphLanded={landed}
              />
            ) : (
              <IndexView
                themes={filtered}
                filters={filters}
                setFilters={setFilters}
                clearAll={clearAll}
                view={view}
                setView={setView}
              />
            )}
          </div>

          <FilterDrawer
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            filters={filters}
            setFilters={setFilters}
            clearAll={clearAll}
            categories={categoryFacets}
            frameworks={frameworkFacets}
            resultCount={filtered.length}
          />

          <QuickView theme={quickView} onClose={() => setQuickView(null)} />
        </div>
      </CursorProvider>
    </MotionConfig>
  );
}
