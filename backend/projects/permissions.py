from rest_framework import permissions

class IsAdminOrOwner(permissions.BasePermission):
    """
    Custom permission:
    - Admins can access everything
    - End users can only access their own projects or verified projects
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):

        # Admins can access everything
        if request.user and request.user.is_staff:
            return True
        
        # For Project objects
        if hasattr(obj, 'owner'):
            # Owner can access their own projects
            if obj.owner == request.user:
                return True
            
            # End users can only view verified projects of others
            if request.method in permissions.SAFE_METHODS and obj.verified:
                return True
            return False
        
        # For Task objects
        if hasattr(obj, 'project'):
            project = obj.project

            # Owner of project can access tasks
            if project.owner == request.user:
                return True
            
            # End users can manage tasks in verified projects they can access
            if project.verified:
                return True
            return False
        
        return False

    
class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Custom permission for project verification - only admins can verify
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_staff


class CanCreateProject(permissions.BasePermission):
    """
    Permission for creating projects - authenticated users can create
    """
    
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated
