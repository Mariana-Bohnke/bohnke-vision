import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface FrameCardProps {
  referenceCode: string;
  imageUrl: string;
  category: string;
}

const categoryColors: Record<string, string> = {
  Swiss: "bg-primary text-primary-foreground",
  Davisory: "bg-secondary text-secondary-foreground",
  Bohnke: "bg-accent text-accent-foreground",
};

const FrameCard = ({ referenceCode, imageUrl, category }: FrameCardProps) => {
  return (
    <Card className="group overflow-hidden card-shadow border-0 bg-card">
      <CardHeader className="p-3 pb-0">
        <Badge 
          variant="secondary" 
          className={`w-fit text-xs font-medium ${categoryColors[category] || ''}`}
        >
          {category}
        </Badge>
      </CardHeader>
      
      <CardContent className="p-3">
        <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-muted">
          <img
            src={imageUrl}
            alt={`Armação ${referenceCode}`}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>
      </CardContent>
      
      <CardFooter className="p-3 pt-0">
        <p className="font-medium text-foreground tracking-wide">
          {referenceCode}
        </p>
      </CardFooter>
    </Card>
  );
};

export default FrameCard;
