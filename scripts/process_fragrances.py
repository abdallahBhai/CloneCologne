import pandas as pd
import argparse
import sys
import os
import shutil

def process_fragrances(master_path, top1000_path):
    print("Starting fragrance processing...")

    # 1. Backup
    if not os.path.exists(master_path):
        print(f"Error: Master file not found at '{master_path}'.")
        sys.exit(1)
        
    if not os.path.exists(top1000_path):
        print(f"Error: Top 1000 file not found at '{top1000_path}'.")
        sys.exit(1)

    backup_path = master_path + ".backup"
    print(f"Creating backup of master file at '{backup_path}'...")
    shutil.copy2(master_path, backup_path)

    # Load data
    print("Loading datasets into memory...")
    try:
        # Try default UTF-8
        master_df = pd.read_csv(master_path, sep=';', on_bad_lines='skip', engine='python')
    except UnicodeDecodeError:
        print("UTF-8 decode failed, retrying with latin1 encoding...")
        master_df = pd.read_csv(master_path, sep=';', on_bad_lines='skip', engine='python', encoding='latin1')
    except Exception as e:
        print(f"Failed to read with semicolon: {e}. Trying comma...")
        try:
            master_df = pd.read_csv(master_path, sep=',', on_bad_lines='skip', engine='python')
        except UnicodeDecodeError:
            master_df = pd.read_csv(master_path, sep=',', on_bad_lines='skip', engine='python', encoding='latin1')
        
    top1000_df = pd.read_csv(top1000_path, sep=',', on_bad_lines='skip', engine='python')

    # 2. Process - Add Lifecycle_Status initialized to 'Archived'
    print("Processing master file...")
    master_df['Lifecycle_Status'] = 'Archived'

    # 3. Tag - Cross-reference using Perfume/name and Brand/brand
    print("Cross-referencing based on Perfume/name and Brand/brand...")
    
    if 'Perfume' not in master_df.columns or 'Brand' not in master_df.columns:
        print(f"Error: Could not find 'Perfume' or 'Brand' in master dataset. Columns: {master_df.columns.tolist()}")
        sys.exit(1)
        
    if 'name' not in top1000_df.columns or 'brand' not in top1000_df.columns:
        print(f"Error: Could not find 'name' or 'brand' in top 1000 dataset. Columns: {top1000_df.columns.tolist()}")
        sys.exit(1)

    # Clean function for robust string matching
    def clean_str(s):
        return str(s).strip().lower()

    # Create temporary combined key for top 1000
    top1000_names = top1000_df['name'].apply(clean_str)
    top1000_brands = top1000_df['brand'].apply(clean_str)
    active_keys = (top1000_names + "||" + top1000_brands).unique()
    
    # Create temporary combined key for master
    master_names = master_df['Perfume'].apply(clean_str)
    master_brands = master_df['Brand'].apply(clean_str)
    master_keys = master_names + "||" + master_brands
    
    # Apply mask
    active_mask = master_keys.isin(active_keys)
    master_df.loc[active_mask, 'Lifecycle_Status'] = 'Active'

    active_count = master_df[master_df['Lifecycle_Status'] == 'Active'].shape[0]
    print(f"Tagged {active_count} distinct items as Active in the master database.")

    # 4. Output
    print("Generating output files...")
    
    # Extract active dataset
    working_active_df = master_df[master_df['Lifecycle_Status'] == 'Active']
    
    master_output = "tagged_master_database.csv"
    active_output = "working_active_1000.csv"
    
    # Use standard CSV delimiters for outputs
    working_active_df.to_csv(active_output, index=False)
    master_df.to_csv(master_output, index=False)
    
    print(f"Success!")
    print(f"   Saved Active list to: {active_output} ({working_active_df.shape[0]} rows)")
    print(f"   Saved Master list to: {master_output} ({master_df.shape[0]} rows)")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Process fragrances database.')
    parser.add_argument('--master', type=str, default='fra_cleaned.csv', help='Path to master CSV file')
    parser.add_argument('--active', type=str, default='perfumes_custom_schema_with_ids.csv', help='Path to the top 1000 CSV file')
    args = parser.parse_args()

    process_fragrances(args.master, args.active)
