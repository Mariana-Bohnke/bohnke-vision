import { useState, useMemo, useEffect } from "react";
import { Sidebar } from "../components/ui/sidebar"; 
import { useFrames } from "../hooks/useFrames";
import { Skeleton } from "../components/ui/skeleton";
import AddFrameDialog from "../components/AddFrameDialog"; 
import { supabase } from "../lib/supabase";
import { Plus, Trash2, Ban, SearchX, MessageCircle, Menu, X } from "lucide-react";

import BannerImage from '../assets/fotocatalogo.jpeg';

const Index = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>("Bohnke");
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [session, setSession] = useState<any>(null);
  
  // Controle do menu no celular
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const { data: frames = [], isLoading, refresh } = useFrames();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
  }, []);
  
  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); 
    if (confirm("⚠️ Tem certeza? Essa ação não tem volta.")) {
      const { error } = await supabase.from('frames').delete().eq('id', id);
      if (error) alert("Erro: " + error.message);
      else refresh();
    }
  };

  const handleSoldOut = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Marcar como ESGOTADO?")) {
      const { error } = await supabase.from('frames').update({ quantity: 0 }).eq('id', id);
      if (error) alert("Erro: " + error.message);
      else refresh();
    }
  };

  const openWhatsApp = (e: React.MouseEvent, frame: any) => {
    e.stopPropagation(); 
    const phone = "5584996386557"; // SEU NÚMERO AQUI
    const message = `Olá! Gostaria de saber mais informações e valores do modelo *${frame.reference_code}* que vi no catálogo.`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
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
      
      {/* =========================================================
          BARRA SUPERIOR MOBILE (Só aparece no celular)
          ========================================================= */}
      <div className="md:hidden fixed top-0 left-0 w-full bg-white z-[60] border-b border-gray-100 px-6 py-4 flex justify-between items-center shadow-sm">
        <span className="font-serif text-xl tracking-widest font-bold">BOHNKE</span>
        <button onClick={() => setIsMobileMenuOpen(true)}>
          <Menu size={24} />
        </button>
      </div>

      {/* =========================================================
          SIDEBAR DESKTOP (Escondida no celular, visível no PC)
          ========================================================= */}
      <div className="hidden md:block">
        <Sidebar onFilterChange={(cat, sub) => { setActiveCategory(cat); setActiveSubcategory(sub); }} />
      </div>

      {/* =========================================================
          SIDEBAR MOBILE (Gaveta que abre ao clicar no menu)
          ========================================================= */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-[70] flex">
          {/* Fundo escuro */}
          <div className="absolute inset-0 bg-black/60" onClick={() => setIsMobileMenuOpen(false)}></div>
          
          {/* Menu Lateral em si */}
          <div className="relative w-[250px] bg-white h-full shadow-2xl">
            <button 
              onClick={() => setIsMobileMenuOpen(false)} 
              className="absolute top-4 right-4 z-[80] p-2 bg-gray-100 rounded-full hover:bg-gray-200"
            >
              <X size={20} />
            </button>
            <div className="relative z-[75] bg-white h-full w-full pt-16 overflow-hidden">
              <Sidebar onFilterChange={(cat, sub) => { 
                setActiveCategory(cat); 
                setActiveSubcategory(sub); 
                setIsMobileMenuOpen(false); 
              }} />
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          CONTEÚDO PRINCIPAL
          ========================================================= */}
      {/* CORREÇÃO: ml-0 no celular e ml-[250px] no PC para alinhar certinho! */}
      <main className="flex-1 w-full ml-0 md:ml-[250px] mt-[65px] md:mt-0 relative">
        
        {/* BANNER PRINCIPAL (HERO) */}
        {!activeSubcategory && (
          <div className="relative w-full h-[40vh] md:h-[55vh] min-h-[300px] md:min-h-[400px] overflow-hidden group bg-black">
            <img 
              src={BannerImage} 
              alt="Nova Coleção Bohnke" 
              className="w-full h-full object-cover object-center opacity-90 transition-transform duration-1000 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex flex-col justify-center px-8 md:px-24">
              <h1 className="text-white text-3xl md:text-6xl font-serif mb-4 max-w-xl leading-tight drop-shadow-lg">
                Revele o seu brilho
              </h1>
              <p className="text-white/90 text-xs md:text-base font-light tracking-wide max-w-md mb-6 md:mb-8 drop-shadow-md">
                Descubra a sua essência com a nova coleção de óculos Bohnke Vision. Design, conforto e sofisticação.
              </p>
              <button 
                onClick={() => window.scrollTo({ top: window.innerHeight * 0.40, behavior: 'smooth' })}
                className="bg-black text-white border border-black px-6 py-2 md:px-8 md:py-3 w-fit text-[10px] md:text-xs font-bold tracking-[2px] uppercase hover:bg-transparent hover:text-white hover:border-white transition-all duration-300"
              >
                Conheça a Coleção
              </button>
            </div>
          </div>
        )}

        {/* ÁREA DO CATÁLOGO */}
        <div className="p-6 md:p-[80px]">
          
          <div className="mb-8 md:mb-12 flex justify-between items-end border-b border-gray-100 pb-4 md:pb-6">
            <div>
              <h2 className="font-serif text-[24px] md:text-[32px] text-black mb-1">
                {activeSubcategory ? `${activeSubcategory}` : "Shop the trend"}
              </h2>
            </div>
            <span className="text-[10px] md:text-[12px] text-gray-400 tracking-[1px] uppercase">
              {isLoading ? "..." : `${filteredFrames.length} Modelos`}
            </span>
          </div>

          {isLoading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
               {[1,2,3,4].map(i => <Skeleton key={i} className="h-[350px] w-full rounded-sm" />)}
             </div>
          ) : (
            <>
              {filteredFrames.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-gray-300">
                  <SearchX size={48} className="mb-4 opacity-30"/>
                  <p className="text-xs tracking-[2px] uppercase">Nenhum modelo encontrado</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
                {filteredFrames.map((frame) => {
                  const isSoldOut = frame.quantity === 0;

                  return (
                    <div key={frame.id} className="group relative flex flex-col">
                      
                      {session && (
                        <div className="absolute top-2 right-2 z-30 flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300">
                          {!isSoldOut && (
                            <button 
                              onClick={(e) => handleSoldOut(frame.id, e)}
                              className="p-2 bg-white text-yellow-600 rounded-full shadow hover:scale-110" title="Esgotar"
                            >
                              <Ban size={14} />
                            </button>
                          )}
                          <button 
                            onClick={(e) => handleDelete(frame.id, e)}
                            className="p-2 bg-white text-red-600 rounded-full shadow hover:scale-110" title="Excluir"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )}

                      <div className="relative w-full aspect-[4/3] mb-4 overflow-hidden bg-[#F4F4F4] flex items-center justify-center cursor-pointer">
                        <img 
                          src={frame.image_url} 
                          alt={frame.reference_code} 
                          className={`w-full h-full object-cover object-center transition-transform duration-1000 group-hover:scale-110 ${isSoldOut ? 'grayscale opacity-30' : ''}`}
                        />
                        
                        <div className="absolute top-4 left-4">
                          {isSoldOut ? (
                            <span className="bg-black text-white px-3 py-1 text-[9px] font-bold tracking-[2px] uppercase">
                              Esgotado
                            </span>
                          ) : (
                            <span className="bg-white text-black px-3 py-1 text-[9px] tracking-[1px] uppercase shadow-sm flex items-center gap-1 rounded-full">
                              🔥 Na moda agora
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="text-left">
                        <h3 className="text-[14px] text-black font-medium tracking-wide">
                          {frame.reference_code}
                        </h3>
                        
                        <p className="text-[11px] text-gray-500 uppercase tracking-[1px] mt-1 mb-4">
                          Sob Consulta
                        </p>

                        {!session && !isSoldOut && (
                          <button 
                            onClick={(e) => openWhatsApp(e, frame)}
                            className="flex items-center justify-center gap-2 w-full text-[11px] font-bold uppercase tracking-[1.5px] text-black border border-black py-2.5 hover:bg-black hover:text-white transition-all duration-300"
                          >
                            <MessageCircle size={14} />
                            Consultar
                          </button>
                        )}

                        {session && (
                          <div className={`text-[10px] font-bold uppercase tracking-[1px] mt-2 ${isSoldOut ? 'text-red-500' : 'text-blue-600'}`}>
                             {isSoldOut ? "SEM ESTOQUE" : `${frame.quantity} EM ESTOQUE`}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </main>
      
      {session && (
        <button 
          onClick={() => setIsDialogOpen(true)} 
          className="fixed bottom-8 right-8 bg-black text-white h-14 w-14 rounded-full shadow-2xl hover:scale-110 transition-all z-50 flex items-center justify-center group"
        >
          <Plus className="group-hover:rotate-90 transition-transform duration-300" />
        </button>
      )}
      <AddFrameDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
};

export default Index;