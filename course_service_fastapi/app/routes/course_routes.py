from fastapi import APIRouter, Depends, File, HTTPException, UploadFile

from app.crud.course_crud import (
    get_course_by_type,
    get_curriculum,
)
from app.models import Course
from app.crud import create_course, get_course, update_course, delete_course
from app.models.course import CourseUpdate, FilterType
from app.utils.verify_token import protect

router = APIRouter()

@router.get("/get_curriculum/{course_id}")
async def read_curriculum(course_id: str, token_data: dict = Depends(protect)):
    curriculum = await get_curriculum(course_id)
    if curriculum is None:
        raise HTTPException(status_code=404, detail="Course not found")
    return curriculum


@router.post("/")
async def add_course(course: Course, token_data: dict = Depends(protect)):
    owner = token_data["id"]
    course_data = course.model_dump()
    course_data["owner"] = owner
    course = Course(**course_data)
    course_id = await create_course(course)
    return {"course_id": str(course_id)}


@router.get("/filter")
async def get_by_type(
    filter: FilterType = Depends(), token_data: dict = Depends(protect)
):
    courses = await get_course_by_type(filter=filter)
    if "error" in courses:
        raise HTTPException(status_code=404, detail=courses["error"])

    return courses


@router.get("/{course_id}")
async def read_course(course_id: str, token_data: dict = Depends(protect)):
    course = await get_course(course_id)
    if course is None:
        raise HTTPException(status_code=404, detail="Course not found")
    return course


@router.put("/{course_id}")
async def modify_course(
    course_id: str, course: CourseUpdate, token_data: dict = Depends(protect)
):
    updates = {k: v for k, v in course.model_dump().items() if v}
    # print(user_info)
    # if user_info["id"]!= course_id:
    
    #     return HTTPException(status_code=403, detail="No owner permission")
    print(updates)
    success = await update_course(course_id, updates)
    if not success:
        raise HTTPException(status_code=404, detail="Course not found")
    return {"status": "Course updated successfully"}


@router.delete("/{course_id}")
async def remove_course(course_id: str, token_data: dict = Depends(protect)):
    success = await delete_course(course_id)
    if not success:
        raise HTTPException(status_code=404, detail="Course not found")
    return {"status": "Course deleted successfully"}
