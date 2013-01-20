from django.conf.urls import patterns, include, url
from django.conf.urls.defaults import *

from tastypie.api import Api
from calc.api import AccountResource, TransactionResource

import calc.views

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

v1_api=Api(api_name='v1')
v1_api.register(AccountResource())
v1_api.register(TransactionResource())

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'snowball.views.home', name='home'),
    # url(r'^snowball/', include('snowball.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),

    url(r'^api/', include(v1_api.urls)),

    url(r'^/*$', calc.views.calc_main_view),
)
