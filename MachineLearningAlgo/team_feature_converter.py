import pandas as pd
import json
import os
from pathlib import Path

def convert_team_features_to_json(csv_path, json_path, delimiter=',', encoding='utf-8'):
    """
    Convert team features CSV file to JSON format.
    
    Args:
        csv_path: Path to the CSV file
        json_path: Path to save the JSON file
        delimiter: CSV delimiter character (default: ',')
        encoding: File encoding (default: 'utf-8')
    """
    try:
        # Read CSV file
        print(f"Reading CSV from {csv_path}...")
        df = pd.read_csv(csv_path, delimiter=delimiter, encoding=encoding)
        
        # Convert numeric columns to appropriate types
        for col in df.columns:
            # Convert float columns to int where appropriate
            if pd.api.types.is_float_dtype(df[col]):
                if df[col].fillna(0).apply(lambda x: x.is_integer()).all():
                    df[col] = df[col].astype('Int64')  # Use Int64 to handle NaN values
        
        # Group data by season and team
        team_data = {}
        for _, row in df.iterrows():
            season = str(int(row['Season']))
            team_id = str(int(row['TeamID']))
            
            if season not in team_data:
                team_data[season] = {}
                
            # Convert row to dictionary, handling NaN values
            team_dict = {}
            for col, val in row.items():
                if pd.isna(val):
                    team_dict[col] = None
                else:
                    team_dict[col] = val
            
            team_data[season][team_id] = team_dict
        
        # Create directory if it doesn't exist
        os.makedirs(os.path.dirname(json_path), exist_ok=True)
        
        # Write to JSON file with proper formatting
        with open(json_path, 'w') as json_file:
            json.dump(team_data, json_file, indent=2)
        
        print(f"Successfully converted to {json_path}")
        print(f"JSON file contains {len(df)} team records across {len(team_data)} seasons")
        
    except FileNotFoundError:
        print(f"Error: CSV file {csv_path} not found")
    except Exception as e:
        print(f"Error during conversion: {str(e)}")

def convert_matchups_to_json(csv_path, json_path, delimiter=',', encoding='utf-8'):
    """
    Convert tournament matchups CSV file to JSON format.
    
    Args:
        csv_path: Path to the CSV file
        json_path: Path to save the JSON file
        delimiter: CSV delimiter character (default: ',')
        encoding: File encoding (default: 'utf-8')
    """
    try:
        # Read CSV file
        print(f"Reading CSV from {csv_path}...")
        df = pd.read_csv(csv_path, delimiter=delimiter, encoding=encoding)
        
        # Convert numeric columns to appropriate types
        for col in df.columns:
            # Convert float columns to int where appropriate
            if pd.api.types.is_float_dtype(df[col]):
                if df[col].fillna(0).apply(lambda x: x.is_integer()).all():
                    df[col] = df[col].astype('Int64')  # Use Int64 to handle NaN values
        
        # Group data by season and matchup
        matchup_data = {}
        for _, row in df.iterrows():
            season = str(int(row['Season']))
            
            if season not in matchup_data:
                matchup_data[season] = []
                
            # Convert row to dictionary, handling NaN values
            matchup_dict = {}
            for col, val in row.items():
                if pd.isna(val):
                    matchup_dict[col] = None
                else:
                    matchup_dict[col] = val
            
            matchup_data[season].append(matchup_dict)
        
        # Create directory if it doesn't exist
        os.makedirs(os.path.dirname(json_path), exist_ok=True)
        
        # Write to JSON file with proper formatting
        with open(json_path, 'w') as json_file:
            json.dump(matchup_data, json_file, indent=2)
        
        print(f"Successfully converted to {json_path}")
        print(f"JSON file contains {len(df)} matchup records across {len(matchup_data)} seasons")
        
    except FileNotFoundError:
        print(f"Error: CSV file {csv_path} not found")
    except Exception as e:
        print(f"Error during conversion: {str(e)}")

if __name__ == "__main__":
    # Define paths
    data_dir = Path('../prepared_data')
    
    # Convert team features
    csv_file = data_dir / 'team_features.csv'
    json_file = data_dir / 'team_features.json'
    convert_team_features_to_json(csv_file, json_file)
    
    # Convert tournament matchups if available
    matchups_csv = data_dir / 'tournament_matchups.csv'
    matchups_json = data_dir / 'tournament_matchups.json'
    
    if matchups_csv.exists():
        convert_matchups_to_json(matchups_csv, matchups_json)