import Link from "next/link";
import { ArrowUpRightIcon } from "lucide-react";
import { PlaceholderImage } from "@/components/common/placeholder-image";
import { Badge } from "@/components/ui/badge";
import { realMachineryImagesBySlug } from "@/lib/content/real-machinery-media";

type MachineryCardData = {
  slug: string;
  name: string;
  short_description: string | null;
  capacity: string | null;
  category: { name: string; slug: string } | null;
};

export function MachineryCard({ machinery }: { machinery: MachineryCardData }) {
  return (
    <Link
      href={`/machinery/${machinery.slug}`}
      className="group border-border bg-card hover:border-industrial/60 flex flex-col overflow-hidden rounded-lg border transition-colors"
    >
      <div className="aspect-4/3 relative overflow-hidden">
        <PlaceholderImage
          src={realMachineryImagesBySlug[machinery.slug]?.[0]}
          seed={machinery.slug}
          alt={machinery.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        {machinery.category && (
          <Badge variant="secondary" className="w-fit text-xs font-normal">
            {machinery.category.name}
          </Badge>
        )}
        <h3 className="font-heading text-base leading-snug font-semibold">{machinery.name}</h3>
        {machinery.short_description && (
          <p className="text-muted-foreground line-clamp-2 text-sm">{machinery.short_description}</p>
        )}
        <div className="mt-auto flex items-center justify-between pt-3">
          {machinery.capacity && (
            <span className="text-muted-foreground text-xs">{machinery.capacity}</span>
          )}
          <span className="text-foreground group-hover:text-industrial ml-auto flex items-center gap-1 text-sm font-medium transition-colors">
            View details
            <ArrowUpRightIcon className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
