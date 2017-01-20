from __future__ import unicode_literals

from rest_framework import permissions


class ProjectIsActive(permissions.BasePermission):
    """
    Custom permission to only allow editing and deleting on active Projects.
    This will protect PUT and DELETE.
    """

    def has_object_permission(self, request, view, obj):
        """
        Traverse the foreign keys to determine if a Project is active.
        The obj param can be a Song, Group, or Track.
        """
        if request.method in permissions.SAFE_METHODS:
            return True

        if hasattr(obj, "group"):  # Matches a Track
            obj = obj.group
        if hasattr(obj, "song"):  # Matches a Group
            obj = obj.song
        if hasattr(obj, "project"):  # Matches a Song
            return obj.project.active
        return False
