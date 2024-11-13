import os
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

# Fetch MongoDB credentials from environment variables with defaults
MONGO_DBNAME = os.getenv("MONGO_DBNAME", "course_db")

mongo_uri = os.getenv("MONGO_USER")
client = MongoClient(mongo_uri)
db = client[MONGO_DBNAME]

def get_collection(collection_name):
    return db[collection_name]
