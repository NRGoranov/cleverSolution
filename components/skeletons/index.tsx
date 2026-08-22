import { cn } from "@/lib/utils";

type SkeletonProps = {
  className?: string;
};

/** Base block with left-to-right glow shimmer. */
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn("skeleton-shimmer rounded-lg", className)}
      aria-hidden="true"
    />
  );
}

export function SkeletonText({ className }: SkeletonProps) {
  return <Skeleton className={cn("h-4 w-full", className)} />;
}

export function SkeletonHeading({ className }: SkeletonProps) {
  return <Skeleton className={cn("h-8 w-2/3", className)} />;
}

export function SkeletonImage({ className }: SkeletonProps) {
  return (
    <Skeleton className={cn("aspect-[4/3] w-full rounded-xl", className)} />
  );
}

export function SkeletonButton({ className }: SkeletonProps) {
  return <Skeleton className={cn("h-10 w-36 rounded-md", className)} />;
}

export function SkeletonProductCard() {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-soft">
      <SkeletonImage />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-5 w-1/2" />
        <SkeletonText className="w-full" />
        <SkeletonText className="w-2/3" />
        <div className="mt-auto pt-1">
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      </div>
    </article>
  );
}

export function SkeletonProductGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonProductCard key={i} />
      ))}
    </div>
  );
}

/** Mirrors Hero10 layout: centered title, CTAs, 3-card fan. */
export function SkeletonHero() {
  return (
    <section className="relative isolate w-full overflow-hidden bg-white py-20 sm:py-28">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-6 sm:gap-10">
        <div className="flex w-full max-w-2xl flex-col items-center gap-5">
          <Skeleton className="h-10 w-full max-w-md sm:h-12" />
          <Skeleton className="h-10 w-4/5 max-w-sm sm:h-12" />
          <SkeletonText className="max-w-lg" />
          <SkeletonText className="max-w-md" />
        </div>
        <div className="flex gap-4">
          <SkeletonButton />
          <SkeletonButton />
        </div>
        <div className="relative mx-auto flex w-full max-w-3xl items-center justify-center">
          <Skeleton className="aspect-[4/5] w-[38%] -mr-8 rounded-xl" />
          <Skeleton className="z-10 aspect-[4/5] w-[42%] rounded-xl" />
          <Skeleton className="aspect-[4/5] w-[38%] -ml-8 rounded-xl" />
        </div>
      </div>
    </section>
  );
}

/** Full homepage loading shell matching page sections. */
export function SkeletonHomePage() {
  return (
    <>
      <SkeletonHero />
      <section className="bg-zinc-50 py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <Skeleton className="mb-2 h-9 w-48" />
          <SkeletonText className="mb-10 max-w-md" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-soft"
              >
                <Skeleton className="mb-3 h-6 w-28" />
                <SkeletonText />
                <SkeletonText className="mt-2 w-2/3" />
                <Skeleton className="mt-4 h-4 w-24" />
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-soft md:p-12">
            <Skeleton className="mx-auto h-9 w-56" />
            <SkeletonText className="mx-auto mt-4 max-w-md" />
            <SkeletonButton className="mx-auto mt-6" />
          </div>
        </div>
      </section>
    </>
  );
}

export function SkeletonCategoryHeader() {
  return (
    <div className="mb-10 max-w-2xl space-y-4">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-12 w-48" />
      <SkeletonText className="max-w-xl" />
    </div>
  );
}

/** Category page shell: header + 4-column product grid. */
export function SkeletonCategoryPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      <SkeletonCategoryHeader />
      <SkeletonProductGrid count={8} />
    </div>
  );
}

export function SkeletonProductDetail() {
  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div className="space-y-4">
        <SkeletonImage className="aspect-square" />
        <div className="grid grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-lg" />
          ))}
        </div>
      </div>
      <div className="space-y-6">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-3/4" />
        <SkeletonText className="w-full" />
        <Skeleton className="h-6 w-32" />
        <div className="space-y-2">
          <SkeletonText />
          <SkeletonText />
          <SkeletonText className="w-5/6" />
        </div>
        <SkeletonButton className="w-full max-w-xs" />
      </div>
    </div>
  );
}

export function SkeletonContactForm() {
  return (
    <div className="space-y-5">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>
      ))}
      <Skeleton className="h-32 w-full rounded-lg" />
      <SkeletonButton className="w-full" />
    </div>
  );
}

export function SkeletonAboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      <div className="mx-auto max-w-3xl rounded-2xl border border-zinc-200 bg-white p-6 shadow-soft md:p-10">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="mt-3 h-12 w-64" />
        <div className="mt-8 space-y-3">
          <SkeletonText />
          <SkeletonText />
          <SkeletonText className="w-5/6" />
          <SkeletonText className="w-2/3" />
        </div>
        <div className="mt-12 border-t border-zinc-200 pt-10">
          <Skeleton className="h-10 w-56" />
          <div className="mt-6 space-y-3">
            <SkeletonText />
            <SkeletonText />
            <SkeletonText className="w-4/5" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function SkeletonContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      <div className="mb-10 max-w-2xl space-y-4">
        <Skeleton className="h-12 w-48" />
        <SkeletonText className="max-w-lg" />
      </div>
      <div className="grid gap-12 lg:grid-cols-5">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-soft md:p-8 lg:col-span-3">
          <SkeletonContactForm />
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 md:p-8 lg:col-span-2">
          <Skeleton className="mb-6 h-6 w-32" />
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-5 w-40" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
