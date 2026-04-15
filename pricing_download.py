import requests
import json
import os

# Base URL
BASE_URL = "https://tcgtracking.com/tcgapi/v1"
filepath = "json_exports"

# Download pricing and SKUs for just pokemon
# Pokemon category ID = 3

# Get all categories
category_data = requests.get(f"{BASE_URL}/categories").json()
categories = [cat["id"] for cat in category_data["categories"]]
sets = {}

# Get all sets for each category
for id in categories:    
    sets_data = requests.get(f"{BASE_URL}/{id}/sets").json()
    sets.update({tcg_set["id"]: sets_data["category_id"] for tcg_set in sets_data["sets"]})

# Get all SKUs for each set
skus = {}
for product in sets:
    skus_data = requests.get(f"{BASE_URL}/3/sets/{product}/skus").json()
    # skus = [tcg_sku["product"]] skus_data["set_id"] for tcg_sku in skus_data["products"]
    # skus = [sku["product"] for sku in skus_data["products"]]

    # Don't export sets that don't match the category (ie: dont' actually exist)
    if "error" not in skus_data:
        os.makedirs(filepath, exist_ok=True)
        with open(f"{filepath}/{product}_skus.json", "w") as f:
            json.dump(skus_data, f)

