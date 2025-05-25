from rest_framework import serializers
from .models import Project, Task
from django.contrib.auth import get_user_model

User = get_user_model()

class TaskSerializer(serializers.ModelSerializer):

    class Meta:
        model = Task
        fields = ['id', 'title', 'description', 'status', 'project', 'created_at']
        read_only_fields = ['created_at']

class ProjectSerializer(serializers.ModelSerializer):
    tasks = TaskSerializer(many=True, read_only=True)
    owner_username = serializers.CharField(source='owner.username', read_only=True)
    
    class Meta:
        model = Project
        fields = ['id', 'name', 'description', 'verified', 'owner', 'owner_username', 'tasks', 'created_at']
        read_only_fields = ['owner', 'created_at']

class ProjectListSerializer(serializers.ModelSerializer):
    owner_username = serializers.CharField(source='owner.username', read_only=True)

    class Meta:
        model = Project
        fields = ['id', 'name', 'description', 'verified', 'owner', 'owner_username', 'created_at']
        read_only_fields = ['owner', 'created_at']
