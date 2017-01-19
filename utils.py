import sys
import traceback

from django.core import mail
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
