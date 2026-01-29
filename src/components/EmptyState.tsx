import { Glasses } from "lucide-react";

interface EmptyStateProps {
  category?: string;
}

const EmptyState = ({ category }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
      <div className="mb-4 rounded-full bg-muted p-4">
        <Glasses className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="font-display text-lg font-medium text-foreground">
        Nenhuma armação cadastrada
      </h3>
      <p className="mt-1 text-sm text-muted-foreground max-w-xs">
        {category 
          ? `A coleção ${category} ainda não possui armações.`
          : "Comece cadastrando a primeira armação do catálogo."
        }
      </p>
    </div>
  );
};

export default EmptyState;
