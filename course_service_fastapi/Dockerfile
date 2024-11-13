 # Use an official Python runtime as a parent image
FROM python:3.12


RUN apt-get update && apt-get install -y supervisor


# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /app
ADD requirements.txt ./

RUN pip install --no-cache-dir -r requirements.txt

ADD . /app
ENV PYTHONPATH=${PYTHONPATH}/app

RUN mkdir -p /app/logs

EXPOSE 5000

# Command to run FastAPI server using Uvicorn
CMD ["uvicorn", "app.app:app", "--host", "0.0.0.0", "--port", "5000", "--reload"]
