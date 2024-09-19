// Elements
const totalValueEl = document.getElementById('total-value');
const addInvestmentBtn = document.getElementById('add-investment-btn');
const investmentForm = document.getElementById('investment-form');
const submitInvestmentBtn = document.getElementById('submit-investment-btn');
const cancelBtn = document.getElementById('cancel-btn');
const investmentTableBody = document.getElementById('investment-table-body');
const assetNameInput = document.getElementById('asset-name');
const amountInvestedInput = document.getElementById('amount-invested');
const currentValueInput = document.getElementById('current-value');
const formTitle = document.getElementById('form-title');
const portfolioChartEl = document.getElementById('portfolio-chart');

let investments = JSON.parse(localStorage.getItem('investments')) || [];
let editingInvestment = null;

// Load investments on page load
document.addEventListener('DOMContentLoaded', () => {
    loadInvestments();
    renderChart();
});

// Event Listeners
addInvestmentBtn.addEventListener('click', () => {
    showForm();
});

cancelBtn.addEventListener('click', () => {
    hideForm();
});

submitInvestmentBtn.addEventListener('click', () => {
    const assetName = assetNameInput.value.trim();
    const amountInvested = parseFloat(amountInvestedInput.value);
    const currentValue = parseFloat(currentValueInput.value);

    if (!assetName || amountInvested <= 0 || currentValue < 0) {
        alert('Please provide valid investment details.');
        return;
    }

    if (editingInvestment !== null) {
        investments[editingInvestment] = { assetName, amountInvested, currentValue };
        editingInvestment = null;
    } else {
        investments.push({ assetName, amountInvested, currentValue });
    }

    saveInvestments();
    loadInvestments();
    renderChart();
    hideForm();
});

// Functions
function showForm(isEdit = false) {
    investmentForm.classList.remove('hidden');
    formTitle.textContent = isEdit ? 'Update Investment' : 'Add New Investment';
}

function hideForm() {
    investmentForm.classList.add('hidden');
    assetNameInput.value = '';
    amountInvestedInput.value = '';
    currentValueInput.value = '';
}

function loadInvestments() {
    investmentTableBody.innerHTML = '';
    let totalValue = 0;

    investments.forEach((investment, index) => {
        const percentageChange = ((investment.currentValue - investment.amountInvested) / investment.amountInvested * 100).toFixed(2);
        totalValue += investment.currentValue;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${investment.assetName}</td>
            <td>$${investment.amountInvested.toFixed(2)}</td>
            <td>$${investment.currentValue.toFixed(2)}</td>
            <td>${percentageChange}%</td>
            <td>
                <button onclick="editInvestment(${index})">Update</button>
                <button onclick="removeInvestment(${index})">Remove</button>
            </td>
        `;
        investmentTableBody.appendChild(row);
    });

    totalValueEl.textContent = totalValue.toFixed(2);
}

function saveInvestments() {
    localStorage.setItem('investments', JSON.stringify(investments));
}

function editInvestment(index) {
    const investment = investments[index];
    assetNameInput.value = investment.assetName;
    amountInvestedInput.value = investment.amountInvested;
    currentValueInput.value = investment.currentValue;
    editingInvestment = index;
    showForm(true);
}

function removeInvestment(index) {
    investments.splice(index, 1);
    saveInvestments();
    loadInvestments();
    renderChart();
}

function renderChart() {
    const ctx = portfolioChartEl.getContext('2d');
    const labels = investments.map(investment => investment.assetName);
    const data = investments.map(investment => investment.currentValue);

    if (window.portfolioChart) {
        window.portfolioChart.destroy();
    }

    window.portfolioChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                label: 'Portfolio Distribution',
                data: data,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true
        }
    });
}
