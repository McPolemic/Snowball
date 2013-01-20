
from tastypie.resources import ModelResource
from calc.models import Account

class AccountResource(ModelResource):
	class Meta:
		queryset = Account.objects.all()
		resource_name = 'accounts'
