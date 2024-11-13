import time

from fastapi import UploadFile
from app.lib.aws import s3_upload_file
from app.lib.db import get_collection
from app.models.lesson import Lesson

lesson_collection = get_collection("lesson")


async def create_lesson(lesson: Lesson):
    result = lesson_collection.insert_one(lesson.dict(by_alias=True))
    return result.inserted_id


async def get_lesson(lesson_id: str):
    lesson = lesson_collection.find_one({"_id": lesson_id})
    return Lesson(**lesson) if lesson else None


async def update_lesson(lesson_id: str, data: dict):
    updates = {k: v for k, v in data.items() if v}
    updated_lesson = lesson_collection.update_one({"_id": lesson_id}, {"$set": updates})
    return updated_lesson.modified_count > 0


async def delete_lesson(lesson_id: str):
    result = lesson_collection.delete_one({"_id": lesson_id})
    return result.deleted_count > 0


async def upload_document(file: UploadFile):
    file_content = await file.read()
    file_extension = file.filename.split(".")[-1] if "." in file.filename else "txt"
    new_name = f"{time.time()}.{file_extension}"
    s3_key = f"documents/{new_name}"
    content_type = file.content_type

    url = s3_upload_file(
        file_content=file_content, s3_key=s3_key, content_type=content_type
    )
    return url


async def update_video_lesson(lesson_id: str, file: UploadFile):
    file_content = await file.read()
    s3_key = f"lesson_video/{lesson_id}.mp4"
    content_type = file.content_type
    url = s3_upload_file(
        file_content=file_content, s3_key=s3_key, content_type=content_type
    )

    updated_lesson = lesson_collection.update_one(
        {"_id": lesson_id}, {"$set": {"video_url": url}}
    )
    return updated_lesson.modified_count > 0
