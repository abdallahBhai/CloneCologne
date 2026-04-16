import { createClient } from "@supabase/supabase-js";
import fs from "fs/promises";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function runImport() {
  console.log("🚀 Starting Bulk Data Import...");
  
  const content = await fs.readFile("fra_cleaned.csv", "utf-8");
  const lines = content.split("\n");
  const header = lines[0].trim().split(";");
  
  console.log(`Processing ${lines.length - 1} records...`);

  const batchSize = 500;
  let batch: any[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const values = line.split(";");
    const data: any = {};
    
    const name = values[1];
    const brand = values[2];
    if (!name || !brand) continue;

    data.name = name;
    data.brand = brand;
    data.country = values[3];
    data.gender = values[4];
    data.rating_value = parseFloat(values[5]?.replace(",", ".") || "0");
    data.rating_count = parseInt(values[6] || "0");
    data.year = parseInt(values[7] || "0");
    data.top_notes = values[8];
    data.middle_notes = values[9];
    data.base_notes = values[10];
    data.perfumer1 = values[11];
    data.perfumer2 = values[12];
    data.main_accord_1 = values[13];
    data.main_accord_2 = values[14];
    data.main_accord_3 = values[15];
    data.main_accord_4 = values[16];
    data.main_accord_5 = values[17]?.trim();
    data.status = 'processed';

    batch.push(data);

    if (batch.length >= batchSize || i === lines.length - 1) {
      console.log(`Upserting batch of ${batch.length}...`);
      const { error } = await supabase
        .from("perfumes")
        .upsert(batch, { onConflict: 'name,brand' });
      
      if (error) {
        console.error(`💥 Batch failed:`, error.message);
      }
      batch = [];
      console.log(`Processed ${i} / ${lines.length - 1} records...`);
    }
  }

  console.log("✅ Bulk Import complete.");
}

runImport();
