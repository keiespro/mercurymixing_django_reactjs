from __future__ import unicode_literals

from rest_framework import viewsets
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated

from .models import Project, Song, Group, Track
from .permissions import ProjectIsActive
from .serializers import SongSerializer, GroupSerializer, TrackSerializer


class ProjectRelatedViewSet(viewsets.ModelViewSet):
    """
    Protected API endpoints for all objects related to a Project.
    """
    permission_classes = (IsAuthenticated, ProjectIsActive)

    def get_queryset(self):
        """
        Limits GET, PUT, and DELETE to projects owned by the user.
        Subclasses must define queryset and owner_lookup attributes.
        """
        kwargs = {
            self.owner_lookup: self.request.user
        }
        return self.queryset.filter(**kwargs)


class SongViewSet(ProjectRelatedViewSet):
    queryset = Song.objects.all()
    owner_lookup = "project__owner"
    serializer_class = SongSerializer

    def perform_create(self, serializer):
        """
        Limits POST to active Projects owned by the user.
        """
        try:
            Project.objects.get(
                id=self.request.data["project"],
                owner=self.request.user,
                active=True
            )
        except (KeyError, Project.DoesNotExist):
            raise PermissionDenied
        serializer.save()


class GroupViewSet(ProjectRelatedViewSet):
    queryset = Group.objects.all()
    owner_lookup = "song__project__owner"
    serializer_class = GroupSerializer

    def perform_create(self, serializer):
        """
        Limits POST to active Projects owned by the user.
        """
        try:
            Project.objects.get(
                songs=self.request.data["song"],
                owner=self.request.user,
                active=True
            )
        except (KeyError, Project.DoesNotExist):
            raise PermissionDenied
        serializer.save()


class TrackViewSet(ProjectRelatedViewSet):
    queryset = Track.objects.all()
    owner_lookup = "group__song__project__owner"
    serializer_class = TrackSerializer

    def perform_create(self, serializer):
        """
        Limits POST to active Projects owned by the user.
        """
        try:
            Project.objects.get(
                songs__groups=self.request.data["group"],
                owner=self.request.user,
                active=True
            )
        except (KeyError, Project.DoesNotExist):
            raise PermissionDenied
        serializer.save()
