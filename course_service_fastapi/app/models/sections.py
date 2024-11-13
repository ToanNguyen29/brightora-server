from typing import List, Optional
import uuid
from pydantic import BaseModel, Field


class Lesson(BaseModel):
    id: str
    ordinal_number: int
    type: str


class Section(BaseModel):
    id: str = Field(default_factory=lambda: uuid.uuid4().hex[:10], alias="_id")
    title: Optional[str] = None
    lessons: List[Lesson] = []
