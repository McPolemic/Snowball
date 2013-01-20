from django.core.exceptions import MultipleObjectsReturned
from django.conf.urls import url
from tastypie.resources import ModelResource
from tastypie.utils import trailing_slash
from tastypie import fields 
from calc.models import Account, Transaction


class MyModelResource(ModelResource):
    pass


class AccountResource(MyModelResource):
    # USER

    # Not sure I even need this one... originally added for reverse lookup
    #transactions = fields.ToManyField('calc.api.TransactionResource', 'transaction_set', related_name='account', full=False, null=True)

    class Meta:
        queryset = Account.objects.all()
        resource_name = 'accounts'

    def override_urls(self):
        return [
            url(r"^(?P<resource_name>%s)/(?P<pk>\w[\w/-]*)/transactions%s$" % (self._meta.resource_name, trailing_slash()), self.wrap_view('get_transactions'), name="api_get_transactions"),
        ]

    def get_transactions(self, request, **kwargs):
        try:
            obj = self.cached_obj_get(request=request, **self.remove_api_resource_names(kwargs))
        except ObjectDoesNotExist:
            return HttpGone()
        except MultipleObjectsReturned:
            return HttpMultipleChoices("More than one resource is found at this URI.")

        transaction_resource = TransactionResource()
        return transaction_resource.get_list(request, account=obj.pk)


class TransactionResource(MyModelResource):
    # USER
    account = fields.ForeignKey(AccountResource, 'account')

    class Meta:
        queryset = Transaction.objects.all()
        resource_name = 'transactions'
        filtering = {
            'account': 'exact'
        }
