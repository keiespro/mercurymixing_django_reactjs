from __future__ import unicode_literals

from StringIO import StringIO

from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.core.urlresolvers import reverse

from rest_framework import status
from rest_framework.test import APITestCase

from mixing.models import Project, Song, Group, Track

User = get_user_model()


def create_song_dependencies(instance):
    instance.owner = User.objects.create(username="owner")
    instance.non_owner = User.objects.create(username="non_owner")
    instance.active_project = Project.objects.create(
        title="Active Project",
        owner=instance.owner,
    )
    instance.inactive_project = Project.objects.create(
        title="Inactive Project",
        owner=instance.owner,
        active=False,
        status=Project.STATUS_COMPLETE
    )


def create_group_dependencies(instance):
    create_song_dependencies(instance)
    instance.active_song = instance.active_project.songs.create(
        title="Active song"
    )
    instance.inactive_song = instance.inactive_project.songs.create(
        title="Inactive song"
    )


def create_track_dependencies(instance):
    create_group_dependencies(instance)
    instance.active_group = instance.active_song.groups.create(
        title="Active group"
    )
    instance.inactive_group = instance.inactive_song.groups.create(
        title="Inactive group"
    )


def get_temporary_text_file():
    temp = StringIO()
    temp.write("foo")
    text_file = InMemoryUploadedFile(temp, None, "foo.txt", "text", temp.len, None)
    text_file.seek(0)
    return text_file


