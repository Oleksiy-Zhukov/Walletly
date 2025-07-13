// Dashboard JavaScript for Walletly
document.addEventListener('DOMContentLoaded', function() {
    initializeCharts();
    initializeInteractions();
    animateMetrics();
});

// Chart initialization
function initializeCharts() {
    initTransactionChart();
    initCategoryChart();
}

// Transaction/Balance Trend Chart
function initTransactionChart() {
    const ctx = document.getElementById('transactionChart').getContext('2d');
    
    // Sample data - replace with your actual data
    const transactionData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [{
            label: 'Balance',
            data: [1000, 1500, 1200, 1800, 2200, 1900, 2500],
            borderColor: '#667eea',
            backgroundColor: 'rgba(102, 126, 234, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#667eea',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 6,
            pointHoverRadius: 8
        }, {
            label: 'Income',
            data: [800, 1200, 900, 1400, 1800, 1500, 2000],
            borderColor: '#4caf50',
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#4caf50',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 6,
            pointHoverRadius: 8
        }, {
            label: 'Expenses',
            data: [600, 800, 700, 900, 1100, 950, 1200],
            borderColor: '#f44336',
            backgroundColor: 'rgba(244, 67, 54, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#f44336',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 6,
            pointHoverRadius: 8
        }]
    };

    new Chart(ctx, {
        type: 'line',
        data: transactionData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: '#667eea',
                    borderWidth: 1,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': $' + context.parsed.y.toLocaleString();
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        },
                        color: '#666',
                        font: {
                            size: 11
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)',
                        drawBorder: false
                    }
                },
                x: {
                    ticks: {
                        color: '#666',
                        font: {
                            size: 11
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)',
                        drawBorder: false
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            },
            elements: {
                line: {
                    tension: 0.4
                },
                point: {
                    hoverBackgroundColor: '#fff',
                    hoverBorderWidth: 3
                }
            }
        }
    });
}

// Category Spending Chart
function initCategoryChart() {
    const ctx = document.getElementById('categoryChart').getContext('2d');
    
    // Sample data - replace with your actual data
    const categoryData = {
        labels: ['Food & Dining', 'Transportation', 'Entertainment', 'Bills & Utilities', 'Shopping', 'Healthcare'],
        datasets: [{
            data: [450, 200, 180, 320, 280, 150],
            backgroundColor: [
                '#667eea',
                '#4caf50',
                '#ff9800',
                '#f44336',
                '#9c27b0',
                '#00bcd4'
            ],
            borderWidth: 0,
            hoverBorderWidth: 3,
            hoverBorderColor: '#fff'
        }]
    };

    new Chart(ctx, {
        type: 'doughnut',
        data: categoryData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        padding: 15,
                        font: {
                            size: 11
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    borderColor: '#667eea',
                    borderWidth: 1,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.parsed / total) * 100).toFixed(1);
                            return context.label + ': $' + context.parsed.toLocaleString() + ' (' + percentage + '%)';
                        }
                    }
                }
            },
            cutout: '65%',
            elements: {
                arc: {
                    borderWidth: 0,
                    hoverBorderWidth: 3
                }
            }
        }
    });
}

// Interactive features
function initializeInteractions() {
    // Chart period buttons
    const chartButtons = document.querySelectorAll('.chart-btn');
    chartButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from siblings
            this.parentNode.querySelectorAll('.chart-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            // Add active class to clicked button
            this.classList.add('active');
            
            // Here you would typically reload the chart with new data
            const period = this.dataset.period;
            console.log('Chart period changed to:', period);
            // updateChartData(period);
        });
    });

    // Metric card hover effects
    const metricCards = document.querySelectorAll('.metric-card');
    metricCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.background = 'linear-gradient(135deg, #f8f9ff 0%, #f0f2ff 100%)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.background = 'white';
        });
    });

    // Activity item interactions
    const activityItems = document.querySelectorAll('.activity-item');
    activityItems.forEach(item => {
        item.addEventListener('click', function() {
            // Add clicked effect
            this.style.transform = 'translateX(10px)';
            setTimeout(() => {
                this.style.transform = 'translateX(5px)';
            }, 150);
            
            // Here you would typically show more details or navigate
            console.log('Activity item clicked');
        });
    });

    // Smooth scrolling for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Animate metric values on page load
function animateMetrics() {
    const metricValues = document.querySelectorAll('.metric-value');
    
    metricValues.forEach(value => {
        const finalValue = value.textContent;
        const numericValue = parseFloat(finalValue.replace(/[^0-9.-]/g, ''));
        
        // Don't animate if value is 0 or negative
        if (numericValue <= 0) return;
        
        let current = 0;
        const increment = numericValue / 60; // 60 frames for 1 second at 60fps
        const isNegative = numericValue < 0;
        
        // Set initial value
        value.textContent = finalValue.includes('$') ? '$0' : '0';
        
        const timer = setInterval(() => {
            current += increment;
            
            // Stop when we reach the target
            if ((!isNegative && current >= numericValue) || (isNegative && current <= numericValue)) {
                current = numericValue;
                clearInterval(timer);
            }
            
            // Format and display the value
            if (finalValue.includes('$')) {
                value.textContent = '$' + Math.floor(Math.abs(current)).toLocaleString();
                if (current < 0) value.textContent = '-' + value.textContent;
            } else {
                value.textContent = Math.floor(Math.abs(current)).toLocaleString();
                if (current < 0) value.textContent = '-' + value.textContent;
            }
        }, 16); // ~60fps
    });
}

// Utility function to update chart data (you can extend this)
function updateChartData(period) {
    // This would typically fetch new data from your backend
    // and update the existing charts
    console.log('Updating chart data for period:', period);
    // Example: fetch(`/api/transactions?period=${period}`)
    //     .then(response => response.json())
    //     .then(data => {
    //         // Update chart with new data
    //         transactionChart.data.datasets[0].data = data.balance;
    //         transactionChart.update();
    //     });
}