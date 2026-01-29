import { AnimatePresence, motion } from "framer-motion";
import GalleryItem from "./GalleryItem";
import GalleryEmptyState from "./GalleryEmptyState";

interface Frame {
  id: string;
  reference_code: string;
  image_url: string;
  category: string;
}

interface GalleryGridProps {
  frames: Frame[];
  category?: string;
}

const GalleryGrid = ({ frames, category }: GalleryGridProps) => {
  if (frames.length === 0) {
    return <GalleryEmptyState category={category} />;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={category || "all"}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-1 gap-12 md:grid-cols-2 xl:grid-cols-3"
      >
        {frames.map((frame, index) => (
          <GalleryItem
            key={frame.id}
            referenceCode={frame.reference_code}
            imageUrl={frame.image_url}
            index={index}
          />
        ))}
      </motion.div>
    </AnimatePresence>
  );
};

export default GalleryGrid;
