
from django.conf.urls.defaults import *
from calc.api import AccountResource

account_resource = AccountResource()

urlpatterns = patterns( '',
	(r'^api/', include( account_resource.urls )),
)
