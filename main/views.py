from django.contrib.auth.decorators import login_required
from django.http import HttpResponseRedirect, HttpResponse
from django.template.response import TemplateResponse

from .models import Image

import json

#@login_required
def home(request):
  return TemplateResponse(request,"index.html",{})

redirect = lambda request,url: HttpResponseRedirect(url)

@login_required
def find_all(request):
  return HttpResponse(json.dumps([i.data for i in Image.objects.get(user=request.user)]))

@login_required
def find_one(request,pk):
  return HttpResponse(json.dumps(get_object_or_404(Image,pk=pk,user=request.user)))

@login_required
def update(request,pk):
  image = get_object_or_404(Image,pk=pk,user=request.user)
  image.data = request.POST['data']
  image.save()
  return HttpResponse(json.dumps(image))

@login_required
def destroy(request,pk):
  image = get_object_or_404(Image,pk=pk,user=request.user)
  image.delete()
  return HttpResponse('')

@login_required
def create(request):
  image = Image(user=request.user,data='{name: "New Image"}')
  image.save()
  return HttpResponse(json.dumps(image))
