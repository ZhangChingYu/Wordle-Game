import os
import json

script_dir = os.path.dirname(os.path.abspath(__file__))
file_path = os.path.join(script_dir, "allowedInputs.txt")

with open(file_path, "r") as file:
    words = [line.strip() for line in file]

word_dict = {"words": words}

json_path = os.path.join(script_dir, "allowedWords.json")
with open(json_path, "w") as json_file:
    json.dump(word_dict, json_file, indent=4)

print(f"✅ JSON file generated: {json_path}")
