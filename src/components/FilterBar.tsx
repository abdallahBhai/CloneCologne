import { SlidersHorizontal } from "lucide-react";

const SCENT_PROFILES = [
  "Woody",
  "Citrus",
  "Floral",
  "Spicy",
  "Fresh",
  "Oriental",
  "Aquatic"
];

const BRANDS = [
  "Armaf",
  "Lattafa",
  "Afnan",
  "Al Haramain",
  "Dossier",
  "Zara"
];

export default function FilterBar() {
  return (
    <div className="w-64 flex-shrink-0 hidden lg:block bg-secondary p-8 rounded-[8px] min-h-[600px] border border-border">
      <div className="flex items-center gap-2 mb-8 text-foreground font-serif">
        <SlidersHorizontal className="w-5 h-5 text-primary" />
        <h2 className="text-xl">Refine Search</h2>
      </div>

      <div className="space-y-8">
        <div>
          <h3 className="font-bold text-sm tracking-widest text-tertiary uppercase mb-4">Scent Profile</h3>
          <div className="space-y-3">
            {SCENT_PROFILES.map((profile) => (
              <label key={profile} className="flex items-center gap-3 group cursor-pointer">
                <input 
                  type="checkbox" 
                  className="rounded border-border text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                />
                <span className="text-sm text-foreground/80 group-hover:text-primary transition-colors">{profile}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-bold text-sm tracking-widest text-tertiary uppercase mb-4">Clone Brand</h3>
          <div className="space-y-3">
             {BRANDS.map((brand) => (
              <label key={brand} className="flex items-center gap-3 group cursor-pointer">
                <input 
                  type="checkbox" 
                  className="rounded border-border text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                />
                <span className="text-sm text-foreground/80 group-hover:text-primary transition-colors">{brand}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
