import { createClient } from '@supabase/supabase-js';
import PerfumeCard from "./PerfumeCard";
import { isUuid } from "@/lib/perfumes";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Disable static rendering for this component to see live updates
export const revalidate = 0;

function seededNumber(seed: string, min: number, max: number) {
  let hash = 0;

  for (const char of seed) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  }

  return min + (hash % (max - min + 1));
}

export default async function ProductGrid() {
  const { data: perfumes, error } = await supabase
    .from("perfumes")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    console.error("Error fetching perfumes:", error);
  }

  const perfumeItems = perfumes || [];
  const originalIds = [...new Set(
    perfumeItems
      .map((perfume) => perfume.clone_of)
      .filter((cloneOf): cloneOf is string => isUuid(cloneOf))
  )];

  let originalNameById = new Map<string, string>();

  if (originalIds.length > 0) {
    const { data: originals, error: originalsError } = await supabase
      .from("perfumes")
      .select("id,name")
      .in("id", originalIds);

    if (originalsError) {
      console.error("Error fetching original perfumes:", originalsError);
    } else {
      originalNameById = new Map(
        (originals || []).map((perfume) => [perfume.id, perfume.name])
      );
    }
  }

  return (
    <div className="flex-1 w-full">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="font-serif text-4xl lg:text-5xl text-foreground mt-4 mb-2">Featured Clones</h1>
          <p className="text-foreground/70 text-lg">Curated alternatives to the world&apos;s most luxurious fragrances.</p>
        </div>
        <div className="text-sm text-foreground/60 hidden sm:block">
          Showing {perfumeItems.length} results
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {perfumeItems.map((perfume) => (
          <PerfumeCard 
            key={perfume.id} 
            perfume={{
              id: perfume.id,
              name: perfume.name,
              brand: perfume.brand,
              cloneOf: originalNameById.get(perfume.clone_of) || perfume.clone_of || "Original Fragrance",
              price: seededNumber(perfume.id, 20, 69),
              originalPrice: seededNumber(`${perfume.id}-original`, 150, 349),
              imageUrl: perfume.clean_image_url || perfume.raw_image_url || ""
            }} 
          />
        ))}
      </div>
    </div>
  );
}
