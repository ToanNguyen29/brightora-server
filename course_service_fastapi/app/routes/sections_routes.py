from fastapi import APIRouter, Depends, HTTPException
from app.crud.sections import (
    create_section,
    get_section,
    update_section,
    delete_section,
)
from app.models.sections import Section
from app.utils.verify_token import protect

router = APIRouter()


@router.post("/")
async def add_section(section: Section, token_data: dict = Depends(protect)):
    section_id = await create_section(section)
    return {"section_id": str(section_id)}


@router.get("/{section_id}")
async def read_section(section_id: str, token_data: dict = Depends(protect)):
    section = await get_section(section_id)
    if section is None:
        raise HTTPException(status_code=404, detail="Section not found")
    return section


@router.put("/{section_id}")
async def modify_section(
    section_id: str, section: Section, token_data: dict = Depends(protect)
):
    success = await update_section(section_id, section.model_dump())
    if not success:
        raise HTTPException(status_code=404, detail="Section not found")
    return {"success": True, "status": "Section updated successfully"}


@router.delete("/{section_id}")
async def remove_section(section_id: str, token_data: dict = Depends(protect)):
    success = await delete_section(section_id)
    if not success:
        raise HTTPException(status_code=404, detail="Section not found")
    return {"success": True, "status": "Section deleted successfully"}
