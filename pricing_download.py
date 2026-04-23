import requests
import json
import os
from dateutil.parser import parse # if not installed then: pip install python-dateutil

# Base URL
BASE_URL = "https://tcgtracking.com/tcgapi/v1"
filepath = "json_exports_pricing_subset"
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
            path_name = f"{filepath}/{dateUpdated}_{cat_num}_{product}_skus.json"
            if not os.path.exists(path_name):
                with open(path_name, "w") as f:
                    json.dump(skus_data, f)
                
                skusDownloaded += 1

            else:
                # print(f"Skipped set {product}, data already downloaded")
                skusSkipped += 1
            
        else:
            skusSkipped += 1

        progress += 1
        # Print a periodic progress update on the download
        if progress > BATCH:
            print(f"Downloaded SKUs for {skusDownloaded} sets and skipped {skusSkipped} "
                  "sets that were previously downloaded or did not have data thus far. \nContinuing download...")
            progress = 0

def getPricing(cat_num):
    """
    Gets all the SKUs for the given category and exports the results to a JSON file
    in the format of:
    
    YYYY-MM-DD_catNum_productNum_pricing.json

    Where the data is when the pricing information was last updated.

    Parameters:
    cat_num: The category number to get the pricing for

    Returns:
    The exported JSON files.
    """

    pricingDownloaded = 0
    pricingSkipped = 0
    progress = 0 # Track progress of downloads for terminal updates
    for product in sets:
        pricing_data = requests.get(f"{BASE_URL}/{cat_num}/sets/{product}/pricing").json()
        
        # Don't export sets that don't match the category (ie: don't actually exist)
        if "error" not in pricing_data:
            datetimeUpdated  = pricing_data["updated"]
            datetimeUpdated = parse(datetimeUpdated)
            dateUpdated = datetimeUpdated.date()
            
            os.makedirs(filepath, exist_ok=True)
            path_name = f"{filepath}/{dateUpdated}_{cat_num}_{product}_pricing.json"
            if not os.path.exists(path_name):
                with open(path_name, "w") as f:
                    json.dump(pricing_data, f)
                    pricingDownloaded += 1
            else:
                # print(f"Skipped set {product}, data already downloaded")
                pricingSkipped += 1
            
        else:
            pricingSkipped += 1

        progress += 1
        # Print a periodic progress update on the download
        if progress > BATCH:
            print(f"Downloaded pricing data for {pricingDownloaded} sets and skipped {pricingSkipped} "
                  "sets that were previously downloaded or did not have data thus far. \nContinuing download...")
            progress = 0

print("Gathering category information...")  # Terminal msg because the program takes awhile
# Get all categories
category_data = requests.get(f"{BASE_URL}/categories").json()
categories = [cat["id"] for cat in category_data["categories"]]
sets = {}

print("Collecting set information...") # Terminal msg because the program takes awhile
# Get all sets for each category
for id in categories:    
    sets_data = requests.get(f"{BASE_URL}/{id}/sets").json()
    sets.update({tcg_set["id"]: sets_data["category_id"] for tcg_set in sets_data["sets"]})

# Get all SKUs for each set
print("Begin downloading SKUs...")
print("Downloading SKUs for Magic The Gathering...")
getSKUs(1) # Get Magic SKUs
print("Downloading SKUs for Pokemon...")
getSKUs(3) # Get Pokemon SKUs
print("Downloading SKUs for Japanese Pokemon...")
getSKUs(85) # Get Japanese Pokemon SKUs
print("Finished downloading SKUs!")

# Get pricing data for each set
print("Begin downloading pricing data...")
print("Downloading pricing data for Magic The Gathering...")
getPricing(1) # Get Magic pricing
print("Downloading pricing data for Pokemon...")
getPricing(3) # Get Pokemon pricing
print("Downloading pricing data for Japanese Pokemon...")
getPricing(85) # Get Japanese Pokemon pricing
print("Finished downloading pricing data!")