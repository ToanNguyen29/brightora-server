import os
from aiohttp import ClientError
import boto3
from boto3.s3.transfer import TransferConfig
from fastapi import UploadFile


AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID", "")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY", "")
AWS_S3_BUCKET_NAME = os.getenv("AWS_S3_BUCKET_NAME", "")

s3_client = boto3.client(
    "s3",
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
)


def s3_upload_file(file_content: bytes, s3_key: str, content_type: str):
    try:
        s3_client.put_object(
            Bucket=AWS_S3_BUCKET_NAME,
            Key=s3_key,
            Body=file_content,
            ContentType=content_type,
            ACL="public-read",
            ContentDisposition="inline",
        )
        return f"https://{AWS_S3_BUCKET_NAME}.s3.amazonaws.com/{s3_key}"
    except Exception as e:
        return {"error": str(e)}
