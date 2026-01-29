import FrameCard from "./FrameCard";
import EmptyState from "./EmptyState";

interface Frame {
  id: string;
  reference_code: string;
  image_url: string;
  category: string;
}

interface FrameGridProps {
  frames: Frame[];
  category?: string;
}

const FrameGrid = ({ frames, category }: FrameGridProps) => {
  if (frames.length === 0) {
    return <EmptyState category={category} />;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {frames.map((frame, index) => (
        <div
          key={frame.id}
          className="animate-fade-in"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <FrameCard
            referenceCode={frame.reference_code}
            imageUrl={frame.image_url}
            category={frame.category}
          />
        </div>
      ))}
    </div>
  );
};

export default FrameGrid;
