from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

User = get_user_model()

class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])

    class Meta:
        model = User
        fields = ('username', 'email', 'role', 'password')

    def validate_password(self, data):
        if len(data) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters long")
        return data

    def create(self, validated_data):
        role = validated_data.get('role')
        user = User.objects.create_user(**validated_data)
        if role == 'admin':
            user.is_staff = True
            user.is_superuser = True
            user.is_active = True
            user.save()
        return user
    
class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

class UserProfileSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'role', 'is_active', 'is_staff')
