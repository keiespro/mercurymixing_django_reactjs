from __future__ import unicode_literals, absolute_import

from django.contrib.auth import get_user_model
from django.core.urlresolvers import reverse
from django.test import TestCase

from utils import status, get_uid

from mixing.models import Project

User = get_user_model()
login_url = reverse("login")


class ProjectTest(TestCase):

    @classmethod
    def setUpClass(cls):
        cls.non_owner_data = {"username": get_uid(30), "password": "other"}
        cls.non_owner = User.objects.create_user(**cls.non_owner_data)

        cls.owner_data = {"username": get_uid(30), "password": "owner"}
        cls.owner = User.objects.create_user(**cls.owner_data)

    @classmethod
    def tearDownClass(cls):
        pass

    def test_project_priority_and_active(self):
        """
        Test that the `status` field affects the `priority` and `active`
        fields as expected (see README).
        """
        project = Project.objects.create(
            title="Test project",
            owner=self.owner,
            priority=5
        )

        # Waiting for files
        project.status = Project.STATUS_FILES_PENDING
        project.save()
        project.refresh_from_db()
        self.assertEquals(project.priority, 10)
        self.assertEquals(project.active, True)

        # Mixing in progress
        project.status = Project.STATUS_IN_PROGRESS
        project.save()
        project.refresh_from_db()
        self.assertEquals(project.priority, 9)
        self.assertEquals(project.active, False)

        # Mixing complete
        project.status = Project.STATUS_COMPLETE
        project.save()
        project.refresh_from_db()
        self.assertEquals(project.priority, 10)
        self.assertEquals(project.active, False)

        # Waiting for revision files
        project.status = Project.STATUS_REVISION_FILES_PENDING
        project.save()
        project.refresh_from_db()
        self.assertEquals(project.priority, 10)
        self.assertEquals(project.active, True)

        # Revision in progress
        project.status = Project.STATUS_REVISION_IN_PROGRESS
        project.save()
        project.refresh_from_db()
        self.assertEquals(project.priority, 9)
        self.assertEquals(project.active, False)

        # Revision complete
        project.status = Project.STATUS_REVISION_COMPLETE
        project.save()
        project.refresh_from_db()
        self.assertEquals(project.priority, 10)
        self.assertEquals(project.active, False)

    def test_project_detail_access(self):
        project = Project.objects.create(title="Test project", owner=self.owner)
        project_url = project.get_absolute_url()

        # Anon user should be redirected to login page
        response = self.client.get(project_url)
        self.assertRedirects(response, login_url + "?next=" + project_url)

        # Non owner should not be able to find the project
        self.client.login(**self.non_owner_data)
        response = self.client.get(project_url)
        self.assertEquals(response.status_code, status.HTTP_404_NOT_FOUND)

        # Owner should be allowed
        self.client.login(**self.owner_data)
        response = self.client.get(project_url)
        self.assertEquals(response.status_code, status.HTTP_200_OK)
