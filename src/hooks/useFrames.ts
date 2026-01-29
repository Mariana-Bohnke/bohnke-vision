import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Frame {
  id: string;
  created_at: string;
  reference_code: string;
  image_url: string;
  category: string;
}

export const useFrames = () => {
  return useQuery({
    queryKey: ["frames"],
    queryFn: async (): Promise<Frame[]> => {
      const { data, error } = await supabase
        .from("frames")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      return data || [];
    },
  });
};

export const useFramesByCategory = (frames: Frame[], category: string | null) => {
  if (!category || category === "all") {
    return frames;
  }
  return frames.filter((frame) => frame.category === category);
};
