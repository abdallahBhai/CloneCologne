"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface PerfumeProps {
  id: string;
  name: string;
  brand: string;
  imageUrl: string;
  slug: string;
  subtitle?: string;
  isClone?: boolean;
}

export default function PerfumeCard({ perfume }: { perfume: PerfumeProps }) {
  return (
    <Link href={`/compare/${perfume.slug}`} className="block h-full group">
      <div className="flex flex-col border border-gray-200 rounded-md overflow-hidden bg-[#f1f1f1] h-full hover:shadow-sm transition-shadow">
        <div className="relative pt-10 pb-6 px-4 flex justify-center items-center h-64 bg-white/50">
          {perfume.isClone && (
             <span className="absolute top-3 left-3 bg-[#eecdcb] text-[10px] uppercase font-medium px-2 py-1 flex items-center justify-center rounded-sm text-[#222222] border-none tracking-widest z-10">
               Interpretation
             </span>
          )}
          {perfume.imageUrl ? (
            <div className="w-full h-full relative">
              <Image 
                src={perfume.imageUrl} 
                alt={perfume.name} 
                fill
                className="object-contain mix-blend-multiply drop-shadow-md transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-[#555555]">
               <span className="font-light italic text-sm">Refining...</span>
            </div>
          )}
        </div>
        
        <div className="p-4 flex-grow flex flex-col justify-between bg-[#f1f1f1]">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-[#555555] mb-2">{perfume.brand}</p>
            <h4 className="text-sm font-medium text-[#222222] mb-1 line-clamp-2 leading-snug">{perfume.name}</h4>
            {perfume.subtitle && (
              <p className="text-xs text-[#555555] opacity-80">{perfume.subtitle}</p>
            )}
          </div>
          <div className="mt-6">
            <button className="w-auto border border-gray-200 bg-white px-5 py-2 text-xs font-medium tracking-wide text-[#222222] hover:bg-gray-50 transition-colors rounded-sm uppercase">
              Compare
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
