from __future__ import unicode_literals

from rest_framework import serializers

from .models import Project, Song, Group, Track


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ("title", "active", "id")
        read_only_fields = fields


class SongSerializer(serializers.ModelSerializer):
    class Meta:
        model = Song
        fields = ("project", "title", "id")
        read_only_fields = ("id",)


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ("song", "title", "id")
        read_only_fields = ("id",)


class TrackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Track
        fields = ("group", "file", "id")
        read_only_fields = ("id",)
