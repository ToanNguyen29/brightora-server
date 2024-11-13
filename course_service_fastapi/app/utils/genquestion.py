import os
from datetime import datetime
from langchain_core.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain_openai import ChatOpenAI
from langchain_core.output_parsers import JsonOutputParser
from typing import List


class QuestionGenerator:
    def __init__(self):
        self.base_dir = os.path.dirname(__file__)
        self.prompt = self.load_prompt_templates()

    def load_prompt_templates(self):
        prompt_template_path = os.path.join(
            os.path.dirname(os.path.abspath(__file__)),
            "prompt",
            "gen_question.txt",
        )
        with open(prompt_template_path, "r", encoding="utf-8") as file:
            return file.read()

    def create_llm_chain(self, prompt_text: str):
        prompt = PromptTemplate(
            input_variables=["count", "description", "lang", "difficult"],
            template=prompt_text,
        )
        parser = JsonOutputParser()
        model = ChatOpenAI(model_name="gpt-3.5-turbo")
        return prompt | model | parser

    def generate_questions(
        self,
        count: int,
        lang: str,
        difficult: int,
        description: str,
    ) -> dict:
        if lang == "en":
            lang = "english"
        else:
            lang = "vietnamese"

        print(f"get {lang} : {count}")

        chain = self.create_llm_chain(self.prompt)
        questions = []
        for i in range(3):
            try:
                response = chain.invoke(
                    {
                        "count": count,
                        "description": description,
                        "lang": lang,
                        "difficult": difficult,
                    }
                )
                questions = response["questions"]
                break
            except Exception as e:
                print("genQuestions error = ", e, "retrying...", i)

        collection = {
            "questions": questions,
            "is_ai_generated": True,
        }

        return {"succeed": True, **collection}
