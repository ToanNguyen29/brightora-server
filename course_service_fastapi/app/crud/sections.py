from app.lib.db import get_collection
from app.models.sections import Section

section_collection = get_collection("section")


async def create_section(section: Section):
    result = section_collection.insert_one(section.model_dump(by_alias=True))
    return result.inserted_id


async def get_section(section_id: str):
    section = section_collection.find_one({"_id": section_id})
    return Section(**section) if section else None


async def update_section(section_id: str, data: dict):
    updates = {k: v for k, v in data.items() if v}
    print(updates)
    updated_section = section_collection.update_one(
        {"_id": section_id}, {"$set": updates}
    )
    return updated_section.modified_count > 0


async def delete_section(section_id: str):
    result = section_collection.delete_one({"_id": section_id})
    return result.deleted_count > 0
