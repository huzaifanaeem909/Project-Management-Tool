from rest_framework import serializers
from .models import Project, Task
from django.contrib.auth import get_user_model

User = get_user_model()

class TaskSerializer(serializers.ModelSerializer):

    class Meta:
        model = Task
        fields = ['id', 'title', 'description', 'status', 'project', 'created_at']
        read_only_fields = ['project' ,'created_at']

class ProjectSerializer(serializers.ModelSerializer):
    owner_username = serializers.CharField(source='owner.username', read_only=True)
    owner_email = serializers.EmailField(source='owner.email', read_only=True)
    tasks = TaskSerializer(many=True, read_only=True)
    task_count = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = ['id', 'name', 'description', 'verified', 'owner', 'owner_email','owner_username', 'tasks', 'task_count', 'created_at']
        read_only_fields = ['owner', 'created_at']

    def get_task_count(self, obj):
        return obj.tasks.count()

class ProjectListSerializer(serializers.ModelSerializer):
    owner_username = serializers.CharField(source='owner.username', read_only=True)
    owner_email = serializers.EmailField(source='owner.email', read_only=True)

    class Meta:
        model = Project
        fields = ['id', 'name', 'description', 'verified', 'owner', 'owner_email', 'owner_username', 'created_at']
        read_only_fields = ['owner', 'created_at']
