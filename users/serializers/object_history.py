from adrf.serializers import ModelSerializer
from users.models.object_history import ObjectHistory

class ObjectHistorySerializer(ModelSerializer):
    class Meta:
        model = ObjectHistory
        fields = ('id','object','changed_by','field_name','old_value','new_value','changed_at')
        read_only_fields = ('id',)
    
        