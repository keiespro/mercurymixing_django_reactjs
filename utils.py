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
