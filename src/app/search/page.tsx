import Navigation from "@/components/Navigation";
import PerfumeCard from "@/components/PerfumeCard";
import { getSupabaseClient } from "@/lib/supabase";
import { Search as SearchIcon, ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<Metadata> {
  const params = await searchParams;
  const q = (params.q as string) || "";
  return {
    title: q ? `Search: "${q}" — CloneCologne` : "Search — CloneCologne",
    description: q
      ? `Browse perfumes matching "${q}" — originals and dupes from the world's largest clone directory.`
      : "Search the CloneCologne directory for any perfume, brand, or fragrance note.",
  };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const q = (params.q as string) || "";

  const supabase = getSupabaseClient();
  let perfumes: any[] = [];

  if (supabase && q.trim().length >= 2) {
    // Strategy 1: Full Text Search
    const { data: ftsData } = await supabase
      .from("perfumes")
      .select("*")
      .textSearch("search_vector", q, {
        config: "english",
        type: "websearch",
      })
      .order("rating_count", { ascending: false })
      .limit(60);

    if (ftsData && ftsData.length > 0) {
      perfumes = ftsData;
    } else {
      // Strategy 2: ILIKE fuzzy fallback
      const wildcard = `%${q.trim()}%`;
      const { data: fuzzyData } = await supabase
        .from("perfumes")
        .select("*")
        .or(
          `name.ilike.${wildcard},brand.ilike.${wildcard},clone_of.ilike.${wildcard},top_notes.ilike.${wildcard},middle_notes.ilike.${wildcard},base_notes.ilike.${wildcard}`
        )
        .order("rating_count", { ascending: false })
        .limit(60);

      perfumes = fuzzyData || [];
    }
  }

  const originals = perfumes.filter((p) => !p.is_clone);
  const clones = perfumes.filter((p) => p.is_clone);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />

      <main className="flex-1 container mx-auto px-6 py-12">
        {/* Header */}
        <header className="mb-16">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-foreground/40 hover:text-accent transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>

          <div className="flex items-center gap-3 text-accent mb-4">
            <SearchIcon className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">
              Search Results
            </span>
          </div>

          {q ? (
            <>
              <h1 className="font-serif text-5xl md:text-6xl text-foreground mb-4">
                Results for{" "}
                <span className="italic text-accent">&ldquo;{q}&rdquo;</span>
              </h1>
              <p className="text-foreground/50 max-w-2xl font-serif italic text-lg leading-relaxed">
                {perfumes.length > 0
                  ? `Found ${perfumes.length} matching scent${perfumes.length !== 1 ? "s" : ""} across originals and dupes.`
                  : "No results matched your search. Try a different name, brand, or fragrance note."}
              </p>
            </>
          ) : (
            <>
              <h1 className="font-serif text-5xl md:text-6xl text-foreground mb-4">
                Search the Vault
              </h1>
              <p className="text-foreground/50 max-w-2xl font-serif italic text-lg leading-relaxed">
                Enter a perfume name, brand, or note in the search bar above to
                explore our collection.
              </p>
            </>
          )}
        </header>

        {/* Results */}
        {perfumes.length > 0 ? (
          <div className="space-y-24">
            {/* Originals */}
            {originals.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-8 h-[1px] bg-accent" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent">
                    Original House Scents
                  </span>
                  <span className="text-[10px] font-bold text-foreground/30">
                    ({originals.length})
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {originals.map((perfume: any) => (
                    <PerfumeCard
                      key={perfume.id}
                      perfume={{
                        id: perfume.id,
                        name: perfume.name,
                        brand: perfume.brand,
                        imageUrl:
                          perfume.clean_image_url || perfume.raw_image_url,
                        slug:
                          perfume.slug ||
                          perfume.name
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, "-"),
                        subtitle: `${perfume.rating_count?.toLocaleString() || 0} Ratings • ${perfume.gender || "Unisex"}`,
                        isClone: false,
                      }}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Clones */}
            {clones.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-8 h-[1px] bg-accent" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent">
                    Dupe Interpretations
                  </span>
                  <span className="text-[10px] font-bold text-foreground/30">
                    ({clones.length})
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {clones.map((perfume: any) => (
                    <PerfumeCard
                      key={perfume.id}
                      perfume={{
                        id: perfume.id,
                        name: perfume.name,
                        brand: perfume.brand,
                        imageUrl:
                          perfume.clean_image_url || perfume.raw_image_url,
                        slug:
                          perfume.slug ||
                          perfume.name
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, "-"),
                        subtitle: perfume.clone_of
                          ? `Alternative for ${perfume.clone_of}`
                          : "Elite Interpretation",
                        isClone: true,
                      }}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        ) : (
          q.trim().length >= 2 && (
            <div className="h-[400px] flex flex-col items-center justify-center text-center border border-dashed border-border rounded-lg bg-secondary/10">
              <Sparkles className="w-8 h-8 text-accent/40 mb-6" />
              <p className="font-serif italic text-xl text-foreground/40 mb-4">
                No fragrances matched &ldquo;{q}&rdquo;
              </p>
              <p className="text-xs uppercase tracking-widest text-accent font-bold mb-8">
                Try searching for a different name, brand, or note
              </p>
              <div className="flex gap-4">
                <Link
                  href="/originals"
                  className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest border border-accent text-accent hover:bg-accent hover:text-primary transition-all"
                >
                  Browse Originals
                </Link>
                <Link
                  href="/dupes"
                  className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest bg-accent text-primary hover:bg-accent/80 transition-all"
                >
                  Browse Dupes
                </Link>
              </div>
            </div>
          )
        )}
      </main>
    </div>
  );
}
