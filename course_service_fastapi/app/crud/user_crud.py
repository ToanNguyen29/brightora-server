from app.lib.db import get_collection
from app.models.users import Users

users_collection = get_collection("users")


def create_users(users: Users):
    result = users_collection.insert_one(users)
    return result.inserted_id


async def get_users(users_id: str):
    users = users_collection.find_one({"_id": users_id})
    return users


async def update_users(users_id: str, data: dict):
    updates = {k: v for k, v in data.items() if v}
    updated_users = users_collection.update_one({"_id": users_id}, {"$set": updates})
    return updated_users.modified_count > 0


async def delete_users(users_id: str):
    result = users_collection.delete_one({"_id": users_id})
    return result.deleted_count > 0
