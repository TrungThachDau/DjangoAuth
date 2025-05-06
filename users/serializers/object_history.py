from adrf.serializers import ModelSerializer
from rest_framework.validators import UniqueValidator
from users.models.object_history import ObjectHistory

class ObjectHistorySerializer(ModelSerializer):
    class Meta:
        model = ObjectHistory
        fields = ('id','object','changed_by','field_name','old_value','new_value','changed_at')
        read_only_fields = ('id',)
    
        