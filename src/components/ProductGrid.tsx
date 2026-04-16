import { getSupabaseClient } from "@/lib/supabase";
import PerfumeCard from "./PerfumeCard";
import { isUuid } from "@/lib/perfumes";

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
  const supabase = getSupabaseClient();

  if (!supabase) {
    return (
      <div className="flex-1 w-full flex flex-col items-center justify-center p-12 bg-secondary/20 rounded-2xl text-center border border-dashed border-border/60 min-h-[400px]">
        <h2 className="font-serif text-2xl mb-4">Configuration Required</h2>
        <p className="max-w-md text-foreground/60 mb-8">Your database is not yet connected. Please add your Supabase credentials to the project environment variables.</p>
      </div>
    );
  }

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
              imageUrl: perfume.clean_image_url || perfume.raw_image_url || "",
              slug: perfume.slug || perfume.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
              subtitle: originalNameById.get(perfume.clone_of) || perfume.clone_of || "Original Fragrance",
              isClone: perfume.is_clone
            }} 
          />
        ))}
      </div>
    </div>
  );
}
