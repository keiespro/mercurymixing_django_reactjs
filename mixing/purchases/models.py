from __future__ import unicode_literals

from django.core.validators import MinValueValidator
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils.encoding import python_2_unicode_compatible

from mezzanine.conf import settings
from mezzanine.core.models import TimeStamped


@python_2_unicode_compatible
class UserProfile(models.Model):
    """
    A user profile for mixing projects.
    Stores the Track Credit balance for each user.
    """
    user = models.OneToOneField(settings.AUTH_USER_MODEL, related_name="profile")
    track_credit = models.PositiveIntegerField("Track credit", default=0)

    def __str__(self):
        return str(self.user)


@python_2_unicode_compatible
class Purchase(TimeStamped):
    """
    A record of each credit purchase made by a user.
    """
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="purchases")
    credits = models.PositiveIntegerField(
        "Credits", validators=[MinValueValidator(1)], default=1)
    amount = models.DecimalField("Amount", max_digits=6, decimal_places=2)
    charge_details = models.TextField("Charge details", blank=True)

    def __str__(self):
        return str(self.user)


@receiver(post_save, sender=Purchase)
def increase_track_credit(sender, instance, created, *args, **kwargs):
    """
    Increase the user's track credit on each new Purchase.
    """
    if created:
        instance.user.profile.track_credit += instance.credits
        instance.user.profile.save()
