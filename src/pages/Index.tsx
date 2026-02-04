import { useState, useMemo } from "react";
import { Sidebar } from "@/components/ui/sidebar";
import { useFrames } from "@/hooks/useFrames";
import { Skeleton } from "@/components/ui/skeleton";
import AddFrameDialog from "@/components/AddFrameDialog";
import { supabase } from "@/lib/supabase";
import { Plus, Trash2, Ban } from "lucide-react"; // Importei o ícone 'Ban' para o botão de esgotar

const Index = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>("Bohnke");
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [session, setSession] = useState<any>(null);
  
  const { data: frames = [], isLoading, refresh } = useFrames();

  useState(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
  });
  
  // Função para Deletar
  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); 
    if (confirm("⚠️ Tem certeza que deseja EXCLUIR essa peça definitivamente?")) {
      const { error } = await supabase.from('frames').delete().eq('id', id);
      if (error) alert("Erro ao excluir: " + error.message);
      else refresh();
    }
  };

  // Função Nova: Marcar como Esgotado
  const handleSoldOut = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Deseja marcar esta peça como ESGOTADA (Estoque = 0)?")) {
      const { error } = await supabase.from('frames').update({ quantity: 0 }).eq('id', id);
      if (error) alert("Erro ao atualizar: " + error.message);
      else refresh(); // Atualiza a tela na hora
    }
  };

  const filteredFrames = useMemo(() => {
    return frames.filter((frame) => {
      if (!activeCategory) return true;
      const categoryMatch = frame.category === activeCategory;
      if (activeSubcategory) return categoryMatch && frame.subcategory === activeSubcategory;
      return categoryMatch;
    });
  }, [frames, activeCategory, activeSubcategory]);

  return (
    <div className="min-h-screen bg-white font-sans flex">
      <Sidebar onFilterChange={(cat, sub) => { setActiveCategory(cat); setActiveSubcategory(sub); }} />
      
      <main className="flex-1 ml-[250px] p-[60px]">
        <div className="mb-10 animate-fade-in">
          <h1 className="font-serif text-[32px] text-[#333] mb-2">Coleção</h1>
          <p className="text-[14px] text-[#888] tracking-[1px] uppercase">
            {isLoading ? "Carregando..." : `${filteredFrames.length} PEÇA${filteredFrames.length !== 1 ? 'S' : ''}`}
          </p>
        </div>

        {isLoading ? (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[40px]">
             {[1,2,3].map(i => <Skeleton key={i} className="h-64 w-full" />)}
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[40px]">
            {filteredFrames.map((frame) => {
              const isSoldOut = frame.quantity === 0;

              return (
                <div key={frame.id} className="group text-center cursor-pointer transition-all duration-500 relative">
                  
                  {/* BOTOES DE AÇÃO (Só aparecem para Admin) */}
                  {session && (
                    <div className="absolute top-2 right-2 z-20 flex gap-2">
                      {/* Botão de Esgotar (Se já não estiver esgotado) */}
                      {!isSoldOut && (
                        <button 
                          onClick={(e) => handleSoldOut(frame.id, e)}
                          className="p-2 bg-yellow-400 text-black rounded-full hover:bg-yellow-500 shadow-md transition-all hover:scale-110"
                          title="Marcar como ESGOTADO"
                        >
                          <Ban size={16} />
                        </button>
                      )}

                      {/* Botão de Excluir (Agora SEMPRE visível e Vermelho) */}
                      <button 
                        onClick={(e) => handleDelete(frame.id, e)}
                        className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-md transition-all hover:scale-110"
                        title="Excluir peça"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}

                  <div className="relative w-full aspect-[4/3] mb-5 overflow-hidden">
                    <img 
                      src={frame.image_url} 
                      alt={frame.reference_code} 
                      className={`w-full h-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-105 ${isSoldOut ? 'grayscale opacity-50' : ''}`}
                      style={{ filter: isSoldOut ? "grayscale(100%)" : "drop-shadow(0 10px 15px rgba(0,0,0,0.08))" }} 
                    />
                    
                    {isSoldOut && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="bg-black text-white px-3 py-1 text-[10px] font-bold tracking-[2px] uppercase">ESGOTADO</span>
                      </div>
                    )}
                  </div>

                  <p className="text-[14px] text-[#888] tracking-[1px] uppercase group-hover:text-[#333] transition-colors">
                    REF. {frame.reference_code}
                  </p>
                  
                  {session && (
                     <p className={`text-[10px] font-bold mt-1 ${isSoldOut ? 'text-red-500' : 'text-blue-600'}`}>
                       {isSoldOut ? "SEM ESTOQUE" : `ESTOQUE: ${frame.quantity}`}
                     </p>
                  )}
                  
                  {frame.subcategory && !session && (
                    <p className="text-[10px] text-gray-300 mt-1 uppercase tracking-widest">{frame.subcategory}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
      
      {session && (
        <button onClick={() => setIsDialogOpen(true)} className="fixed bottom-10 right-10 bg-black text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform z-50">
          <Plus />
        </button>
      )}
      <AddFrameDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
};

export default Index;