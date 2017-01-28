from __future__ import unicode_literals

import re

from django.contrib import admin
from django.template import Context, loader
from django.utils.html import mark_safe

from .models import Project


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    ordering = ["priority", "-created"]
    date_hierarchy = "created"
    list_display = ["title", "owner", "created", "status", "priority"]
    list_editable = ["priority"]
    list_filter = ["status"]
    search_fields = ["title", "owner__username"]
    readonly_fields = ["created", "updated", "track_browser"]
    fieldsets = (
        (None, {
            "fields": ["title", "owner", "created", "updated", "status", "priority"],
        }),
        ("Tracks", {
            "fields": ["track_browser"],
            "classes": ("collapse-closed",)
        }),
    )

    class Media:
        """
        Include the assets required by track_browser.
        """
        css = {
            "all": ("admin/mixing/styles.css",),
        }
        js = ("admin/mixing/scripts.js",)

    def track_browser(self, project=None):
        """
        Generates a collapsible tree of Songs / Groups / Tracks.
        """
        template = loader.get_template("admin/mixing/includes/track_browser.html")
        context = Context({"project": project})
        output = template.render(context)
        # Remove all newlines because Django converts them into <br>
        nonewlines = re.sub(r"[\n\r\t]+", "", output)
        return mark_safe(nonewlines)
