import pymongo
import json
import os
import fnmatch
from dotenv import load_dotenv
from pymongo import MongoClient, InsertOne
from datetime import datetime

# This file is a modified version of the import file provided by MongoDB in
# their help article and can be found at:
# https://www.mongodb.com/resources/languages/json-to-mongodb#how-to-import-json-into-mongodb-using-python

# The Connection string, Database, and Collection can be updated in the .env file
load_dotenv()

client = pymongo.MongoClient(os.getenv("MONGO_DB_CONNECTION_STRING"))
db = client[os.getenv("MONGO_DATABASE")] # Change the Database as needed
collection = db[os.getenv("MONGO_COLLECTION_CATEGORIES")] # Change the Collection as needed
requesting = []

pattern = "*categories.json"
filepath = "json_exports"
with os.scandir(filepath) as entries:
    for entry in entries:
        if entry.is_file() and fnmatch.fnmatch(entry.name, pattern):
            with open(entry, 'r') as f:
                data = json.load(f)

                for tcg_category in data["categories"]:
                    # Add a value showing the import time in ISO format. This is because the categories have product
                    # and set count values that may differ from a dynamic count of the values if the imports are done at
                    # different times
                    tcg_category["imported_time"] = datetime.now().astimezone().replace(microsecond=0).isoformat(sep=" ")
                    requesting.append(InsertOne(tcg_category))

result = collection.bulk_write(requesting)
client.close()