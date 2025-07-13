document.addEventListener("DOMContentLoaded", function() {
    // Bar chart (myChart)
    // Spending per category for last month, this month, and last year
    var ctx1 = document.getElementById('myChart').getContext('2d');
    var myChart = new Chart(ctx1, {
        type: 'bar',
        data: {
            labels: ['Groceries', 'Rent', 'Entertainment', 'Utilities', 'Transportation'], // Example categories
            datasets: [
                {
                    label: 'Last Month ($)',
                    data: [1200, 2000, 500, 300, 400], // Spending for the last month
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Previous Month ($)',
                    data: [1100, 2100, 450, 350, 450], // Spending for the previous month
                    backgroundColor: 'rgba(255, 159, 64, 0.5)',
                    borderColor: 'rgba(255, 159, 64, 1)',
                    borderWidth: 1,
                    hidden: true  // Hide by default
                },
                {
                    label: 'Last Year ($)',
                    data: [1000, 2200, 600, 400, 500], // Spending for the same month last year
                    backgroundColor: 'rgba(75, 192, 192, 0.5)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                    hidden: true  // Hide by default
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Category'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Amount ($)'
                    },
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    onClick: function(e, legendItem) {
                        // Toggle visibility when clicking legend items
                        const index = legendItem.datasetIndex;
                        const chart = this.chart;
                        const meta = chart.getDatasetMeta(index);

                        // Toggle visibility of the dataset when clicked
                        meta.hidden = !meta.hidden;
                        chart.update();
                    }
                },
                title: {
                    display: true,
                    text: 'Last Month Spending Per Category'  // Change the title
                }
            }
        }
    });

    // Line chart (netWorthChart)
    var ctx2 = document.getElementById('netWorthChart').getContext('2d');
    const netWorthData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
            label: 'Net Worth ($)',
            data: [10000, 12000, 15000, 17000, 20000, 25000],
            borderColor: '#4CAF50',
            backgroundColor: 'rgba(76, 175, 80, 0.2)',
            borderWidth: 3,
            tension: 0.4,
        }]
    };

    const config = {
        type: 'line',
        data: netWorthData,
        options: {
            responsive: true,
            plugins: {
                legend: { display: true, position: 'top' },
            },
            scales: {
                x: { title: { display: true, text: 'Month' }},
                y: { title: { display: true, text: 'Net Worth ($)' }, beginAtZero: true },
            }
        }
    };

    new Chart(ctx2, config);
});

function toggleDropdown() {
    const menu = document.getElementById("dropdown-menu");
    menu.classList.toggle("hidden");
}

// Optional: close dropdown when clicking outside
document.addEventListener("click", function (event) {
    const profile = document.querySelector(".profile-dropdown");
    const menu = document.getElementById("dropdown-menu");

    if (!profile.contains(event.target)) {
        menu.classList.add("hidden");
    }
});
// Optional: close dropdown when pressing Escape
document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        const menu = document.getElementById("dropdown-menu");
        if (!menu.classList.contains("hidden")) {
            menu.classList.add("hidden");
        }
    }
}
); 
