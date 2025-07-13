from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth.decorators import login_required
from django.db.models import Sum, Count
from django.core.paginator import Paginator  # Add this line
from django.utils import timezone  # Add this line
from datetime import datetime, timedelta
from .models import Transaction, Account, Category
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from .forms import TransactionForm  # Fix this line - import from .forms, not as module


def register_view(request):
    print(f"Register view called with method: {request.method}")  # Debug line

    if request.method == "POST":
        print(f"POST data: {request.POST}")  # Debug line
        form = UserCreationForm(request.POST)
        print(f"Form is valid: {form.is_valid()}")  # Debug line

        if form.is_valid():
            user = form.save()
            username = form.cleaned_data.get("username")
            print(f"User created: {username}")  # Debug line
            messages.success(request, f"Account created for {username}!")
            # Log the user in automatically after registration
            login(request, user)
            print("User logged in, redirecting to dashboard")  # Debug line
            return redirect("dashboard")
        else:
            print(f"Form errors: {form.errors}")  # Debug line
    else:
        form = UserCreationForm()

    print("Rendering register template")  # Debug line
    return render(request, "registration/register.html", {"form": form})
    return render(request, "registration/register.html", {"form": form})


def login_view(request):
    if request.method == "POST":
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            username = form.cleaned_data.get("username")
            password = form.cleaned_data.get("password")
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                messages.info(request, f"You are now logged in as {username}.")
                return redirect("dashboard")
            else:
                messages.error(request, "Invalid username or password.")
        else:
            messages.error(request, "Invalid username or password.")
    form = AuthenticationForm()
    return render(request, "registration/login.html", {"form": form})


def logout_view(request):
    logout(request)
    messages.info(request, "You have successfully logged out.")
    return redirect("login")


@login_required
def transactions(request):
    """Display all transactions for the current user"""
    user_transactions = Transaction.objects.filter(user=request.user).order_by("-date")

    # Add pagination
    paginator = Paginator(user_transactions, 20)  # Show 20 transactions per page
    page_number = request.GET.get("page")
    page_obj = paginator.get_page(page_number)

    context = {
        "transactions": page_obj,
        "total_transactions": user_transactions.count(),
    }

    return render(request, "transactions.html", context)


@login_required
def add_transaction(request):
    """Add a new transaction"""
    if request.method == "POST":
        form = TransactionForm(request.user, request.POST)
        if form.is_valid():
            transaction = form.save(commit=False)
            transaction.user = request.user
            transaction.save()
            messages.success(request, "Transaction added successfully!")
            return redirect("transactions")
    else:
        form = TransactionForm(request.user)

    context = {"form": form, "title": "Add Transaction"}

    return render(request, "add_transaction.html", context)


@login_required
def accounts(request):
    """Display all accounts for the current user"""
    user_accounts = Account.objects.filter(user=request.user)

    # Calculate total balance
    total_balance = sum(account.balance for account in user_accounts)

    context = {
        "accounts": user_accounts,
        "total_balance": total_balance,
    }

    return render(request, "accounts.html", context)


@login_required
def budget(request):
    """Budget overview page"""
    user = request.user

    # Get current month data
    current_month = timezone.now().replace(day=1)

    # Calculate budget metrics
    monthly_budget = 2500  # You can make this configurable later
    monthly_expenses = (
        Transaction.objects.filter(
            user=user, date__gte=current_month, transaction_type="expense"
        ).aggregate(total=Sum("amount"))["total"]
        or 0
    )

    budget_left = monthly_budget - monthly_expenses
    budget_used_percentage = (
        (monthly_expenses / monthly_budget * 100) if monthly_budget > 0 else 0
    )

    # Get spending by category
    spending_by_category = (
        Transaction.objects.filter(
            user=user, date__gte=current_month, transaction_type="expense"
        )
        .values("category__name")
        .annotate(total=Sum("amount"))
        .order_by("-total")
    )

    context = {
        "monthly_budget": monthly_budget,
        "monthly_expenses": monthly_expenses,
        "budget_left": budget_left,
        "budget_used_percentage": round(budget_used_percentage, 1),
        "spending_by_category": spending_by_category,
    }

    return render(request, "budget.html", context)


# Optional: Transaction detail view
@login_required
def transaction_detail(request, transaction_id):
    """View details of a specific transaction"""
    transaction = get_object_or_404(Transaction, id=transaction_id, user=request.user)

    context = {
        "transaction": transaction,
    }

    return render(request, "transaction_detail.html", context)


# Optional: Delete transaction
@login_required
def delete_transaction(request, transaction_id):
    """Delete a transaction"""
    transaction = get_object_or_404(Transaction, id=transaction_id, user=request.user)

    if request.method == "POST":
        transaction.delete()
        messages.success(request, "Transaction deleted successfully!")
        return redirect("transactions")

    context = {
        "transaction": transaction,
    }

    return render(request, "confirm_delete.html", context)


@login_required
def dashboard(request):
    """Enhanced dashboard view with actual data calculations"""
    user = request.user

    # Get current month data
    current_month = timezone.now().replace(day=1)

    # Calculate dashboard metrics
    total_balance = (
        Account.objects.filter(user=user).aggregate(total=Sum("balance"))["total"] or 0
    )

    monthly_income = (
        Transaction.objects.filter(
            user=user, date__gte=current_month, transaction_type="income"
        ).aggregate(total=Sum("amount"))["total"]
        or 0
    )

    monthly_expenses = (
        Transaction.objects.filter(
            user=user, date__gte=current_month, transaction_type="expense"
        ).aggregate(total=Sum("amount"))["total"]
        or 0
    )

    # Budget calculation (you can make this configurable)
    monthly_budget = 2500  # Example budget
    budget_left = monthly_budget - monthly_expenses
    budget_used_percentage = (
        (monthly_expenses / monthly_budget * 100) if monthly_budget > 0 else 0
    )

    # Get spending by category for chart
    spending_by_category = (
        Transaction.objects.filter(
            user=user, date__gte=current_month, transaction_type="expense"
        )
        .values("category__name")
        .annotate(total=Sum("amount"))
        .order_by("-total")[:5]
    )

    # Get cash flow data for the last 6 months
    cash_flow_data = []
    for i in range(6):
        month_start = (current_month - timedelta(days=32 * i)).replace(day=1)
        month_end = (month_start + timedelta(days=32)).replace(day=1) - timedelta(
            days=1
        )

        month_income = (
            Transaction.objects.filter(
                user=user,
                date__range=[month_start, month_end],
                transaction_type="income",
            ).aggregate(total=Sum("amount"))["total"]
            or 0
        )

        month_expenses = (
            Transaction.objects.filter(
                user=user,
                date__gte=month_start,
                date__lte=month_end,
                transaction_type="expense",
            ).aggregate(total=Sum("amount"))["total"]
            or 0
        )

        cash_flow_data.append(
            {
                "month": month_start.strftime("%b"),
                "income": float(month_income),
                "expenses": float(month_expenses),
                "net": float(month_income - month_expenses),
            }
        )

    context = {
        "total_balance": total_balance,
        "monthly_income": monthly_income,
        "monthly_expenses": monthly_expenses,
        "budget_left": budget_left,
        "budget_used_percentage": round(budget_used_percentage, 1),
        "spending_by_category": list(spending_by_category),
        "cash_flow_data": list(reversed(cash_flow_data)),
    }

    return render(request, "home.html", context)
