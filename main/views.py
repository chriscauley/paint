from django.http import HttpResponseRedirect
from django.template.response import TemplateResponse

def home(request):
  return TemplateResponse(request,"index.html",{})

redirect = lambda request,url: HttpResponseRedirect(url)
