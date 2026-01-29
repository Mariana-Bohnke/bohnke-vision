import { motion } from "framer-motion";

interface GalleryEmptyStateProps {
  category?: string;
}

const GalleryEmptyState = ({ category }: GalleryEmptyStateProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-32 text-center"
    >
      <p className="text-sm uppercase tracking-luxury text-muted-foreground mb-2">
        Nenhuma peça encontrada
      </p>
      <p className="text-xs text-muted-foreground/60 max-w-xs">
        {category
          ? `A coleção ${category} ainda não possui armações cadastradas.`
          : "Comece adicionando a primeira peça ao catálogo."}
      </p>
    </motion.div>
  );
};

export default GalleryEmptyState;
