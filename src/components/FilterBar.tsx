"use client";

import { SlidersHorizontal, ChevronDown } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const GENDERS = ["Men", "Women", "Unisex"];

const BRANDS = [
  "Chanel", "Dior", "Creed", "Tom Ford", "Parfums de Marly", "Amouage", "Xerjoff", "Roja Dove", "Baccarat Rouge", "Maison Francis Kurkdjian"
];

export default function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const handleFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (params.get(key) === value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const activeGender = searchParams.get("gender");
  const activeBrand = searchParams.get("brand");

  return (
    <div className="w-full lg:w-72 flex-shrink-0 bg-white/50 backdrop-blur-sm p-8 border border-border/50 shadow-soft h-fit sticky top-24">
      <div className="flex items-center gap-3 mb-10 text-foreground font-serif">
        <SlidersHorizontal className="w-5 h-5 text-accent" />
        <h2 className="text-2xl tracking-tight">Refine</h2>
      </div>

      <div className="space-y-12">
        {/* Gender Filter */}
        <div>
          <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent mb-6">Gender Profile</h3>
          <div className="flex flex-wrap gap-2">
            {GENDERS.map((gender) => (
              <button
                key={gender}
                onClick={() => handleFilter("gender", gender)}
                className={`px-4 py-2 text-xs font-bold transition-all border ${
                  activeGender === gender 
                    ? "bg-primary text-white border-primary" 
                    : "border-border/60 text-foreground/60 hover:border-accent"
                }`}
              >
                {gender}
              </button>
            ))}
          </div>
        </div>

        {/* Brand Filter */}
        <div>
          <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent mb-6">Curated Houses</h3>
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
             {BRANDS.map((brand) => (
              <button
                key={brand}
                onClick={() => handleFilter("brand", brand)}
                className={`flex items-center justify-between w-full text-left py-1 group ${
                  activeBrand === brand ? "text-primary font-bold" : "text-foreground/60"
                }`}
              >
                <span className="text-sm group-hover:text-accent transition-colors">{brand}</span>
                {activeBrand === brand && <div className="w-1.5 h-1.5 bg-accent rounded-full" />}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
