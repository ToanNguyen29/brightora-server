# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import (
    course_router,
    lesson_router,
    section_router,
    exercise_router,
)
from .lib.rabbitmq_client import start_consuming_thread

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3002", "http://capstoneproject.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(course_router, prefix="/api/v1/courses")
app.include_router(lesson_router, prefix="/api/v1/lessons")
app.include_router(section_router, prefix="/api/v1/sections")
app.include_router(exercise_router, prefix="/api/v1/exercise")


# @app.on_event("startup")
# def startup_event():
#     start_consuming_thread()
