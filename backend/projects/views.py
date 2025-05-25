from .models import Project, Task
from .serializers import ProjectSerializer, TaskSerializer, ProjectListSerializer
from .permissions import IsAdminOrOwner, IsAdminOrReadOnly, CanCreateProject

from django.db.models import Q
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'per_page'
    max_page_size = 100

class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated, IsAdminOrOwner]
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        user= self.request.user
        if user.is_staff:
            return Project.objects.all()
        return Project.objects.filter(Q(owner=user) | Q(verified=True))
    
    def perform_create(self, serializer):
        if self.request.user.is_staff:
            serializer.save(owner=self.request.user, verified=True)
        else:
            serializer.save(owner=self.request.user, verified=False)

    @action(detail=True, methods=['post'], permission_classes=[IsAdminOrReadOnly])
    def verify(self, request, pk=None):
        project = self.get_object()
        if request.user.is_staff:
            project.verified = True
            project.save()
            return Response({'status': 'Project verified'}, status=status.HTTP_200_OK)
        return Response({'status': 'Only admin users can verify projects'}, status=status.HTTP_403_FORBIDDEN)
    
    @action(detail=False, methods=['get'])
    def my_projects(self, request):
        user = request.user
        if user.is_authenticated:
            projects = Project.objects.filter(owner=user)
            serializer = ProjectListSerializer(projects, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({'detail': 'Authentication credentials were not provided.'}, status=status.HTTP_401_UNAUTHORIZED)
    

class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated, IsAdminOrOwner]
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Task.objects.all()
        return Task.objects.filter(project__owner=user) | Task.objects.filter(project__verified=True)
