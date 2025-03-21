import { Skeleton } from "@/components/ui/skeleton"

interface SkeletonGridProps {
  length?: number
}

/**
 * Component for rendering a skeleton loader for the image grid.
 * @param length - The number of skeleton items to display (default is 9)
 * @returns A placeholder grid with skeleton elements to indicate loading state.
 */
export function SkeletonGrid({ length = 9 }: SkeletonGridProps) {
  return (
    <div className="grid grid-cols-3 gap-1">
      {Array.from({ length: length }).map((_, index) => (
        <div key={index} className="relative">
          <div className="relative pb-[125%]">
            <Skeleton className="absolute inset-0 bg-foreground/5" />
          </div>
        </div>
      ))}
    </div>
  )
}
