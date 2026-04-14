import { createClient } from "@supabase/supabase-js";
import { exec } from "child_process";
import fs from "fs/promises";
import path from "path";
import util from "util";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const execAsync = util.promisify(exec);

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!; // Needs service role for bg updates
const SERPER_API_KEY = process.env.SERPER_API_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

interface Perfume {
  id: string;
  name: string;
  brand: string;
  clone_of: string;
  status: string;
}

async function searchImage(query: string): Promise<string | null> {
  if (!SERPER_API_KEY) {
    console.warn("No SERPER_API_KEY provided. Skipping image search.");
    return null;
  }
  
  const response = await fetch("https://google.serper.dev/images", {
    method: "POST",
    headers: {
      "X-API-KEY": SERPER_API_KEY,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ q: query + " perfume bottle isolated white background png" })
  });

  const data = await response.json();
  if (data.images && data.images.length > 0) {
    return data.images[0].imageUrl;
  }
  return null;
}

async function downloadImage(url: string, dest: string) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
  const buffer = await response.arrayBuffer();
  await fs.writeFile(dest, Buffer.from(buffer));
}

async function runFactory() {
  console.log("🏭 Starting Perfume Factory Worker...");
  
  // 1. Source: Fetch 10 rows where status = 'pending'
  const { data: pendingPerfumes, error } = await supabase
    .from("perfumes")
    .select("*")
    .eq("status", "pending")
    .limit(10);

  if (error) {
    console.error("Failed to fetch pending perfumes:", error);
    return;
  }

  if (!pendingPerfumes || pendingPerfumes.length === 0) {
    console.log("No pending perfumes to process.");
    return;
  }

  const tempDir = path.join(process.cwd(), "temp_images");
  await fs.mkdir(tempDir, { recursive: true });

  for (const perfume of pendingPerfumes as Perfume[]) {
    console.log(`\n🔄 Processing ${perfume.name} by ${perfume.brand}`);
    
    // 2. Hunt: Search for Image
    const query = `${perfume.brand} ${perfume.name}`;
    console.log(`🔍 Hunting image for: ${query}`);
    const imageUrl = await searchImage(query);

    if (!imageUrl) {
      console.log(`❌ No image found for ${perfume.name}`);
      await supabase.from("perfumes").update({ status: "failed" }).eq("id", perfume.id);
      continue;
    }

    // Prepare temp files
    const inputPath = path.join(tempDir, `${perfume.id}_raw.png`);
    const outputPath = path.join(tempDir, `${perfume.id}_clean.png`);

    try {
      // Download raw image
      console.log(`📥 Downloading image...`);
      await downloadImage(imageUrl, inputPath);
      
      // Update intermediate status
      await supabase.from("perfumes").update({ 
        raw_image_url: imageUrl, 
        status: "image_found" 
      }).eq("id", perfume.id);

      // 3. Process: run rembg subprocess
      console.log(`🪄 Removing background using rembg...`);
      try {
         await execAsync(`rembg i "${inputPath}" "${outputPath}"`);
      } catch(e) {
         console.warn("⚠️ rembg is not installed or failed. Falling back to using the raw image for demonstration...");
         await fs.copyFile(inputPath, outputPath);
      }

      // 4. Store: Upload to Supabase bucket
      console.log(`☁️ Uploading to Supabase Storage...`);
      const fileBuffer = await fs.readFile(outputPath);
      const storagePath = `clones/${perfume.id}.png`;
      
      const { error: uploadError } = await supabase.storage
        .from("perfume-images")
        .upload(storagePath, fileBuffer, { contentType: "image/png", upsert: true });

      if (uploadError) throw uploadError;

      // Ensure public URL
      const { data: publicUrlData } = supabase.storage
        .from("perfume-images")
        .getPublicUrl(storagePath);
      
      // 5. Update status
      console.log(`✅ Finalizing record...`);
      await supabase.from("perfumes").update({
        clean_image_url: publicUrlData.publicUrl,
        status: "processed"
      }).eq("id", perfume.id);

    } catch (err) {
      console.error(`💥 Pipeline failed for ${perfume.name}:`, err);
      await supabase.from("perfumes").update({ status: "failed" }).eq("id", perfume.id);
    } finally {
      // Cleanup locally
      await fs.unlink(inputPath).catch(() => {});
      await fs.unlink(outputPath).catch(() => {});
    }
  }

  console.log("\n🏭 Factory cycle complete.");
}

runFactory();
