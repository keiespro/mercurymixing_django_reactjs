from __future__ import unicode_literals

from django.conf.urls import url, include
from rest_framework import routers
from . import views

router = routers.DefaultRouter()
router.register(r"songs", views.SongViewSet)
router.register(r"groups", views.GroupViewSet)
router.register(r"tracks", views.TrackViewSet)

# Wire up our API using automatic URL routing.
urlpatterns = [
    url(r"^", include(router.urls)),
]
