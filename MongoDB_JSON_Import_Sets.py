import pymongo
import json
import os
import fnmatch
from dotenv import load_dotenv
from pymongo import MongoClient, InsertOne

# The Connection string, Database, and Collection can be updated in the .env file
load_dotenv()

client = pymongo.MongoClient(os.getenv("MONGO_DB_CONNECTION_STRING"))
db = client[os.getenv("MONGO_DATABASE")] # Change the Database as needed
collection = db[os.getenv("MONGO_COLLECTION")] # Change the Collection as needed
requesting = []

pattern = "*sets.json"
filepath = "json_exports"
with os.scandir(filepath) as entries:
    for entry in entries:
        if entry.is_file() and fnmatch.fnmatch(entry.name, pattern):
            with open(entry, 'r') as f:
                data = json.load(f)

                for tcg_set in data["sets"]:
                    tcg_set["category_id"] = data["category_id"]
                    tcg_set["category_name"] = data["category_name"]
                    requesting.append(InsertOne(tcg_set))

result = collection.bulk_write(requesting)
client.close()