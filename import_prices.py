import pymongo
import json
import os
import fnmatch
from dotenv import load_dotenv
from pymongo import MongoClient, InsertOne

# This file is a modified version of the import file provided by MongoDB in
# their help article and can be found at:
# https://www.mongodb.com/resources/languages/json-to-mongodb#how-to-import-json-into-mongodb-using-python

# The Connection string, Database, and Collection can be updated in the .env file
load_dotenv()

client = pymongo.MongoClient(os.getenv("MONGO_DB_CONNECTION_STRING"))
db = client[os.getenv("MONGO_DATABASE")] # Change the Database as needed
collection = db[os.getenv("MONGO_COLLECTION_PRICES")] # Change the Collection as needed
requesting = []

# the tcgapi and output files use "pricing", while the DB uses "prices"
pattern = "*pricing.json"
filepath = "json_exports"
BATCH_SIZE = 1000
total = 0
with os.scandir(filepath) as entries:
    for entry in entries:
        if entry.is_file() and fnmatch.fnmatch(entry.name, pattern):
            try:

                with open(entry, 'r') as f:
                    data = json.load(f)

                    for product, tcg_price in data["prices"].items():                        
                        tcg_price["set_id"] = data["set_id"]
                        tcg_price["updated"] = data["updated"]
                        tcg_price["product"] = product
                        requesting.append(InsertOne(tcg_price))

                    if len(requesting) >= BATCH_SIZE:
                        collection.bulk_write(requesting)
                        total += len(requesting)
                        requesting = []
                        print(f"Inserted {total} records thus far...")

            except Exception as e:
                print(f"Skipped {entry.name}: Does the set have any price information?")

if requesting:
    collection.bulk_write(requesting)
    total += len(requesting)
    
print(f"Import complete: {total} records inserted")

client.close()