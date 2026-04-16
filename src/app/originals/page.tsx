import Navigation from "@/components/Navigation";
import FilterBar from "@/components/FilterBar";
import PerfumeCard from "@/components/PerfumeCard";
import { getSupabaseClient } from "@/lib/supabase";

export default async function OriginalsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const search = params.search as string;
  const gender = params.gender as string;
  const brand = params.brand as string;

  const supabase = getSupabaseClient();
  let perfumes: any[] = [];

  if (supabase) {
    if (search) {
      // Strategy 1: Full Text Search
      const { data: ftsData } = await supabase
        .from("perfumes")
        .select("*")
        .textSearch("search_vector", search, {
          config: "english",
          type: "websearch"
        })
        .order("rating_count", { ascending: false })
        .limit(24);

      if (ftsData && ftsData.length > 0) {
        perfumes = ftsData;
      } else {
        // Strategy 2: ILIKE fuzzy fallback
        const wildcard = `%${search.trim()}%`;
        let fallbackQuery = supabase
          .from("perfumes")
          .select("*")
          .or(
            `name.ilike.${wildcard},brand.ilike.${wildcard},clone_of.ilike.${wildcard},top_notes.ilike.${wildcard},middle_notes.ilike.${wildcard},base_notes.ilike.${wildcard}`
          );

        if (gender) fallbackQuery = fallbackQuery.eq("gender", gender.toLowerCase());
        if (brand) fallbackQuery = fallbackQuery.eq("brand", brand);
        fallbackQuery = fallbackQuery.order("rating_count", { ascending: false }).limit(24);

        const { data: fuzzyData } = await fallbackQuery;
        perfumes = fuzzyData || [];
      }
    } else {
      // Default view for Originals page
      let query = supabase.from("perfumes").select("*").eq("is_clone", false);

      if (gender) query = query.eq("gender", gender.toLowerCase());
      if (brand) query = query.eq("brand", brand);
      query = query.order("rating_count", { ascending: false }).limit(24);

      const { data } = await query;
      perfumes = data || [];
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-6 py-12">
        <header className="mb-12">
          <div className="flex items-center gap-2 text-accent mb-4">
             <div className="w-8 h-[1px] bg-accent" />
             <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Curation</span>
          </div>
          <h1 className="font-serif text-5xl md:text-6xl text-foreground mb-4">Original House Scent Profiles</h1>
          <p className="text-foreground/50 max-w-2xl font-serif italic text-lg leading-relaxed">
            The standard of excellence. Explore the luxury foundations that define modern perfumery.
          </p>
        </header>

        <div className="flex flex-col lg:flex-row gap-12">
          <FilterBar />
          
          <div className="flex-1">
            {perfumes && perfumes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {perfumes.map((perfume: any) => (
                  <PerfumeCard 
                    key={perfume.id}
                    perfume={{
                      id: perfume.id,
                      name: perfume.name,
                      brand: perfume.brand,
                      imageUrl: perfume.clean_image_url || perfume.raw_image_url,
                      slug: perfume.slug || perfume.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                      subtitle: `${perfume.rating_count?.toLocaleString() || 0} Ratings • ${perfume.gender}`,
                      isClone: perfume.is_clone
                    }} 
                  />
                ))}
              </div>
            ) : (
              <div className="h-[400px] flex flex-col items-center justify-center text-center border border-dashed border-border rounded-lg bg-secondary/20">
                <p className="font-serif italic text-xl text-foreground/40 mb-4">No scents found in this collection</p>
                <p className="text-xs uppercase tracking-widest text-accent font-bold">Try adjusting your filters</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
