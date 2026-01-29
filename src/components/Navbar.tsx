import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface NavbarProps {
  onNewClick: () => void;
}

const Navbar = ({ onNewClick }: NavbarProps) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="font-display text-2xl font-semibold tracking-tight">
            Bohnke
          </h1>
          <span className="text-sm text-muted-foreground">Catalog</span>
        </div>
        
        <Button onClick={onNewClick} className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Cadastro
        </Button>
      </div>
    </header>
  );
};

export default Navbar;
