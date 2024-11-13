from fastapi import APIRouter, Depends, HTTPException
from app.models.exercise import Exercise, ExerciseUpdate, GenQuestion
from app.crud.exercise_crud import (
    create_exercise,
    get_exercise,
    update_exercise,
    delete_exercise,
)
from app.utils.genquestion import QuestionGenerator
from app.utils.verify_token import protect

router = APIRouter()


@router.post("/")
async def add_exercise(exercise: Exercise, token_data: dict = Depends(protect)):
    exercise_id = await create_exercise(exercise)
    return {"exercise_id": str(exercise_id)}


@router.get("/{exercise_id}")
async def read_exercise(exercise_id: str, token_data: dict = Depends(protect)):
    exercise = await get_exercise(exercise_id)
    if exercise is None:
        raise HTTPException(status_code=404, detail="Exercise not found")
    return exercise


@router.put("/{exercise_id}")
async def modify_exercise(
    exercise_id: str, questions: ExerciseUpdate, token_data: dict = Depends(protect)
):
    print(questions.model_dump())
    success = await update_exercise(exercise_id, questions.model_dump())
    if not success:
        print(success)
        raise HTTPException(status_code=404, detail="Exercise not found")
    return {"status": "Exercise updated successfully"}


@router.delete("/{exercise_id}")
async def remove_exercise(exercise_id: str, token_data: dict = Depends(protect)):
    success = await delete_exercise(exercise_id)
    if not success:
        raise HTTPException(status_code=404, detail="Exercise not found")
    return {"status": "Exercise deleted successfully"}


@router.post("/gen_questions")
async def gen_questions(options: GenQuestion):
    generator = QuestionGenerator()
    questions = generator.generate_questions(
        count=options.count,
        lang=options.lang,
        difficult=options.difficult,
        description=options.description,
    )
    if not questions:
        raise HTTPException(status_code=404, detail="No questions found")
    return questions
