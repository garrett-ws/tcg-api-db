import requests
import json
import os

# Base URL
BASE_URL = "https://tcgtracking.com/tcgapi/v1"

# Get all categories
category_data = requests.get(f"{BASE_URL}/categories").json()
categories = [cat["id"] for cat in category_data["categories"]]
sets = {}

# Get all sets for each category
filepath = "json_exports"
for id in categories:    
    sets_data = requests.get(f"{BASE_URL}/{id}/sets").json()
    sets.update({tcg_set["id"]: sets_data["category_id"] for tcg_set in sets_data["sets"]})

    os.makedirs(filepath, exist_ok=True)
    with open(f"{filepath}/{id}_sets.json", "w") as f:
        json.dump(sets_data, f)

# Get all products for each set
for set_id, cat_id in sets.items():
    product_data = requests.get(f"{BASE_URL}/{cat_id}/sets/{set_id}").json()

    os.makedirs(filepath, exist_ok=True)
    with open(f"{filepath}/{set_id}_products.json", "w") as f:
        json.dump(product_data, f)
  
  