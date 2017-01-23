from __future__ import unicode_literals

from django.conf.urls import url, include
from rest_framework import routers
from . import views

router = routers.DefaultRouter()
router.register(r"songs", views.SongViewSet)
router.register(r"groups", views.GroupViewSet)
router.register(r"tracks", views.TrackViewSet)
router.register(r"comments", views.CommentViewSet)

# Wire up our API using automatic URL routing.
urlpatterns = [
    url(r"^projects/(?P<pk>[0-9]+)/$", views.ProjectDetail.as_view(), name="project_detail"),
    url(r"^api/", include(router.urls)),
]
