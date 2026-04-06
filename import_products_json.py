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
collection = db[os.getenv("MONGO_COLLECTION_PRODUCTS")] # Change the Collection as needed
requesting = []

pattern = "*products.json"
filepath = "json_exports"
BATCH_SIZE = 1000
total = 0
with os.scandir(filepath) as entries:
    for entry in entries:
        if entry.is_file() and fnmatch.fnmatch(entry.name, pattern):
            try:

                with open(entry, 'r') as f:
                    data = json.load(f)
                    
                    for tcg_product in data["products"]:
                        tcg_product["set_id"] = data["set_id"]
                        tcg_product["set_name"] = data["set_name"]
                        tcg_product["set_abbr"] = data["set_abbr"]
                        requesting.append(InsertOne(tcg_product))

                    if len(requesting) >= BATCH_SIZE:
                        collection.bulk_write(requesting)
                        total += len(requesting)
                        requesting = []
                        print(f"Inserted {total} records thus far...")

            except Exception as e:
                print(f"Skipped {entry.name}: Does the set have any products?")

if requesting:
    collection.bulk_write(requesting)
    total += len(requesting)
    
print(f"Import complete: {total} recods inserted")

# result = collection.bulk_write(requesting)
client.close()