class SongAPITests(APITestCase):
    def setUp(self):
        create_song_dependencies(self)

    def test_create_song_on_active_project(self):
        url = reverse("song-list")
        data = {"title": "Test Song", "project": self.active_project.pk}

        # User is anon
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # User is not owner
        self.client.force_authenticate(user=self.non_owner)
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # User is owner
        self.client.force_authenticate(user=self.owner)
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Song.objects.count(), 1)
        self.assertEqual(Song.objects.get().title, "Test Song")

    def test_create_song_on_inactive_project(self):
        url = reverse("song-list")
        data = {"title": "Test Song", "project": self.inactive_project.pk}

        # User is anon
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # User is not owner
        self.client.force_authenticate(user=self.non_owner)
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # User is owner
        self.client.force_authenticate(user=self.owner)
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # No songs should have been created
        self.assertEqual(Song.objects.count(), 0)

    def test_get_song_on_active_project(self):
        song = self.active_project.songs.create(title="Existing song")
        url = reverse("song-detail", args=[song.pk])

        # User is anon
        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # User is not owner
        self.client.force_authenticate(user=self.non_owner)
        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        # User is owner
        self.client.force_authenticate(user=self.owner)
        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_song_on_inactive_project(self):
        song = self.inactive_project.songs.create(title="Existing song")
        url = reverse("song-detail", args=[song.pk])

        # User is anon
        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # User is not owner
        self.client.force_authenticate(user=self.non_owner)
        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        # User is owner
        self.client.force_authenticate(user=self.owner)
        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_song_on_active_project(self):
        song = self.active_project.songs.create(title="Existing song")
        url = reverse("song-detail", args=[song.pk])
        data = {"title": "New Title", "project": self.active_project.pk}

        # User is anon
        response = self.client.put(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # User is not owner
        self.client.force_authenticate(user=self.non_owner)
        response = self.client.put(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        # User is owner
        self.client.force_authenticate(user=self.owner)
        response = self.client.put(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Song.objects.count(), 1)
        self.assertEqual(Song.objects.get().title, "New Title")

    def test_update_song_on_inactive_project(self):
        song = self.inactive_project.songs.create(title="Existing song")
        url = reverse("song-detail", args=[song.pk])
        data = {"title": "New Title", "project": self.inactive_project.pk}

        # User is anon
        response = self.client.put(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # User is not owner
        self.client.force_authenticate(user=self.non_owner)
        response = self.client.put(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        # User is owner
        self.client.force_authenticate(user=self.owner)
        response = self.client.put(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # Nothing should have changed
        self.assertEqual(Song.objects.count(), 1)
        self.assertEqual(Song.objects.get().title, "Existing song")

    def test_delete_song_on_active_project(self):
        song = self.active_project.songs.create(title="Existing song")
        url = reverse("song-detail", args=[song.pk])

        # User is anon
        response = self.client.delete(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # User is not owner
        self.client.force_authenticate(user=self.non_owner)
        response = self.client.delete(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        # User is owner
        self.client.force_authenticate(user=self.owner)
        response = self.client.delete(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Song.objects.count(), 0)

    def test_delete_song_on_inactive_project(self):
        song = self.inactive_project.songs.create(title="Existing song")
        url = reverse("song-detail", args=[song.pk])

        # User is anon
        response = self.client.delete(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # User is not owner
        self.client.force_authenticate(user=self.non_owner)
        response = self.client.delete(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        # User is owner
        self.client.force_authenticate(user=self.owner)
        response = self.client.delete(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # Nothing should have changed
        self.assertEqual(Song.objects.count(), 1)
        self.assertEqual(Song.objects.get().title, "Existing song")


class GroupAPITests(APITestCase):
    def setUp(self):
        create_group_dependencies(self)

    def test_create_group_on_active_song(self):
        url = reverse("group-list")
        data = {"title": "Test Group", "song": self.active_song.pk}

        # User is anon
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # User is not owner
        self.client.force_authenticate(user=self.non_owner)
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # User is owner
        self.client.force_authenticate(user=self.owner)
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Group.objects.count(), 1)
        self.assertEqual(Group.objects.get().title, "Test Group")

    def test_create_group_on_inactive_song(self):
        url = reverse("group-list")
        data = {"title": "Test Group", "song": self.inactive_song.pk}

        # User is anon
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # User is not owner
        self.client.force_authenticate(user=self.non_owner)
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # User is owner
        self.client.force_authenticate(user=self.owner)
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # No groups should have been created
        self.assertEqual(Group.objects.count(), 0)

    def test_get_group_on_active_song(self):
        group = self.active_song.groups.create(title="Existing group")
        url = reverse("group-detail", args=[group.pk])

        # User is anon
        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # User is not owner
        self.client.force_authenticate(user=self.non_owner)
        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        # User is owner
        self.client.force_authenticate(user=self.owner)
        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_group_on_inactive_song(self):
        group = self.inactive_song.groups.create(title="Existing group")
        url = reverse("group-detail", args=[group.pk])

        # User is anon
        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # User is not owner
        self.client.force_authenticate(user=self.non_owner)
        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        # User is owner
        self.client.force_authenticate(user=self.owner)
        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_group_on_active_song(self):
        group = self.active_song.groups.create(title="Existing group")
        url = reverse("group-detail", args=[group.pk])
        data = {"title": "New Title", "song": self.active_song.pk}

        # User is anon
        response = self.client.put(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # User is not owner
        self.client.force_authenticate(user=self.non_owner)
        response = self.client.put(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        # User is owner
        self.client.force_authenticate(user=self.owner)
        response = self.client.put(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Group.objects.count(), 1)
        self.assertEqual(Group.objects.get().title, "New Title")

    def test_update_group_on_inactive_song(self):
        group = self.inactive_song.groups.create(title="Existing group")
        url = reverse("group-detail", args=[group.pk])
        data = {"title": "New Title", "song": self.inactive_song.pk}

        # User is anon
        response = self.client.put(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # User is not owner
        self.client.force_authenticate(user=self.non_owner)
        response = self.client.put(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        # User is owner
        self.client.force_authenticate(user=self.owner)
        response = self.client.put(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # Nothing should have changed
        self.assertEqual(Group.objects.count(), 1)
        self.assertEqual(Group.objects.get().title, "Existing group")

    def test_delete_group_on_active_song(self):
        group = self.active_song.groups.create(title="Existing group")
        url = reverse("group-detail", args=[group.pk])

        # User is anon
        response = self.client.delete(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # User is not owner
        self.client.force_authenticate(user=self.non_owner)
        response = self.client.delete(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        # User is owner
        self.client.force_authenticate(user=self.owner)
        response = self.client.delete(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Group.objects.count(), 0)

    def test_delete_group_on_inactive_song(self):
        group = self.inactive_song.groups.create(title="Existing group")
        url = reverse("group-detail", args=[group.pk])

        # User is anon
        response = self.client.delete(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # User is not owner
        self.client.force_authenticate(user=self.non_owner)
        response = self.client.delete(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        # User is owner
        self.client.force_authenticate(user=self.owner)
        response = self.client.delete(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # Nothing should have changed
        self.assertEqual(Group.objects.count(), 1)
        self.assertEqual(Group.objects.get().title, "Existing group")


class TrackAPITests(APITestCase):
    def setUp(self):
        create_track_dependencies(self)

    def test_create_track_on_active_group(self):
        url = reverse("track-list")

        # User is anon
        data = {"file": get_temporary_text_file(), "group": self.active_group.pk}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # User is not owner
        self.client.force_authenticate(user=self.non_owner)
        data = {"file": get_temporary_text_file(), "group": self.active_group.pk}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # User is owner
        self.client.force_authenticate(user=self.owner)
        data = {"file": get_temporary_text_file(), "group": self.active_group.pk}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Track.objects.count(), 1)

    def test_create_track_on_inactive_group(self):
        url = reverse("track-list")

        # User is anon
        data = {"file": get_temporary_text_file(), "group": self.inactive_group.pk}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # User is not owner
        self.client.force_authenticate(user=self.non_owner)
        data = {"file": get_temporary_text_file(), "group": self.inactive_group.pk}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # User is owner
        self.client.force_authenticate(user=self.owner)
        data = {"file": get_temporary_text_file(), "group": self.inactive_group.pk}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # No tracks should have been created
        self.assertEqual(Track.objects.count(), 0)

    def test_get_track_on_active_group(self):
        track = self.active_group.tracks.create(file="file1.wav")
        url = reverse("track-detail", args=[track.pk])

        # User is anon
        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # User is not owner
        self.client.force_authenticate(user=self.non_owner)
        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        # User is owner
        self.client.force_authenticate(user=self.owner)
        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_track_on_inactive_group(self):
        track = self.inactive_group.tracks.create(file="file1.wav")
        url = reverse("track-detail", args=[track.pk])

        # User is anon
        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # User is not owner
        self.client.force_authenticate(user=self.non_owner)
        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        # User is owner
        self.client.force_authenticate(user=self.owner)
        response = self.client.get(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_track_on_active_group(self):
        track = self.active_group.tracks.create(file="file1.wav")
        url = reverse("track-detail", args=[track.pk])

        # User is anon
        data = {"file": get_temporary_text_file(), "group": self.active_group.pk}
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # User is not owner
        self.client.force_authenticate(user=self.non_owner)
        data = {"file": get_temporary_text_file(), "group": self.active_group.pk}
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        # User is owner
        self.client.force_authenticate(user=self.owner)
        data = {"file": get_temporary_text_file(), "group": self.active_group.pk}
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Track.objects.count(), 1)

    def test_update_track_on_inactive_group(self):
        track = self.inactive_group.tracks.create(file="file1.wav")
        url = reverse("track-detail", args=[track.pk])

        # User is anon
        data = {"file": get_temporary_text_file(), "group": self.inactive_group.pk}
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # User is not owner
        self.client.force_authenticate(user=self.non_owner)
        data = {"file": get_temporary_text_file(), "group": self.inactive_group.pk}
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        # User is owner
        self.client.force_authenticate(user=self.owner)
        data = {"file": get_temporary_text_file(), "group": self.inactive_group.pk}
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # Nothing should have changed
        self.assertEqual(Track.objects.count(), 1)
        self.assertEqual(Track.objects.get().file.name, "file1.wav")

    def test_delete_track_on_active_group(self):
        track = self.active_group.tracks.create(file="file1.wav")
        url = reverse("track-detail", args=[track.pk])

        # User is anon
        response = self.client.delete(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # User is not owner
        self.client.force_authenticate(user=self.non_owner)
        response = self.client.delete(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        # User is owner
        self.client.force_authenticate(user=self.owner)
        response = self.client.delete(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Track.objects.count(), 0)

    def test_delete_track_on_inactive_group(self):
        track = self.inactive_group.tracks.create(file="file1.wav")
        url = reverse("track-detail", args=[track.pk])

        # User is anon
        response = self.client.delete(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # User is not owner
        self.client.force_authenticate(user=self.non_owner)
        response = self.client.delete(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        # User is owner
        self.client.force_authenticate(user=self.owner)
        response = self.client.delete(url, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # Nothing should have changed
        self.assertEqual(Track.objects.count(), 1)
        self.assertEqual(Track.objects.get().file.name, "file1.wav")
