from typing import List
from app.crud.user_crud import get_users
from app.lib.rabbitmq_client import send_message_to_queue
from app.lib.db import get_collection
from app.models.course import Course, FilterType, GetCourseTypeResponse, OwnerInfo, Type


course_collection = get_collection("courses")


# CRUD for Course
async def create_course(course: Course):
    result = course_collection.insert_one(course.model_dump(by_alias=True))
    send_message_to_queue(
        course.model_dump(by_alias=True),
        "capstone_course_exchange",
        "course_created_queue",
        "course_created",
    )
    return result.inserted_id


async def get_course(course_id: str):
    course = course_collection.find_one({"_id": course_id})
    return Course(**course) if course else None


async def update_course(course_id: str, data: dict):
    updated_course = course_collection.update_one({"_id": course_id}, {"$set": data})
    update_push = {"_id": course_id, "data": "data"}
    send_message_to_queue(
        update_push,
        "capstone_course_exchange",
        "course_updated_queue",
        "course_updated",
    )
    return updated_course.modified_count > 0


async def delete_course(course_id: str):
    result = course_collection.delete_one({"_id": course_id})
    send_message_to_queue(
        {"_id": course_id},
        "capstone_course_exchange",
        "course_updated_queue",
        "course_updated",
    )
    return result.deleted_count > 0


async def get_curriculum(course_id: str):
    curriculum = course_collection.find_one({"_id": course_id})
    return curriculum.get("sections") if curriculum else None


async def get_course_by_type(filter: FilterType):
    type = filter.type.value
    type2 = Type[type].value

    page_number = filter.page_number
    page_size = filter.page_size
    sort_by = filter.sort_by
    sort_order = filter.sort_order

    page_size = min(max(page_size, 1), 100)
    page_number = max(page_number, 1)
    skip_count = (page_number - 1) * page_size

    sort_criteria = [
        (sort_by or "created_at", sort_order if sort_order in [-1, 1] else 1)
    ]
    query = (
        course_collection.find({"category": {"$elemMatch": {"$eq": type2}}})
        .skip(skip_count)
        .limit(page_size)
    )
    query = query.sort(sort_criteria)
    courses = [Course(**course) for course in query]
    total_items = course_collection.count_documents(
        {"category": {"$elemMatch": {"$eq": type2}}}
    )
    result = []
    for course in courses:
        owner_id = course.owner
        if owner_id:
            owner_info = await get_users(users_id=owner_id)
            owner = OwnerInfo(
                _id=owner_id,
                fullname=owner_info["last_name"] + " " + owner_info["first_name"],
            )

        data = GetCourseTypeResponse(
            title=course.title,
            duration=0,
            price=course.price,
            rating=course.rating,
            buying=course.buying,
            thumbnail=course.thumbnail,
            tag=course.tag,
            owner=owner,
        )
        result.append(data)

    return {
        "succeed": True,
        "data": result if result else [],
        "page_number": page_number,
        "page_size": page_size,
        "total_items": total_items,
    }
