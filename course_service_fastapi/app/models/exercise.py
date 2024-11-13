from typing import List, Optional
import uuid
from pydantic import BaseModel, Field


class Choice(BaseModel):
    option_text: str
    is_correct: bool = False


class MultipleChoiceQuestion(BaseModel):
    question_text: str
    choices: List[Choice]
    correct_explanation: Optional[str] = None
    related_lecture: Optional[str] = None


class Exercise(BaseModel):
    id: str = Field(default_factory=lambda: uuid.uuid4().hex[:10], alias="_id")
    title: str
    description: Optional[str] = None
    questions: List[MultipleChoiceQuestion] = []


class ExerciseUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    questions: List[MultipleChoiceQuestion] = []


class GenQuestion(BaseModel):
    count: int
    lang: str
    difficult: int
    description: str
