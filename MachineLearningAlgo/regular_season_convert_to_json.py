import csv
import json
import os
import sys
from typing import List, Dict, Any, Union

def convert_value(value: str) -> Union[float, int, str, bool, None]:
    """Convert string values to appropriate Python types."""
    # Handle boolean values
    if value.lower() == 'true':
        return True
    if value.lower() == 'false':
        return False
    
    # Handle N/A values
    if value == 'N/A':
        return None
    
    # Try to convert to numeric types
    try:
        # First try integer
        int_val = int(value)
        return int_val
    except ValueError:
        try:
            # Then try float
            float_val = float(value)
            return float_val
        except ValueError:
            # Keep as string if not numeric
            return value

def csv_to_json(csv_file_path: str) -> List[Dict[str, Any]]:
    """Read a CSV file and convert it to a list of dictionaries."""
    data = []
    
    try:
        with open(csv_file_path, 'r') as csv_file:
            csv_reader = csv.DictReader(csv_file)
            for row in csv_reader:
                # Convert each value to appropriate type
                processed_row = {key: convert_value(value) for key, value in row.items()}
                data.append(processed_row)
        return data
    except FileNotFoundError:
        print(f"Error: CSV file not found at {csv_file_path}")
        sys.exit(1)
    except Exception as e:
        print(f"Error processing CSV file: {str(e)}")
        sys.exit(1)

def save_json(data: List[Dict[str, Any]], output_file_path: str) -> None:
    """Save data as JSON to the specified file."""
    try:
        with open(output_file_path, 'w') as json_file:
            json.dump(data, json_file, indent=4)
    except Exception as e:
        print(f"Error saving JSON file: {str(e)}")
        sys.exit(1)

def main():
    # Define file paths
    current_dir = os.path.dirname(os.path.abspath(__file__))
    base_dir = os.path.dirname(current_dir)
    
    # Default file paths
    input_csv = os.path.join(base_dir, 'prepared_data', 'processed_team_stats_2019_2024.csv')
    output_json = os.path.join(base_dir, 'data', 'processed_team_stats_2019_2024.json')
    
    # Allow custom file paths as command line arguments
    if len(sys.argv) > 1:
        input_csv = sys.argv[1]
    if len(sys.argv) > 2:
        output_json = sys.argv[2]
    
    # Ensure output directory exists
    os.makedirs(os.path.dirname(output_json), exist_ok=True)
    
    print(f"Converting CSV: {input_csv}")
    print(f"Output JSON: {output_json}")
    
    # Convert CSV to JSON
    json_data = csv_to_json(input_csv)
    
    # Save JSON to file
    save_json(json_data, output_json)
    
    print(f"Conversion complete! Converted {len(json_data)} records.")
    print(f"JSON saved to: {output_json}")

if __name__ == "__main__":
    main()
