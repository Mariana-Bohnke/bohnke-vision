import { motion } from "framer-motion";

interface GalleryItemProps {
  referenceCode: string;
  imageUrl: string;
  index: number;
}

const GalleryItem = ({ referenceCode, imageUrl, index }: GalleryItemProps) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="group"
    >
      {/* Image Container - Flat Design */}
      <div className="relative aspect-[4/3] overflow-hidden bg-secondary/50 mb-4">
        <img
          src={imageUrl}
          alt={`Armação ${referenceCode}`}
          className="h-full w-full object-contain p-6 transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
          style={{ mixBlendMode: "multiply" }}
        />
      </div>

      {/* Reference Code - Minimalist Caption */}
      <p className="text-xs uppercase tracking-luxury text-muted-foreground font-normal">
        Ref. {referenceCode}
      </p>
    </motion.article>
  );
};

export default GalleryItem;
