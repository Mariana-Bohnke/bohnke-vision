import { useState, useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import GallerySidebar from "@/components/GallerySidebar";
import GalleryGrid from "@/components/GalleryGrid";
import AddFrameDialog from "@/components/AddFrameDialog";
import { useFrames, useFramesByCategory } from "@/hooks/useFrames";

const categories = ["all", "Swiss", "Davisory", "Bohnke"] as const;

const Index = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const { data: frames = [], isLoading, isError } = useFrames();

  const filteredFrames = useMemo(
    () => useFramesByCategory(frames, activeCategory),
    [frames, activeCategory]
  );

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: frames.length };
    categories.slice(1).forEach((cat) => {
      counts[cat] = frames.filter((f) => f.category === cat).length;
    });
    return counts;
  }, [frames]);

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed Sidebar */}
      <GallerySidebar
        categories={[...categories]}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        onNewClick={() => setIsDialogOpen(true)}
        categoryCounts={categoryCounts}
      />

      {/* Main Gallery Area */}
      <main className="ml-[22%] min-w-0 px-12 py-16 lg:px-16 xl:px-20">
        {/* Page Header */}
        <header className="mb-16">
          <h2 className="font-display text-3xl font-normal tracking-wide text-foreground mb-2">
            Coleção
          </h2>
          <p className="text-xs uppercase tracking-luxury text-muted-foreground">
            {frames.length} {frames.length === 1 ? "peça" : "peças"}
          </p>
        </header>

        {/* Content */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-[4/3] w-full bg-secondary/50" />
                <Skeleton className="h-3 w-24 bg-secondary/50" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="py-32 text-center">
            <p className="text-sm uppercase tracking-luxury text-destructive">
              Erro ao carregar o catálogo
            </p>
          </div>
        ) : (
          <GalleryGrid
            frames={activeCategory === "all" ? frames : filteredFrames}
            category={activeCategory === "all" ? undefined : activeCategory}
          />
        )}
      </main>

      <AddFrameDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
};

export default Index;
