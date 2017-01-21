from __future__ import unicode_literals

from django.contrib.auth import get_user_model
from django.test import TestCase

from utils import status, create_temp_file

from mixing.models import Project, Song, Group, Track, Comment, FinalFile

User = get_user_model()


def create_private_files(owner):
    project = Project.objects.create(title="Project", owner=owner)
    song = Song.objects.create(project=project, title="Song")
    group = Group.objects.create(song=song, title="Group")

    f = create_temp_file("temp-track.wav", "audio/x-wav")
    track = Track.objects.create(group=group, file=f)

    f = create_temp_file("attachment.txt", "text/plain")
    comment = Comment.objects.create(
        project=project, attachment=f, author=owner, content="Comment")

    f = create_temp_file("final.wav", "audio/x-wav")
    final = FinalFile.objects.create(project=project, attachment=f)

    return track, comment, final


class PrivateFieldTests(TestCase):

    def setUp(self):
        self.staff_data = {"username": "staff", "password": "staff"}
        self.staff = User.objects.create_user(**self.staff_data)
        self.staff.is_staff = True
        self.staff.save()

        self.non_owner_data = {"username": "other", "password": "other"}
        self.non_owner = User.objects.create_user(**self.non_owner_data)

        self.owner_data = {"username": "owner", "password": "owner"}
        self.owner = User.objects.create_user(**self.owner_data)
        self.owner.profile.track_credit = 1
        self.owner.profile.save()

        self.track, self.comment, self.final = create_private_files(owner=self.owner)

    def test_track_access(self):
        """
        On Track objects only staff users should be able to access the file.
        Yes, even the owner of the file can't download it because they don't need to.
        """
        # Anon user should be forbidden
        response = self.client.get(self.track.file.url)
        self.assertEquals(response.status_code, status.HTTP_403_FORBIDDEN)

        # Non owner should be forbidden
        self.client.login(**self.non_owner_data)
        response = self.client.get(self.track.file.url)
        self.assertEquals(response.status_code, status.HTTP_403_FORBIDDEN)

        # Owner should be forbidden
        self.client.login(**self.owner_data)
        response = self.client.get(self.track.file.url)
        self.assertEquals(response.status_code, status.HTTP_403_FORBIDDEN)

        # Staff should be allowed
        self.client.login(**self.staff_data)
        response = self.client.get(self.track.file.url)
        self.assertEquals(response.status_code, status.HTTP_200_OK)

    def test_comment_access(self):
        """
        Since both staff members and the owner may create comments with attachments,
        both should have access to the files on Comments.
        """
        # Anon user should be forbidden
        response = self.client.get(self.comment.attachment.url)
        self.assertEquals(response.status_code, status.HTTP_403_FORBIDDEN)

        # Non owner should be forbidden
        self.client.login(**self.non_owner_data)
        response = self.client.get(self.comment.attachment.url)
        self.assertEquals(response.status_code, status.HTTP_403_FORBIDDEN)

        # Owner should be allowed
        self.client.login(**self.owner_data)
        response = self.client.get(self.comment.attachment.url)
        self.assertEquals(response.status_code, status.HTTP_200_OK)

        # Staff should be allowed
        self.client.login(**self.staff_data)
        response = self.client.get(self.comment.attachment.url)
        self.assertEquals(response.status_code, status.HTTP_200_OK)

    def test_final_file_access(self):
        """
        FinalFiles should be available to the owner and staff members.
        """
        # Anon user should be forbidden
        response = self.client.get(self.final.attachment.url)
        self.assertEquals(response.status_code, status.HTTP_403_FORBIDDEN)

        # Non owner should be forbidden
        self.client.login(**self.non_owner_data)
        response = self.client.get(self.final.attachment.url)
        self.assertEquals(response.status_code, status.HTTP_403_FORBIDDEN)

        # Owner should be allowed
        self.client.login(**self.owner_data)
        response = self.client.get(self.final.attachment.url)
        self.assertEquals(response.status_code, status.HTTP_200_OK)

        # Staff should be allowed
        self.client.login(**self.staff_data)
        response = self.client.get(self.final.attachment.url)
        self.assertEquals(response.status_code, status.HTTP_200_OK)
