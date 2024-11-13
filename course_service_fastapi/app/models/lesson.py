from typing import List, Optional
from pydantic import BaseModel, Field
import uuid


class Document(BaseModel):
    title: Optional[str] = None
    file_url: Optional[str] = None
    description: Optional[str] = None
    file_type: Optional[str] = None


class Lesson(BaseModel):
    id: str = Field(default_factory=lambda: uuid.uuid4().hex[:10], alias="_id")
    title: str
    description: Optional[str] = None
    video_url: Optional[str] = None
    duration: Optional[int] = None
    documents: Optional[List[Document]] = []


class LessonUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    video_url: Optional[str] = None
    duration: Optional[int] = None
    documents: Optional[List[Document]] = []
