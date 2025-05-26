from django.contrib import admin
from .models import Project, Task

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('name', 'owner', 'verified', 'created_at')
    search_fields = ('name', 'owner__username')
    list_filter = ('verified', 'owner', 'created_at')

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('title', 'project', 'status', 'created_at')
    search_fields = ('title', 'project__name')
    list_filter = ('project', 'status', 'created_at')
