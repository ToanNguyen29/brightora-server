from pydantic import BaseModel, Field
import uuid


# User Model
class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), alias="_id")
    first_name: str
    last_name: str
