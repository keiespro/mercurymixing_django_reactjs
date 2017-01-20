from __future__ import unicode_literals

from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models
from django.utils.encoding import python_2_unicode_compatible

from mezzanine.conf import settings
from mezzanine.core.models import TimeStamped


@python_2_unicode_compatible
class Project(TimeStamped):
    """
    A mixing project created by a user.
    """
    STATUS_USER_NOT_READY = 1
    STATUS_IN_PROGRESS = 2
    STATUS_COMPLETE = 3
    STATUS_REVISION_REQUESTED = 4
    STATUS_REVISION_IN_PROGRESS = 5
    STATUS_REVISION_COMPLETE = 6

    STATUS_CHOICES = (
        (STATUS_USER_NOT_READY, "Waiting for user"),
        (STATUS_IN_PROGRESS, "In progress"),
        (STATUS_COMPLETE, "Mixing complete"),
        (STATUS_REVISION_REQUESTED, "Revision requested"),
        (STATUS_REVISION_IN_PROGRESS, "Revision in progress"),
        (STATUS_REVISION_COMPLETE, "Revision complete"),
    )

    title = models.CharField("Title", max_length=100)
    active = models.BooleanField("Active", default=True)
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name="projects", verbose_name="Owner")
    status = models.PositiveIntegerField(
        "Status", choices=STATUS_CHOICES, default=STATUS_USER_NOT_READY)
    priority = models.SmallIntegerField(
        "Priority", default=10,
        validators=[MinValueValidator(0), MaxValueValidator(10)],
        help_text="Lower numbers indicate a higher priority for this project")

    class Meta:
        verbose_name = "project"
        verbose_name_plural = "projects"

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        # Project is done, remove from priority flow and deactivate
        if self.status in [self.STATUS_COMPLETE, self.STATUS_REVISION_COMPLETE]:
            self.priority = 10
            self.active = False
        # Project is not complete, leave the priority alone and reactivate
        else:
            self.active = True
        super(Project, self).save(*args, **kwargs)


@python_2_unicode_compatible
class Comment(TimeStamped):
    """
    A comment that a user or staff member can leave on a Project.
    Can be used to clarify details or provide references.
    """
    project = models.ForeignKey(Project, related_name="comments")
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name="comments", verbose_name="Author")
    content = models.TextField("Content")
    attachment = models.FileField(
        "Attachement", max_length=255, blank=True, upload_to="comments")

    class Meta:
        verbose_name = "comment"
        verbose_name_plural = "comments"

    def __str__(self):
        # Remove newlines and return the 20 first chars
        return " ".join(self.content.split())[:20]


@python_2_unicode_compatible
class FinalFile(TimeStamped):
    """
    A file resulting from the mixing process.
    Uploaded by a staff member and downloaded by the user.
    """
    project = models.ForeignKey(Project, related_name="final_files")
    notes = models.TextField("Notes", blank=True)
    attachment = models.FileField("Attachement", max_length=255, upload_to="finals")

    class Meta:
        verbose_name = "final file"
        verbose_name_plural = "final files"

    def __str__(self):
        # Filename and extension
        try:
            return self.file.name.split('/')[-1]
        except AttributeError:
            return ""


@python_2_unicode_compatible
class Song(models.Model):
    """
    A song that acts a subdivision in a Project.
    """
    project = models.ForeignKey(Project, related_name="songs")
    title = models.CharField("Title", max_length=100)

    class Meta:
        verbose_name = "song"
        verbose_name_plural = "songs"

    def __str__(self):
        return self.title


@python_2_unicode_compatible
class Group(models.Model):
    """
    A group that acts a subdivision in a Song.
    """
    song = models.ForeignKey(Song, related_name="groups")
    title = models.CharField("Title", max_length=100)

    class Meta:
        verbose_name = "group"
        verbose_name_plural = "groups"

    def __str__(self):
        return self.title


@python_2_unicode_compatible
class Track(models.Model):
    """
    The actual track, uploaded by the user to be mixed.
    Tracks are always part of a Group.
    """
    group = models.ForeignKey(Group, related_name="tracks")
    file = models.FileField("File", max_length=255, upload_to="tracks")

    class Meta:
        verbose_name = "track"
        verbose_name_plural = "tracks"

    def __str__(self):
        # Filename and extension
        try:
            return self.file.name.split('/')[-1]
        except AttributeError:
            return ""
