import random
import requests


def test_post_course():
    url = "http://127.0.0.1:8000/api/v1/courses/"  # Change URL here if needed for other environments

    # Bearer token for authentication
    token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MWNjMzkxZDlhMDIxMzdkYTM1NzJiOSIsInJvbGUiOiJzdHVkZW50IiwiaWF0IjoxNzMxMTYzNzQ3LCJleHAiOjE3Mzg5Mzk3NDd9.wIFTcWGzOlWpeGrBdVVYN7gbHugVSMrnoPnjTvSfLiQ"
    cookies = {
        "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MWNjMzkxZDlhMDIxMzdkYTM1NzJiOSIsInJvbGUiOiJzdHVkZW50IiwiaWF0IjoxNzMxMTYzNzQ3LCJleHAiOjE3Mzg5Mzk3NDd9.wIFTcWGzOlWpeGrBdVVYN7gbHugVSMrnoPnjTvSfLiQ"
    }

    # Headers with the Bearer token
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}

    # Data to be sent in the POST request
    x = random.choice([2, 4, 6])

    data = {
        "title": "Test Course",
        "category": ["Programming"],
        "time_spend": x,
        "type": "course",
        "owner_id": "671cc391d9a02137da3572b9",
        "objectives": None,
    }

    # Sending POST request
    response = requests.post(url, headers=headers, json=data, cookies=cookies)

    # Check response status
    if response.status_code == 200:
        print("Test passed:", response.json())
        course_id = response.json()["course_id"]
        print("All assertions passed.")
    else:
        print("Test failed with status code:", response.status_code)
        print("Response:", response.text)


test_post_course()
