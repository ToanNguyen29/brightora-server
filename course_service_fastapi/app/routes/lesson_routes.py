from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from app.crud.lesson_crud import (
    create_lesson,
    get_lesson,
    update_lesson,
    delete_lesson,
    update_video_lesson,
    upload_document,
)
from app.models.lesson import Lesson, LessonUpdate
from app.utils.verify_token import protect

router = APIRouter()


@router.post("/save_document")
async def save_document(file: UploadFile = File(...)):
    success = await upload_document(file)
    if not success:
        raise HTTPException(status_code=404, detail="Cannot upload")
    print(success)
    return {"success": True, "url": success}


@router.post("/")
async def add_lesson(lesson: Lesson, token_data: dict = Depends(protect)):
    lesson_id = await create_lesson(lesson)
    return {"success": True, "lesson_id": str(lesson_id)}


@router.get("/{lesson_id}")
async def read_lesson(lesson_id: str, token_data: dict = Depends(protect)):
    lesson = await get_lesson(lesson_id)
    if lesson is None:
        raise HTTPException(status_code=404, detail="Lesson not found")
    return lesson


@router.put("/{lesson_id}")
async def modify_lesson(
    lesson_id: str, lesson: LessonUpdate, token_data: dict = Depends(protect)
):
    success = await update_lesson(lesson_id, lesson.model_dump())
    if not success:
        raise HTTPException(status_code=404, detail="Lesson not found")
    return {"success": True, "status": "Lesson updated successfully"}


@router.delete("/{lesson_id}")
async def remove_lesson(lesson_id: str, token_data: dict = Depends(protect)):
    success = await delete_lesson(lesson_id)
    if not success:
        raise HTTPException(status_code=404, detail="Lesson not found")
    return {"success": True, "status": "Lesson deleted successfully"}


@router.post("/update_video")
async def update_video(
    lesson_id: str = Form(...),
    file: UploadFile = File(...),
    token_data: dict = Depends(protect),
):
    success = await update_video_lesson(lesson_id, file)
    if not success:
        raise HTTPException(status_code=404, detail="Cannot upload")
    return {"success": True}
