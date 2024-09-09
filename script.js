// Global variables
let portfolio = JSON.parse(localStorage.getItem('portfolio')) || [];
let chartInstance = null;

// Function to render the portfolio list
function renderPortfolio() {
    const portfolioList = document.getElementById('portfolio-list');
    const totalValueElement = document.getElementById('total-value');
    portfolioList.innerHTML = '';

    let totalValue = 0;

    portfolio.forEach((investment, index) => {
        totalValue += investment.currentValue;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${investment.assetName}</td>
            <td>$${investment.amountInvested.toFixed(2)}</td>
            <td>$${investment.currentValue.toFixed(2)}</td>
            <td>${((investment.currentValue - investment.amountInvested) / investment.amountInvested * 100).toFixed(2)}%</td>
            <td>
                <button class="update-btn" data-index="${index}">Update</button>
                <button class="remove-btn" data-index="${index}">Remove</button>
            </td>
        `;
        portfolioList.appendChild(row);
    });

    totalValueElement.textContent = `$${totalValue.toFixed(2)}`;

    // Attach event listeners for update and remove buttons
    document.querySelectorAll('.update-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const index = event.target.dataset.index;
            updateInvestment(index);
        });
    });

    document.querySelectorAll('.remove-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const index = event.target.dataset.index;
            removeInvestment(index);
        });
    });

    // Update the chart with the new data
    updateChart();
}

// Function to add a new investment
function addInvestment(event) {
    event.preventDefault();
    const assetName = document.getElementById('asset-name').value;
    const amountInvested = parseFloat(document.getElementById('amount-invested').value);
    const currentValue = parseFloat(document.getElementById('current-value').value);

    if (isNaN(amountInvested) || isNaN(currentValue)) {
        alert('Please enter valid numbers for investment amounts.');
        return;
    }

    portfolio.push({ assetName, amountInvested, currentValue });
    localStorage.setItem('portfolio', JSON.stringify(portfolio));
    renderPortfolio();

    // Reset form inputs
    document.getElementById('add-investment-form').reset();
}

// Function to update an investment's current value
function updateInvestment(index) {
    const newValue = parseFloat(prompt('Enter the new current value:'));
    if (isNaN(newValue) || newValue < 0) {
        alert('Please enter a valid number for the current value.');
        return;
    }
    portfolio[index].currentValue = newValue;
    localStorage.setItem('portfolio', JSON.stringify(portfolio));
    renderPortfolio();
}

// Function to remove an investment
function removeInvestment(index) {
    portfolio.splice(index, 1);
    localStorage.setItem('portfolio', JSON.stringify(portfolio));
    renderPortfolio();
}

// Function to update the portfolio pie chart
function updateChart() {
    const portfolioChartElement = document.getElementById('portfolio-chart').getContext('2d');
    const labels = portfolio.map(investment => investment.assetName);
    const data = portfolio.map(investment => investment.currentValue);

    // Destroy the existing chart instance if it exists
    if (chartInstance) {
        chartInstance.destroy();
    }

    // Create a new chart instance and store it in chartInstance
    chartInstance = new Chart(portfolioChartElement, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: ['#007bff', '#28a745', '#ffc107', '#dc3545', '#6f42c1', '#17a2b8'],
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
        }
    });
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('add-investment-form').addEventListener('submit', addInvestment);
    renderPortfolio();
});
