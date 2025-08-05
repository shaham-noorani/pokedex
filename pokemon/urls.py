from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PokemonViewSet, MoveViewSet

router = DefaultRouter()
router.register(r'pokemon', PokemonViewSet)
router.register(r'moves', MoveViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
