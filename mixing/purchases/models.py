from __future__ import unicode_literals

from django.core.validators import MinValueValidator
from django.db import models
from django.db.models.signals import post_save, post_delete
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

    class Meta:
        ordering = ["-created"]

    def __str__(self):
        return str(self.user)


@receiver(post_save, sender=Purchase)
def increase_track_credit_on_purchase(sender, instance, created, **kwargs):
    """
    Increase the user's track credit on each new Purchase.
    """
    profile = getattr(instance.user, "profile", None)
    if created and profile:
        profile.track_credit += instance.credits
        profile.save()


@receiver(post_delete, sender="mixing.Track")
def increase_track_credit_on_track_delete(sender, instance, **kwargs):
    """
    Increase the user's track credit when a Track is deleted.
    """
    profile = getattr(instance.group.song.project.owner, "profile", None)
    if profile:
        profile.track_credit += 1
        profile.save()


@receiver(post_save, sender="mixing.Track")
def decrease_track_credit_on_track_add(sender, instance, created, **kwargs):
    """
    Decrease the user's track credit when a Track is created.
    """
    profile = getattr(instance.group.song.project.owner, "profile", None)
    if created and profile and profile.track_credit > 0:
        profile.track_credit -= 1
        profile.save()
