from __future__ import unicode_literals

import sys
import traceback

from StringIO import StringIO

from django.core import mail
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.views.debug import ExceptionReporter


def notify_exception(request, e):
    """
    Emulates Django's email Exception reporter.
    Will produce and send traceback and request info.
    http://stackoverflow.com/a/29878519/1330003
    """
    exc_info = sys.exc_info()
    reporter = ExceptionReporter(request, is_email=True, *exc_info)
    subject = e.message.replace('\n', '\\n').replace('\r', '\\r')[:989]
    message = "%s\n\n%s" % (
        '\n'.join(traceback.format_exception(*exc_info)),
        reporter.filter.get_request_repr(request)
    )
    mail.mail_admins(
        subject, message, fail_silently=True,
        html_message=reporter.get_traceback_html()
    )


def create_temp_file(name="temp.txt", filetype="text"):
    """
    Create an in-memory temporary file.
    Suitable to be attached as file data in tests.
    """
    temp_io = StringIO()
    temp_io.write("Temporary File")
    temp_file = InMemoryUploadedFile(temp_io, None, name, filetype, temp_io.len, None)
    temp_file.seek(0)
    return temp_file


class StatusCodes(object):
    """
    Collection of common HTTP status codes, for readibility.
    A subset of rest_framework.status.
    """
    HTTP_200_OK = 200
    HTTP_301_MOVED_PERMANENTLY = 301
    HTTP_307_TEMPORARY_REDIRECT = 307
    HTTP_400_BAD_REQUEST = 400
    HTTP_401_UNAUTHORIZED = 401
    HTTP_403_FORBIDDEN = 403
    HTTP_404_NOT_FOUND = 404
    HTTP_500_INTERNAL_SERVER_ERROR = 500
    HTTP_502_BAD_GATEWAY = 502
    HTTP_503_SERVICE_UNAVAILABLE = 503


status = StatusCodes()
