from fastapi import HTTPException
from app.lib.db import get_collection
from app.models.exercise import Exercise

exercise_collection = get_collection("exercise")


async def create_exercise(exercise: Exercise):
    existing_exercise = exercise_collection.find_one({"_id": exercise.id})
    if existing_exercise:
        raise HTTPException(status_code=409, detail="Exercise already exists")
    result = exercise_collection.insert_one(exercise.model_dump(by_alias=True))
    return result.inserted_id


async def get_exercise(exercise_id: str):
    exercise = exercise_collection.find_one({"_id": exercise_id})
    return Exercise(**exercise) if exercise else None


async def update_exercise(exercise_id: str, data: dict):
    updates = {k: v for k, v in data.items() if v}

    updated_exercise = exercise_collection.update_one(
        {"_id": exercise_id}, {"$set": updates}
    )
    return updated_exercise.modified_count > 0


async def delete_exercise(exercise_id: str):
    result = exercise_collection.delete_one({"_id": exercise_id})
    return result.deleted_count > 0
