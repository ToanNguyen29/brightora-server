# rabbitmq_client.py
import os
import json
import pika
import threading
from dotenv import load_dotenv

from app.crud.user_crud import create_users
from app.models.users import Users

load_dotenv()

RABBITMQ_USER = os.getenv("RABBITMQ_USER")
RABBITMQ_PASSWORD = os.getenv("RABBITMQ_PASSWORD") 
RABBITMQ_HOST = os.getenv("RABBITMQ_HOST") 

EXCHANGE = "capstone_user_exchange"
QUEUE = "course_user_created_queue"
ROUTING_KEY = "user_created"


def send_message_to_queue(message: dict, exchange: str, queue: str, routing_key: str):
    credentials = pika.PlainCredentials(RABBITMQ_USER, RABBITMQ_PASSWORD)
    connection_params = pika.ConnectionParameters(
        host=RABBITMQ_HOST, credentials=credentials
    )
    connection = pika.BlockingConnection(connection_params)
    channel = connection.channel()

    channel.exchange_declare(exchange=exchange, exchange_type="direct", durable=True)
    channel.queue_declare(queue=queue, durable=True)
    channel.queue_bind(exchange=exchange, queue=queue, routing_key=routing_key)

    # Convert the message to JSON
    message_body = json.dumps(message)

    channel.basic_publish(
        exchange=exchange,
        routing_key=routing_key,
        body=message_body,
        properties=pika.BasicProperties(delivery_mode=2),
    )

    connection.close()


def callback(ch, method, properties, body):
    body_decode = body.decode()
    data = json.loads(body_decode)

    users: Users = {
        "_id": data["data"].get("_id"),
        "email": data["data"].get("email"),
        "first_name": data["data"].get("firstName"),
        "last_name": data["data"].get("lastName"),
    }
    print("add user:", users)
    create_users(users)


def start_consuming():
    credentials = pika.PlainCredentials(RABBITMQ_USER, RABBITMQ_PASSWORD)
    connection_params = pika.ConnectionParameters(
        host=RABBITMQ_HOST, credentials=credentials
    )
    connection = pika.BlockingConnection(connection_params)
    channel = connection.channel()

    # Ensure exchange and queue exist
    channel.exchange_declare(exchange=EXCHANGE, exchange_type="direct", durable=True)
    channel.queue_declare(queue=QUEUE, durable=True)
    channel.queue_bind(exchange=EXCHANGE, queue=QUEUE, routing_key=ROUTING_KEY)

    # Start consuming messages
    channel.basic_consume(queue=QUEUE, on_message_callback=callback, auto_ack=True)
    print("Started consuming...")
    channel.start_consuming()


def start_consuming_thread():
    thread = threading.Thread(target=start_consuming)
    thread.start()
