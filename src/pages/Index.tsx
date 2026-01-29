import { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/Navbar";
import FrameGrid from "@/components/FrameGrid";
import AddFrameDialog from "@/components/AddFrameDialog";
import { useFrames, useFramesByCategory } from "@/hooks/useFrames";

const categories = ["all", "Swiss", "Davisory", "Bohnke"] as const;
const categoryLabels: Record<string, string> = {
  all: "Todos",
  Swiss: "Swiss",
  Davisory: "Davisory",
  Bohnke: "Bohnke",
};

const Index = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("all");
  
  const { data: frames = [], isLoading, isError } = useFrames();
  
  const filteredFrames = useMemo(
    () => useFramesByCategory(frames, activeTab),
    [frames, activeTab]
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
      <Navbar onNewClick={() => setIsDialogOpen(true)} />
      
      <main className="container py-8">
        <div className="mb-8">
          <h2 className="font-display text-3xl font-semibold text-foreground">
            Catálogo de Armações
          </h2>
          <p className="mt-1 text-muted-foreground">
            {frames.length} {frames.length === 1 ? "referência" : "referências"} cadastradas
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6 w-full justify-start border-b bg-transparent p-0">
            {categories.map((cat) => (
              <TabsTrigger
                key={cat}
                value={cat}
                className="relative rounded-none border-b-2 border-transparent bg-transparent px-4 pb-3 pt-2 font-medium text-muted-foreground transition-none data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
              >
                {categoryLabels[cat]}
                <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs">
                  {categoryCounts[cat]}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>

          {isLoading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="aspect-[4/3] w-full" />
                  <Skeleton className="h-5 w-24" />
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="py-16 text-center">
              <p className="text-destructive">Erro ao carregar o catálogo.</p>
            </div>
          ) : (
            categories.map((cat) => (
              <TabsContent key={cat} value={cat} className="mt-0">
                <FrameGrid
                  frames={cat === "all" ? frames : filteredFrames}
                  category={cat === "all" ? undefined : cat}
                />
              </TabsContent>
            ))
          )}
        </Tabs>
      </main>

      <AddFrameDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
};

export default Index;
