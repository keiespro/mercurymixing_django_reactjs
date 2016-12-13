from __future__ import unicode_literals

import json

from django.views import generic
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator

from rest_framework import viewsets
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated

from .models import Project, Song, Group, Track
from .permissions import ProjectIsActive
from .serializers import (
    ProjectSerializer, SongSerializer, GroupSerializer, TrackSerializer)


#################
# Regular Views #
#################

class ProjectDetail(generic.DetailView):
    template_name = "mixing/project_detail.html"
    context_object_name = "project"

    @method_decorator(login_required)
    def dispatch(self, *args, **kwargs):
        """
        Requrired to apply login_required.
        Can be swapped by proper mixin in Django 1.9.
        https://docs.djangoproject.com/en/1.9/topics/auth/default/#the-loginrequired-mixin
        """
        return super(ProjectDetail, self).dispatch(*args, **kwargs)

    def get_queryset(self):
        """
        Only search projects owned by the user.
        """
        return Project.objects.filter(owner=self.request.user)

    def get_context_data(self, **kwargs):
        """
        Add the context needed to prime Redux's state.
        """
        project = self.object
        songs = project.songs.all()
        groups = Group.objects.filter(song=songs)
        tracks = Track.objects.filter(group=groups)

        state = {
            "project": ProjectSerializer(project).data,
            "songs": SongSerializer(songs, many=True).data,
            "groups": GroupSerializer(groups, many=True).data,
            "tracks": TrackSerializer(tracks, many=True).data,
        }

        kwargs.update({
            "state": json.dumps(state)
        })
        return super(ProjectDetail, self).get_context_data(**kwargs)


#############
# API Views #
#############

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
