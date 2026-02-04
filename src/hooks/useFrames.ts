import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export interface Frame {
  id: string;
  reference_code: string;
  image_url: string;
  category: string;
  subcategory: string;
  quantity: number; // Novo campo de quantidade
  created_at: string;
}

export function useFrames() {
  const [data, setData] = useState<Frame[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Função para recarregar a lista sem dar F5 na página
  const refresh = async () => {
    try {
      const { data: frames, error } = await supabase
        .from("frames")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setData(frames as Frame[]);
    } catch (error) {
      console.error("Erro ao buscar óculos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  return { data, isLoading, refresh };
}