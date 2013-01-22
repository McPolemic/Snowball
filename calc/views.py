from django.shortcuts import render_to_response
from django.contrib.auth.decorators import login_required

def calc_main_view(request):
	return render_to_response('account.html', {})
