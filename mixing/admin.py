from __future__ import unicode_literals

from django.contrib import admin

from .models import Project


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    fields = (
        "title", "owner", "created", "updated", "status", "priority")
    readonly_fields = ["owner", "created", "updated"]
    list_display = ["title", "owner", "created", "status", "priority"]
    list_editable = ["priority"]
    date_hierarchy = "created"
    list_filter = ["status"]
    search_fields = ["title", "owner__username"]
    ordering = ["priority", "-created"]
