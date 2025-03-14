import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonGrid() {
  return (
    <div className="grid grid-cols-3 gap-1">
      {Array.from({ length: 9 }).map((_, index) => (
        <div key={index} className="relative">
          <div className="relative pb-[125%]">
            <Skeleton className="absolute inset-0 bg-foreground/5" />
          </div>
        </div>
      ))}
    </div>
  )
}
