import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase";
import { Loader2, Upload } from "lucide-react";

const MENU_STRUCTURE: Record<string, string[]> = {
  "Bohnke": ["Acetato", "Resistentes", "Metal", "Clippon", "Solar"],
  "Swiss": ["Acetato", "Metal", "Clippon", "Solar"],
  "Davisory": ["Parafuso Prata", "Parafuso Dourada", "Buchas Prata", "Buchas Douradas"]
};

interface AddFrameDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddFrameDialog({ open, onOpenChange }: AddFrameDialogProps) {
  const [loading, setLoading] = useState(false);
  const [reference, setReference] = useState("");
  const [quantity, setQuantity] = useState("1"); // Começa com 1 peça
  const [category, setCategory] = useState<string>("Bohnke");
  const [subcategory, setSubcategory] = useState<string>("");
  // ⚠️ NOVO: Estado para guardar o gênero selecionado
  const [gender, setGender] = useState<string>("Feminino"); 
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    setSubcategory(MENU_STRUCTURE[category]?.[0] || "");
  }, [category]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !reference) return alert("Preencha referência e foto!");
    setLoading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${category}/${reference.replace(/\s+/g, '-')}-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage.from('frame-images').upload(fileName, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('frame-images').getPublicUrl(fileName);

      const { error: dbError } = await supabase.from('frames').insert({
          reference_code: reference,
          category,
          subcategory,
          image_url: publicUrl,
          quantity: parseInt(quantity) || 1,
          gender: gender // ⚠️ NOVO: Enviando o gênero para o banco de dados
        });

      if (dbError) throw dbError;

      alert("Cadastrado com sucesso!");
      onOpenChange(false);
      window.location.reload();

    } catch (error: any) {
      alert("Erro: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white p-0 overflow-hidden border-none shadow-2xl">
        <div className="bg-black p-6 text-center">
          <DialogTitle className="text-white font-serif text-xl tracking-widest uppercase">Novo Item</DialogTitle>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          <div className="flex justify-center mb-4">
            <label className="relative w-full h-40 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-black transition-colors bg-gray-50">
              {previewUrl ? <img src={previewUrl} className="h-full w-full object-contain p-2" /> : <Upload className="h-8 w-8 text-gray-300" />}
              <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="text-[10px] uppercase font-bold text-gray-400 block">Código</label>
                <input value={reference} onChange={(e) => setReference(e.target.value)} className="w-full border-b py-2 font-serif uppercase focus:outline-none focus:border-black" placeholder="EX: BK-001"/>
            </div>
            <div>
                <label className="text-[10px] uppercase font-bold text-gray-400 block">Qtd. Peças</label>
                <input type="number" min="0" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="w-full border-b py-2 font-serif focus:outline-none focus:border-black"/>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase font-bold text-gray-400 block">Coleção</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-transparent border-b py-2 text-sm font-medium focus:outline-none">
                {Object.keys(MENU_STRUCTURE).map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-gray-400 block">Tipo</label>
              <select value={subcategory} onChange={(e) => setSubcategory(e.target.value)} className="w-full bg-transparent border-b py-2 text-sm font-medium focus:outline-none">
                {MENU_STRUCTURE[category]?.map(sub => <option key={sub} value={sub}>{sub}</option>)}
              </select>
            </div>
          </div>

          {/* ⚠️ NOVO: Campo de Gênero */}
          <div>
            <label className="text-[10px] uppercase font-bold text-gray-400 block">Gênero</label>
            <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full bg-transparent border-b py-2 text-sm font-medium focus:outline-none">
              <option value="Feminino">Feminino</option>
              <option value="Masculino">Masculino</option>
              <option value="Unissex">Unissex</option>
            </select>
          </div>

          <button disabled={loading} type="submit" className="w-full bg-black text-white h-12 flex items-center justify-center text-xs font-bold tracking-[2px] uppercase hover:bg-gray-800 transition-colors mt-4">
            {loading ? <Loader2 className="animate-spin" /> : "SALVAR"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}