import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload, Loader2 } from "lucide-react";

interface AddFrameDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const categories = ["Swiss", "Davisory", "Bohnke"] as const;

const AddFrameDialog = ({ open, onOpenChange }: AddFrameDialogProps) => {
  const [referenceCode, setReferenceCode] = useState("");
  const [category, setCategory] = useState<string>("Swiss");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const resetForm = () => {
    setReferenceCode("");
    setCategory("Swiss");
    setFile(null);
    setPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!referenceCode.trim()) {
      toast({
        title: "Erro",
        description: "O código de referência é obrigatório.",
        variant: "destructive",
      });
      return;
    }

    if (!file) {
      toast({
        title: "Erro",
        description: "Selecione uma imagem da armação.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Upload image to storage
      const timestamp = Date.now();
      const fileExt = file.name.split('.').pop();
      const filePath = `${category}/${referenceCode}-${timestamp}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from("frame-images")
        .upload(filePath, file);

      if (uploadError) {
        throw new Error("Erro ao salvar imagem: " + uploadError.message);
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("frame-images")
        .getPublicUrl(filePath);

      // Insert frame record
      const { error: insertError } = await supabase
        .from("frames")
        .insert({
          reference_code: referenceCode.trim(),
          category,
          image_url: publicUrl,
        });

      if (insertError) {
        // If insert fails, try to delete the uploaded image
        await supabase.storage.from("frame-images").remove([filePath]);
        
        if (insertError.code === "23505") {
          throw new Error("Este código já está cadastrado.");
        }
        throw new Error("Erro ao cadastrar armação: " + insertError.message);
      }

      toast({
        title: "Sucesso!",
        description: `Armação ${referenceCode} cadastrada com sucesso.`,
      });

      queryClient.invalidateQueries({ queryKey: ["frames"] });
      resetForm();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-0 shadow-2xl">
        <DialogHeader className="pb-6">
          <DialogTitle className="font-display text-xl font-normal tracking-wide">
            Nova Referência
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2">
            <Label 
              htmlFor="reference" 
              className="text-xs uppercase tracking-luxury text-muted-foreground"
            >
              Código de Referência
            </Label>
            <Input
              id="reference"
              value={referenceCode}
              onChange={(e) => setReferenceCode(e.target.value)}
              placeholder="BK-2024-001"
              disabled={isLoading}
              className="border-0 border-b border-border rounded-none bg-transparent px-0 focus-visible:ring-0 focus-visible:border-foreground transition-colors"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-xs uppercase tracking-luxury text-muted-foreground">
              Categoria
            </Label>
            <RadioGroup
              value={category}
              onValueChange={setCategory}
              className="flex gap-6"
              disabled={isLoading}
            >
              {categories.map((cat) => (
                <div key={cat} className="flex items-center space-x-2">
                  <RadioGroupItem value={cat} id={cat} className="border-muted-foreground" />
                  <Label 
                    htmlFor={cat} 
                    className="text-sm font-normal cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {cat}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label className="text-xs uppercase tracking-luxury text-muted-foreground">
              Imagem
            </Label>
            <div className="relative">
              {preview ? (
                <div className="relative aspect-[4/3] overflow-hidden bg-secondary/50">
                  <img
                    src={preview}
                    alt="Preview"
                    className="h-full w-full object-contain p-4"
                    style={{ mixBlendMode: "multiply" }}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute bottom-3 right-3 text-xs uppercase tracking-wider"
                    onClick={() => {
                      setFile(null);
                      setPreview(null);
                    }}
                    disabled={isLoading}
                  >
                    Alterar
                  </Button>
                </div>
              ) : (
                <label className="flex aspect-[4/3] cursor-pointer flex-col items-center justify-center bg-secondary/30 transition-colors hover:bg-secondary/50">
                  <Upload className="mb-3 h-6 w-6 text-muted-foreground/50" />
                  <span className="text-xs uppercase tracking-luxury text-muted-foreground">
                    Clique para selecionar
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={isLoading}
                  />
                </label>
              )}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="ghost"
              className="flex-1 text-xs uppercase tracking-wider font-normal"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="flex-1 text-xs uppercase tracking-wider font-normal" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                  Salvando
                </>
              ) : (
                "Cadastrar"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddFrameDialog;
