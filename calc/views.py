from django.shortcuts import render_to_response

def calc_main_view(request):
	return render_to_response('account.html', {})
