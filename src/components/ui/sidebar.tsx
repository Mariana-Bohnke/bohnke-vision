import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "lucide-react";

const MENU_STRUCTURE = {
  "Bohnke": ["Acetato", "Resistentes", "Metal", "Clippon", "Solar"],
  "Swiss": ["Acetato", "Metal", "Clippon", "Solar"],
  "Davisory": ["Parafuso Prata", "Parafuso Dourada", "Buchas Prata", "Buchas Douradas"]
};

interface SidebarProps {
  onFilterChange: (category: string | null, subcategory: string | null) => void;
}

export function Sidebar({ onFilterChange }: SidebarProps) {
  const [session, setSession] = useState<any>(null);
  const [openCategory, setOpenCategory] = useState<string | null>("Bohnke");
  const [activeSub, setActiveSub] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    supabase.auth.onAuthStateChange((_event, session) => setSession(session));
  }, []);

  // --- LOGIN ATUALIZADO (Limpa espaços) ---
  const handleLogin = async () => {
    let email = prompt("E-mail de Admin:");
    let password = prompt("Senha:");

    if (!email || !password) return; // Se cancelar, para.

    // .trim() remove espaços antes e depois
    email = email.trim();
    password = password.trim();

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      alert("❌ Erro: " + error.message);
    } else {
      alert("✅ Sucesso! Botão (+) ativado.");
      window.location.reload();
    }
  };
  // ----------------------------------------

  const handleCategoryClick = (category: string) => {
    if (openCategory === category) {
      setOpenCategory(null);
      onFilterChange(null, null);
    } else {
      setOpenCategory(category);
      onFilterChange(category, null);
      setActiveSub(null);
    }
  };

  const handleSubClick = (e: React.MouseEvent, category: string, sub: string) => {
    e.stopPropagation();
    setActiveSub(sub);
    onFilterChange(category, sub);
  };

  return (
    <div className="h-screen w-[250px] border-r border-gray-200 bg-white flex flex-col justify-between p-10 fixed left-0 top-0 z-50">
      <div>
        <h1 className="text-3xl font-serif font-bold mb-16 tracking-[2px] text-[#333] cursor-pointer" onClick={() => {onFilterChange(null, null); setOpenCategory(null);}}>
          BOHNKE
        </h1>
        
        <nav className="space-y-6">
          <div className="text-xs font-bold uppercase tracking-[2px] mb-6 cursor-pointer text-gray-400 hover:text-black" onClick={() => {onFilterChange(null, null); setActiveSub(null);}}>
            VER TODAS
          </div>

          {Object.entries(MENU_STRUCTURE).map(([category, subcategories]) => (
            <div key={category} className="group">
              <button 
                onClick={() => handleCategoryClick(category)}
                className={`flex items-center w-full text-left text-sm tracking-[1px] transition-colors mb-2 uppercase ${openCategory === category ? 'text-[#333] font-bold' : 'text-[#888] hover:text-[#333]'}`}
              >
                {openCategory === category && <span className="w-2 h-2 rounded-full bg-black mr-3"></span>}
                {category}
              </button>

              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${openCategory === category ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="ml-5 space-y-3 mt-2 border-l border-gray-100 pl-4">
                  {subcategories.map((sub) => (
                    <button
                      key={sub}
                      onClick={(e) => handleSubClick(e, category, sub)}
                      className={`block text-[13px] w-full text-left tracking-wide transition-colors ${activeSub === sub ? 'text-black font-semibold' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </nav>
      </div>

      <div className="mt-auto">
        {session ? (
          <button onClick={() => supabase.auth.signOut()} className="text-[10px] text-gray-400 hover:text-red-500 text-left pl-5">
            SAIR (Admin Logado)
          </button>
        ) : (
          <button onClick={handleLogin} className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-gray-300 hover:text-black">
            <User size={12} /> ÁREA ADMINISTRATIVA
          </button>
        )}
      </div>
    </div>
  );
}