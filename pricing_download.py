import requests
import json
import os
from dateutil.parser import parse # if not installed then: pip install python-dateutil

# Base URL
BASE_URL = "https://tcgtracking.com/tcgapi/v1"
filepath = "json_exports"
BATCH = 100

# Download pricing and SKUs for just Magic and Pokemon
# Magic category ID = 1
# Pokemon category ID = 3

def getSKUs(cat_num):
    """
    Gets all the SKUs for the given category and exports the results to a JSON file
    in the format of:
    
    YYYY-MM-DD_catNum_productNum_sku.json

    Where the data is when the pricing information was last updated.

    Parameters:
    cat_num: The category number to get the skus for

    Returns:
    The exported JSON files.
    """
    skus = {}
    skusDownloaded = 0
    skusSkipped = 0
    progress = 0 # Track progress of downloads for terminal updates
    for product in sets:
        skus_data = requests.get(f"{BASE_URL}/{cat_num}/sets/{product}/skus").json()
        
        # Don't export sets that don't match the category (ie: don't actually exist)
        if "error" not in skus_data:
            datetimeUpdated  = skus_data["updated"]
            datetimeUpdated = parse(datetimeUpdated)
            dateUpdated = datetimeUpdated.date()
            
            os.makedirs(filepath, exist_ok=True)
            with open(f"{filepath}/{dateUpdated}_{cat_num}_{product}_skus.json", "w") as f:
                json.dump(skus_data, f)
            
            skusDownloaded += 1
        else:
            skusSkipped += 1

        progress += 1
        # Print a periodic progress update on the download
        if progress > BATCH:
            print(f"Downloaded SKUs for {skusDownloaded} sets and skipped {skusSkipped} that did not have data.")
            progress = 0




# Get all categories
category_data = requests.get(f"{BASE_URL}/categories").json()
categories = [cat["id"] for cat in category_data["categories"]]
sets = {}

# Get all sets for each category
for id in categories:    
    sets_data = requests.get(f"{BASE_URL}/{id}/sets").json()
    sets.update({tcg_set["id"]: sets_data["category_id"] for tcg_set in sets_data["sets"]})

# Get all SKUs for each set
#getSKUs(3) # Get Pokemon SKUs
#getSKUs(1) # Get Magic SKUs

# Get pricing data for each set
getPricing(3) # Get Pokemon pricing