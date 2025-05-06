import self
from minio import Minio
from minio.error import S3Error
from io import BytesIO
class MinioService:
    endpoint = "172.18.20.15:9000"
    access_key = "minioadmin"
    secret_key = "minioadmin"
    def __init__(self):
        self.minio_client = Minio(
            self.endpoint,
            access_key=self.access_key,
            secret_key=self.secret_key,
            secure=False
        )
    def upload_multi_file(self, bucket_name, files):
        try:
            if not self.minio_client.bucket_exists(bucket_name):
                print(f"Bucket {bucket_name} does not exist.")
                return False

            for file in files:
                object_name = file.name  
                self.minio_client.put_object(
                    bucket_name=bucket_name,
                    object_name=object_name,
                    data=BytesIO(file.read()), 
                    length=file.size,  
                    content_type=file.content_type or "application/octet-stream"
                )
            return True
        except Exception as e:
            print(f"Error uploading files: {e}")
            return False
    def upload_file(self, bucket_name, file_path, object_name):
        try:
            self.minio_client.fput_object(bucket_name, object_name, file_path)
            return True
        except Exception as e:
            print(f"Error uploading file: {e}")
            return False

    def download_file(self, bucket_name, object_name, file_path):
        try:
            # Check if the bucket exists
            if not self.minio_client.bucket_exists(bucket_name):
                print(f"Bucket {bucket_name} does not exist.")
                return False

            return self.minio_client.fget_object(bucket_name, object_name, file_path)
        except Exception as e:
            print(f"Error downloading file: {e}")
            return False
    def get_url_object(self, bucket_name, object_name):
        try:
            # Check if the bucket exists
            if not self.minio_client.bucket_exists(bucket_name):
                print(f"Bucket {bucket_name} does not exist.")
                return None
            # Generate a presigned URL for the object
            url = self.minio_client.presigned_get_object(bucket_name, object_name)
            return url
        except S3Error as e:
            print(f"Error generating presigned URL: {e}")
            return None
    def get_list_object(self, bucket_name):
        try:
            objects = self.minio_client.list_objects(bucket_name)
            return [obj.object_name for obj in objects]
        except S3Error as e:
            print(f"Error listing objects: {e}")
            return []