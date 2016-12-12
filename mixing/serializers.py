from __future__ import unicode_literals

from rest_framework import serializers

from .models import Song, Group, Track


class SongSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()

    class Meta:
        model = Song
        fields = ("project", "title", "id")


class GroupSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()

    class Meta:
        model = Group
        fields = ("song", "title", "id")


class TrackSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()

    class Meta:
        model = Track
        fields = ("group", "file", "id")
