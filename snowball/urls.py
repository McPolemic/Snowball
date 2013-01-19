from django.conf.urls import patterns, include, url
from django.conf.urls.defaults import *
from calc.api import AccountResource

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

account_resource = AccountResource()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'snowball.views.home', name='home'),
    # url(r'^snowball/', include('snowball.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),

    url(r'^api/', include(account_resource.urls)),
)
