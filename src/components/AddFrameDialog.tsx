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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            Cadastrar Nova Armação
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="reference">Código de Referência</Label>
            <Input
              id="reference"
              value={referenceCode}
              onChange={(e) => setReferenceCode(e.target.value)}
              placeholder="Ex: BK-2024-001"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-3">
            <Label>Categoria</Label>
            <RadioGroup
              value={category}
              onValueChange={setCategory}
              className="flex gap-4"
              disabled={isLoading}
            >
              {categories.map((cat) => (
                <div key={cat} className="flex items-center space-x-2">
                  <RadioGroupItem value={cat} id={cat} />
                  <Label htmlFor={cat} className="font-normal cursor-pointer">
                    {cat}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Foto da Armação</Label>
            <div className="relative">
              {preview ? (
                <div className="relative aspect-[4/3] overflow-hidden rounded-lg border bg-muted">
                  <img
                    src={preview}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="absolute bottom-2 right-2"
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
                <label className="flex aspect-[4/3] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 transition-colors hover:border-muted-foreground/50 hover:bg-muted">
                  <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
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

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
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
