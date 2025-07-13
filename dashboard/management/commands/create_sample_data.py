from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from dashboard.models import Account, Category, Transaction  # Notice: dashboard.models


class Command(BaseCommand):
    help = "Create sample financial data for testing"

    def add_arguments(self, parser):
        parser.add_argument("username", type=str, help="Username to create data for")

    def handle(self, *args, **options):
        username = options["username"]
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            self.stdout.write(self.style.ERROR(f'User "{username}" does not exist'))
            return

        # Create categories
        categories = [
            {"name": "Food & Dining", "color": "#10b981", "icon": "utensils"},
            {"name": "Transportation", "color": "#6366f1", "icon": "car"},
            {"name": "Shopping", "color": "#f59e0b", "icon": "shopping-bag"},
            {"name": "Entertainment", "color": "#ef4444", "icon": "film"},
            {"name": "Salary", "color": "#8b5cf6", "icon": "briefcase"},
        ]

        for cat_data in categories:
            Category.objects.get_or_create(name=cat_data["name"], defaults=cat_data)

        # Create accounts
        checking = Account.objects.create(
            user=user, name="Main Checking", account_type="checking", balance=5000
        )

        savings = Account.objects.create(
            user=user, name="Emergency Fund", account_type="savings", balance=10000
        )

        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully created sample data for user "{username}"'
            )
        )
