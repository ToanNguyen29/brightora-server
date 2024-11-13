from typing import Optional
from pydantic import BaseModel


class Users(BaseModel):
    _id: str
    email: str
    first_name: Optional[str] = ""
    last_name: Optional[str] = ""
