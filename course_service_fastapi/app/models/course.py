from enum import Enum
from fastapi import UploadFile
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from .user import User


class Goals(BaseModel):
    learningObjectives: Optional[List[str]] = Field(
        default_factory=lambda: ["", "", "", ""]
    )
    requirements: Optional[List[str]] = Field(default_factory=lambda: ["", ""])
    intendedLearners: Optional[List[str]] = Field(
        default_factory=lambda: ["", "", "", ""]
    )


class Section(BaseModel):
    id: str
    ordinal_number: int


class Type(str, Enum):
    PROGRAMMING = "Programming"
    DATA_SCIENCE = "Data Science"
    WEB_DEVELOPMENT = "Web Development"
    CYBER_SECURITY = "Cyber Security"
    CLOUD_COMPUTING = "Cloud Computing"
    MACHINE_LEARNING = "Machine Learning"
    DATABASE_ADMINISTRATION = "Database Administration"
    DEVOPS = "DevOps"
    IT_SUPPORT = "IT Support"
    NETWORKING = "Networking"
    SOFTWARE_ENGINEERING = "Software Engineering"
    ARTIFICIAL_INTELLIGENCE = "Artificial Intelligence"


class Course(BaseModel):
    id: str = Field(default_factory=lambda: uuid.uuid4().hex[:10], alias="_id")
    owner: Optional[str] = None
    title: str
    category: List[str] = Field(default_factory=lambda: [""])
    time_spend: int
    type: str
    goals: Optional[Goals] = Field(default_factory=Goals)

    subtitle: Optional[str] = None
    description: Optional[str] = None
    language: Optional[List[str]] = Field(default_factory=lambda: [""])
    level: Optional[List[str]] = Field(default_factory=lambda: [""])
    objectives: Optional[List[Type]] = []

    thumbnail: Optional[str] = None
    promotional_video: Optional[str] = None

    price: Optional[int] = 0

    welcome_message: Optional[str] = None
    congratulation_message: Optional[str] = None

    sections: Optional[List[Section]] = Field(default_factory=list)
    tag: List[str] = []
    rating: int = 0
    buying: int = 0


class CourseUpdate(BaseModel):
    title: Optional[str] = None
    category: Optional[List[str]] = None
    time_spend: Optional[int] = None
    type: Optional[Type] = None

    goals: Optional[Goals] = None

    subtitle: Optional[str] = None
    description: Optional[str] = None
    language: Optional[List[str]] = None
    level: Optional[List[str]] = None
    objectives: Optional[List[Type]] = None

    thumbnail: Optional[str] = None
    promotional_video: Optional[str] = None

    price: Optional[int] = 0

    welcome_message: Optional[str] = None
    congratulation_message: Optional[str] = None

    sections: Optional[List[Section]] = Field(default_factory=list)
    tag: Optional[List[str]] = None
    rating: Optional[int] = None
    buying: Optional[int] = None


class Type2(str, Enum):
    PROGRAMMING = "PROGRAMMING"
    DATA_SCIENCE = "DATA_SCIENCE"
    WEB_DEVELOPMENT = "WEB_DEVELOPMENT"
    CYBER_SECURITY = "CYBER_SECURITY"
    CLOUD_COMPUTING = "CLOUD_COMPUTING"
    MACHINE_LEARNING = "MACHINE_LEARNING"
    DATABASE_ADMINISTRATION = "DATABASE_ADMINISTRATION"
    DEVOPS = "DEVOPS"
    IT_SUPPORT = "IT_SUPPORT"
    NETWORKING = "NETWORKING"
    SOFTWARE_ENGINEERING = "SOFTWARE_ENGINEERING"
    ARTIFICIAL_INTELLIGENCE = "ARTIFICIAL_INTELLIGENCE"


class FilterType(BaseModel):
    type: Type2
    page_number: Optional[int] = 1
    page_size: Optional[int] = 5
    sort_by: Optional[str] = None
    sort_order: Optional[int] = 1


class OwnerInfo(BaseModel):
    _id: str
    fullname: str


class GetCourseTypeResponse(BaseModel):
    title: str
    duration: Optional[int] = None
    price: int
    rating: int
    buying: int
    owner: OwnerInfo
    thumbnail: str
    tag: List[str]
