from django.db.models import Sum
from .models import Account


def user_financial_data(request):
    """Add user financial data to all templates"""
    if request.user.is_authenticated:
        total_balance = (
            Account.objects.filter(user=request.user).aggregate(total=Sum("balance"))[
                "total"
            ]
            or 0
        )

        return {
            "user_balance": total_balance,
            "user_account_count": Account.objects.filter(user=request.user).count(),
        }
    return {}
