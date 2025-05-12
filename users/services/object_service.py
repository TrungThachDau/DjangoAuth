from users.models.account import Account
from users.models.customer import Customer
from users.models.employee import Employee
from users.models.file_permission import FilePermission
from users.models.object import Object, ObjectStatus
from users.serializers.customer import CustomerSerializer
from users.serializers.object import ObjectSerializer
from rest_framework_simplejwt.tokens import UntypedToken

from users.services.mino_service import MinioService
class ObjectService:
    def get_all_objects_of_customer(self,request):
        user_id = request.user.id
        user = Account.objects.filter(id=user_id).first()
        print(user)
        # print(user.id)
        if user.is_staff ==False:
            try:
                object_list = Object.objects.filter(account=user_id,is_deleted=False).order_by('created_at')
                serializer = ObjectSerializer(object_list, many=True)
                if object_list.exists():
                    return serializer.data
                else:
                    return []
            except Object.DoesNotExist:
                raise ValueError("Object does not exist")
            except Exception as e:
                raise ValueError(f"An error occurred: {str(e)}")
        elif user.is_staff == True:
            try:
                object_list = Object.objects.filter(is_deleted=False).order_by('created_at')
                serializer = ObjectSerializer(object_list, many=True)
                if object_list.exists():
                    return serializer.data
                else:
                    return []
            except Object.DoesNotExist:
                raise ValueError("Object does not exist")
            except Exception as e:
                raise ValueError(f"An error occurred: {str(e)}")

        #Load objects of customer
    # def authorize_object(self,request):
    #     object_id = request.data.get('object_id')
    #     status = request.data.get('status')
    #     # user = request.user
    #     try:
    #         #Check user is employee of customer
    #         # emp = Employee.objects.get(account=user.id)
    #         # customer = Customer.objects.filter(employee=emp.id).first()
    #             #Check object is exist
    #         obj = Object.objects.filter(id=object_id).first()
    #         if obj:
    #             obj.status = status
    #             serializer = ObjectSerializer(instance=obj, data={"status": obj.status}, partial=True)
    #             if serializer.is_valid():
    #                 serializer.save()
    #                 return serializer.data
    #             else:
    #                 raise ValueError(serializer.errors)
    #         else:
    #             raise ValueError("Object does not exist")
    #     except Customer.DoesNotExist:
    #         raise ValueError("Customer does not exist")
    #     except Object.DoesNotExist:
    #         raise ValueError("Object does not exist")
    #     except Exception as e:
    #         raise ValueError(f"An error occurred: {str(e)}")
    def update_permission(object_id,permission_list):
        #Delete first
        serializer = FilePermission.objects.filter(object=object_id)
        if serializer.exists():
            serializer.delete()
        else:
            raise ValueError("Permission does not exist")
        #Create new
        for permission_data in permission_list:
            permission_data = {
                'object': object_id,
                'permission': permission_data
            }
            serializer = ObjectSerializer(data=permission_data)
            if serializer.is_valid():
                serializer.save()
            else:
                raise ValueError(serializer.errors)
    def authorize_object(self,request):
        object_id = request.data.get('object_id')
        account_id = request.user.id
        status = request.data.get('status')
        #update status
        object = Object.objects.filter(id= object_id).first()
        if object:
           
            serializer = ObjectSerializer(object, data={'status': status}, partial=True)
            if serializer.is_valid():
                return serializer.data
            else:
                raise ValueError("Error update status")

       
    def get_object(self, request, object_id):
        token = request.headers.get('Authorization')
        if token is not None:
            #verify token
            token = token.split(" ")[1]
            verify = UntypedToken(token)
            if verify:
                #check token is valid
                try:
                    object = Object.objects.filter(id=object_id).first()
                    if object:
                        serializer = ObjectSerializer(object)
                        return serializer.data
                    else:
                        raise ValueError("Object does not exist")
                except Object.DoesNotExist:
                    raise ValueError("Object does not exist")
                except Exception as e:
                    raise ValueError(f"An error occurred: {str(e)}")
            else:
                raise ValueError("Token is invalid")
        else:
            object = Object.objects.filter(id=object_id).first()
            if not object:
                raise ValueError("Object does not exist")
            elif object.status == ObjectStatus.ACCEPTED:
                serializer = ObjectSerializer(object)
                return serializer.data
            else:
               raise ValueError("Unauthorized access to this object")
    def delete_object(self, request):
        object_id = request.data['object_id']
        bucket_name = "images"
        object = Object.objects.filter(id=object_id).first()
        if object.status == ObjectStatus.ACCEPTED or object.status == ObjectStatus.REJECTED:
            file_delete = {
                'is_deleted':True
            }
            serializer_file = ObjectSerializer(data=file_delete)
            if serializer_file.is_valid():
                serializer_file.save()
                minio_sv = MinioService()
                minio_sv.minio_client.delete_object_tags(bucket_name=bucket_name, object_name=object.name)
                return True
            else:
                raise ValueError(serializer_file.errors)
        else:
            raise ValueError("Unauthorized access to this object")
    def update_file(self, request):
        object_id = request.data['object_id']
        file = request.FILES.get('file')
        
        bucket_name = "images"
        new_extension = file.name.split('.')[-1].upper()
        try:
            query = Object.objects.filter(id=object_id).first()
            if query.status == ObjectStatus.REJECTED:
                object_name = query.name
                extension_name = query.extension

                if( extension_name != new_extension):
                    raise ValueError("Extension not match")
                else:

                    minio_sv = MinioService()
                    res = minio_sv.upload_file(bucket_name, file, object_name)
                    if res:
                        file_update = {
                            'name': object_name,
                            'status':'pending',
                            'update_at': datetime.now(),
                            'extension': extension_name
                        }
                        serializer_file = ObjectSerializer(query, data=file_update, partial=True)
                        if serializer_file.is_valid():
                            serializer_file.save()
                            object_history = {
                                'object': query.id,
                                'changed_by': request.user.id,
                                'field_name': 'file_path',
                                'changed_at': datetime.now(),

                            }
                            serializer_history = ObjectHistorySerializer(data=object_history)
                            if serializer_history.is_valid():
                                serializer_history.save()
                            else:
                                raise ValueError(serializer_history.errors)
                            return True
            else:
                raise ValueError("You are not allowed to update this file")
        except ValueError as ve:
            raise ValueError(f"{ve}")
        # if object.status == ObjectStatus.ACCEPTED:
        #     serializer = ObjectSerializer(object)
        #     return serializer.data
        # else:
        #     emp = Employee.objects.get(account=user.id)
        #     customer = Customer.objects.filter(employee=emp.id).first()
        #     if object.account.id == customer.account.id:
        #         serializer = ObjectSerializer(object)
        #         return serializer.data
        #     else:
        #         raise ValueError("Unauthorized access to this object")


