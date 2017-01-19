from __future__ import unicode_literals, print_function

try:
    from unittest import mock
except ImportError:
    import mock

import stripe

from django.contrib.auth import get_user_model
from django.core.urlresolvers import reverse
from django.test import TestCase, override_settings

from utils import status

from .models import Purchase, UserProfile

User = get_user_model()
login_url = reverse("login")
profile_url = reverse("profile_update")
purchase_url = reverse("purchases:dashboard")


class PurchaseTests(TestCase):

    def setUp(self):
        self.auth_data = {
            "username": "test",
            "password": "test",
        }
        self.user = User.objects.create_user(**self.auth_data)
        UserProfile.objects.get_or_create(user=self.user)

    def test_purchase_requires_login(self):
        # User is anon
        response = self.client.get(purchase_url)
        self.assertRedirects(response, login_url + "?next=" + purchase_url)

        # User is authenticated
        self.client.login(**self.auth_data)
        response = self.client.get(purchase_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    @mock.patch.object(stripe.Charge, "create")
    @override_settings(PURCHASE_CREDIT_PRICE=10)
    def test_purchase_adds_credit(self, mock_create):
        mock_create.return_value = {"message": "Mocked"}
        data = {
            "stripe_token": "test_token",
            "credits": 10,
            "amount": 10 * 10,  # credits * settings.PURCHASE_CREDIT_PRICE
        }
        self.client.login(**self.auth_data)
        response = self.client.post(purchase_url, data=data)

        self.assertRedirects(response, purchase_url)  # Means successful submission
        self.assertEquals(Purchase.objects.count(), 1)
        self.user.profile.refresh_from_db()
        self.assertEquals(self.user.profile.track_credit, 10)

    def test_user_cant_add_credit(self):
        """
        Mezzanine allows users to edit their User and Profile information,
        however, they shouldn't be able to assign credits to themselves
        even if they send the "correct" POST data.
        """
        data = {
            "track_credit": 10,
            # These fields are required but unrelated to the test
            "first_name": "Test",
            "last_name": "Test",
            "email": "a@b.com",
        }
        self.client.login(**self.auth_data)
        response = self.client.post(profile_url, data=data)

        self.assertRedirects(response, profile_url)  # Means successful submission
        self.user.profile.refresh_from_db()
        self.assertEquals(self.user.profile.track_credit, 0)
