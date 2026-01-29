import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface GallerySidebarProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  onNewClick: () => void;
  categoryCounts: Record<string, number>;
}

const categoryLabels: Record<string, string> = {
  all: "All",
  Swiss: "Swiss",
  Davisory: "Davisory",
  Bohnke: "Bohnke",
};

const GallerySidebar = ({
  categories,
  activeCategory,
  onCategoryChange,
  onNewClick,
  categoryCounts,
}: GallerySidebarProps) => {
  return (
    <aside className="fixed left-0 top-0 h-screen w-[22%] min-w-[200px] max-w-[280px] flex flex-col justify-between border-r border-border bg-background px-8 py-12">
      {/* Logo */}
      <div>
        <h1 className="font-display text-2xl font-medium tracking-luxury text-foreground mb-16">
          BOHNKE
        </h1>

        {/* Category Menu */}
        <nav className="space-y-1">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={cn(
                "group flex w-full items-center gap-3 py-3 text-sm font-normal transition-colors duration-300",
                activeCategory === category
                  ? "text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {/* Active indicator line */}
              <span
                className={cn(
                  "h-4 w-px transition-all duration-300",
                  activeCategory === category
                    ? "bg-foreground"
                    : "bg-transparent group-hover:bg-muted-foreground/50"
                )}
              />
              <span className="tracking-wide uppercase text-xs">
                {categoryLabels[category]}
              </span>
              <span className="text-xs text-muted-foreground/60">
                ({categoryCounts[category] || 0})
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Discrete Action Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onNewClick}
        className="justify-start gap-2 text-muted-foreground hover:text-foreground text-xs uppercase tracking-wider font-normal px-0"
      >
        <Plus className="h-3 w-3" />
        Novo Cadastro
      </Button>
    </aside>
  );
};

export default GallerySidebar;
