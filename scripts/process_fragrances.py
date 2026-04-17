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
        # Assuming typical delimiter, update if necessary.
        master_df = pd.read_csv(master_path, sep=',', on_bad_lines='skip', engine='python')
    except Exception as e:
        print("Retrying with semicolon delimiter...")
        master_df = pd.read_csv(master_path, sep=';', on_bad_lines='skip', engine='python')
        
    top1000_df = pd.read_csv(top1000_path, sep=',', on_bad_lines='skip', engine='python')

    # 2. Process - Add Lifecycle_Status initialized to 'Archived'
    print("Processing master file...")
    master_df['Lifecycle_Status'] = 'Archived'

    # 3. Tag - Cross-reference using 'id' or 'name'
    # Check for 'id' column, fallback to 'name'
    join_col = 'id' if 'id' in top1000_df.columns and 'id' in master_df.columns else 'name'
    if join_col not in top1000_df.columns:
        # maybe the columns have other names
        # Let's try matching on name/brand if possible
        if 'name' in top1000_df.columns and 'name' in master_df.columns:
            join_col = 'name'
        elif 'Name' in top1000_df.columns and 'Name' in master_df.columns:
            join_col = 'Name'
            
    print(f"Cross-referencing based on column matching: '{join_col}'")
    
    if join_col not in master_df.columns or join_col not in top1000_df.columns:
        print(f"Error: Could not find '{join_col}' in one or both files.")
        print(f"Master columns: {master_df.columns.tolist()}")
        print(f"Top 1000 columns: {top1000_df.columns.tolist()}")
        sys.exit(1)

    # Extract active identifiers
    active_ids = top1000_df[join_col].dropna().astype(str).str.strip().str.lower().unique()
    
    # Mark Active items
    master_df_identifier = master_df[join_col].dropna().astype(str).str.strip().str.lower()
    active_mask = master_df_identifier.isin(active_ids)
    
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
