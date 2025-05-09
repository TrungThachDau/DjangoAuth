from users.models.customer import Customer
from users.models.employee import Employee
from users.models.object import Object, ObjectStatus
from users.serializers.customer import CustomerSerializer
from users.serializers.object import ObjectSerializer
class ObjectService:
    def get_all_objects_of_customer(self,request):
        user = request.user
        print(user.id)
        if user.is_admin_user:
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
        else:
            try:
                emp = Employee.objects.get(account=user.id)
                customer_list = Customer.objects.filter(employee=emp.id)
                object_list = []
                for customer in customer_list:
                    print("customer: ",customer.account.id)
                    objects = Object.objects.filter(account=customer.account.id, is_deleted=False).order_by('created_at')
                    serializer = ObjectSerializer(objects, many=True)
                    # print(serializer)
                    object_list.extend(serializer.data)
                
                print(serializer.data)
                if object_list:
                    return object_list
                else:
                    raise ValueError("No objects found for the customer")
            except Customer.DoesNotExist:
                raise ValueError("Customer does not exist")
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
    def authorize_object(self,request):
        object_id = request.data.get('object_id')
        account_id = request.user.id
        status = request.data.get('status')
        emp = Employee.objects.get(account=account_id)
        object = Object.objects.filter(id=object_id).first()
        customer = Customer.objects.filter(employee=emp.id).first()
        print("EMP ID: ",emp.id)
        print("OBJECT Account ID: ",object.account.id)
        print("CUSTOMER Account ID: ",customer.employee.id)
        if emp.id == customer.employee.id and object.account.id == customer.account.id:
            object.status = status
            serializer = ObjectSerializer(instance=object, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return serializer.data
            else:
                raise ValueError(serializer.errors)
        else:
            raise ValueError("Unauthorized access to this object")
    def get_object(self, request, object_id):
        user = request.user
        object = Object.objects.filter(id=object_id).first()
        if not object:
            raise ValueError("Object does not exist")
        else:
            serializer = ObjectSerializer(object)
            return serializer.data
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


