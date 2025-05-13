from minio import Minio
from minio.error import S3Error
from io import BytesIO
from ..utils.resize import resize_image
from ..utils.filter_file import filter_file
class MinioService:
    endpoint = "127.0.0.1:9000"
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
        
        if len(files) > 3:
           raise ValueError("You can only upload a maximum of 3 files at a time.")
        else:
            backup_files = []
            for file in files:
                backup_files.append(file)
                if not self.minio_client.bucket_exists(bucket_name):
                    print(f"Bucket {bucket_name} does not exist.")
                    return False
                for file in files:
                    if filter_file(file):       
                        object_name = file.name
                        byte_object = BytesIO(file.read())
                        self.minio_client.put_object(
                            bucket_name=bucket_name,
                            object_name=object_name,
                            data=byte_object, 
                            length=file.size,  
                            content_type=file.content_type or "application/octet-stream"
                        )
                    else:
                        return False
                self.upload_multi_file_with_resize(backup_files, bucket_name)
                return True
    def upload_multi_file_with_resize(self,backup_files, bucket_name):
        for file in backup_files:
            if filter_file(file):
                extension = file.name.split(".")[-1]
                if extension.lower() not in ["jpg", "jpeg", "png", "gif"]:
                    continue
                file.seek(0)
                object_name = file.name
                byte_object = BytesIO(file.read())
                resized_object = resize_image(byte_object)
                self.minio_client.put_object(
                    bucket_name=bucket_name,
                    object_name=f"thumbnail/{object_name}",
                    data=resize_image(byte_object), 
                    length=resized_object.getbuffer().nbytes,
                    content_type=file.content_type or "application/octet-stream"
                )
    def upload_file(self, bucket_name, file, object_name):
        backup_file = file
        if filter_file(file) is False:
            return False
        try:
            self.minio_client.put_object(
                bucket_name=bucket_name,
                object_name=object_name,
                data=BytesIO(file.read()),
                length=file.size,
                content_type=file.content_type or "application/octet-stream"
            )
        
            file.seek(0)
            self.minio_client.put_object(
                
    
                bucket_name=bucket_name,
                object_name=f"thumbnail/{object_name}",
                data=resize_image(backup_file), 
                length=resize_image(backup_file).getbuffer().nbytes, # Get the size of the resized image
                content_type=file.content_type or "application/octet-stream"
            )
            return True
        except Exception as e:
            print(f"Error uploading file: {e}")
            return False

    def download_file(self, bucket_name, object_name, file_path):
        try:
            if not self.minio_client.bucket_exists(bucket_name):
                return False

            return self.minio_client.fget_object(bucket_name, object_name, file_path)
        except Exception as e:
            print(f"Error downloading file: {e}")
            return False
    def get_url_object(self, bucket_name, object_name):
        try:
            if not self.minio_client.bucket_exists(bucket_name):
                return None
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
            return []