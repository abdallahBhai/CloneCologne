import Navigation from "@/components/Navigation";
import PerfumeCard from "@/components/PerfumeCard";
import { getSupabaseClient } from "@/lib/supabase";

export default async function DupesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const search = params.search as string;

  const supabase = getSupabaseClient();
  let perfumes: any[] = [];

  if (supabase) {
    if (search) {
      // Strategy 1: FTS on clones only
      const { data: ftsData } = await supabase
        .from("perfumes")
        .select("*")
        .eq("is_clone", true)
        .textSearch("search_vector", search, {
          config: "english",
          type: "websearch"
        })
        .order("rating_value", { ascending: false })
        .limit(40);

      if (ftsData && ftsData.length > 0) {
        perfumes = ftsData;
      } else {
        // Strategy 2: ILIKE fuzzy fallback
        const wildcard = `%${search.trim()}%`;
        const { data: fuzzyData } = await supabase
          .from("perfumes")
          .select("*")
          .eq("is_clone", true)
          .or(
            `name.ilike.${wildcard},brand.ilike.${wildcard},clone_of.ilike.${wildcard},top_notes.ilike.${wildcard},middle_notes.ilike.${wildcard},base_notes.ilike.${wildcard}`
          )
          .order("rating_value", { ascending: false })
          .limit(40);

        perfumes = fuzzyData || [];
      }
    } else {
      const { data } = await supabase
        .from("perfumes")
        .select("*")
        .eq("is_clone", true)
        .order("rating_value", { ascending: false })
        .limit(40);

      perfumes = data || [];
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-6 py-12">
        <header className="mb-12 text-center">
          <div className="flex items-center justify-center gap-2 text-accent mb-4">
             <div className="w-8 h-[1px] bg-accent" />
             <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Value Engineering</span>
             <div className="w-8 h-[1px] bg-accent" />
          </div>
          <h1 className="font-serif text-5xl md:text-6xl text-foreground mb-6">Masterful Interpretations</h1>
          <p className="text-foreground/50 max-w-xl mx-auto font-serif italic text-lg leading-relaxed">
            High-performance alternatives that capture the essence of luxury icons. Identical DNA, accessible prices.
          </p>
        </header>

        <div>
          {perfumes && perfumes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {perfumes.map((perfume: any) => (
                <PerfumeCard 
                  key={perfume.id}
                  perfume={{
                    id: perfume.id,
                    name: perfume.name,
                    brand: perfume.brand,
                    imageUrl: perfume.clean_image_url || perfume.raw_image_url,
                    slug: perfume.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                    subtitle: perfume.clone_of ? `Alternative for ${perfume.clone_of}` : "Elite Interpretation"
                  }} 
                />
              ))}
            </div>
          ) : (
            <div className="h-[400px] flex flex-col items-center justify-center text-center border border-dashed border-border rounded-lg bg-secondary/10">
              <p className="font-serif italic text-xl text-foreground/40 mb-4">The vault is currently empty</p>
              <p className="text-xs uppercase tracking-widest text-accent font-bold">Refine your search parameters</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
