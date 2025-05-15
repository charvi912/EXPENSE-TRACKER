let balance = 0;
let totalIncome = 0;
let totalExpenses = 0;
let totalSavingsGoal = 500;
let categoryTotals = { food: 0, travel: 0, health: 0 };
const budgetLimit = 1000; // Budget alert limit
let transactions = [];


document.getElementById('transaction-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const amount = parseFloat(document.getElementById('amount').value);
    const type = document.getElementById('type').value;
    const date = document.getElementById('date').value;
    const note = document.getElementById('note').value || "No note";

    if (!isNaN(amount) && type && date) {
        if (type === 'income') {
            totalIncome += amount;
            balance += amount;
        } else {
            totalExpenses += amount;
            balance -= amount;
            categoryTotals[type] += amount;
        }

        transactions.push({ amount, type, date, note });

        if (totalExpenses > budgetLimit) {
            document.getElementById('budget-alert').innerText = `Budget alert! You have exceeded the limit of ₹₹{budgetLimit}.`;
        }

        updateUI();
        addTransactionToHistory(amount, type, date, note);
        updateChart();
    }
});


function updateUI() {
    document.getElementById('balance').textContent = balance.toFixed(2);
    document.getElementById('income').textContent = totalIncome.toFixed(2);
    document.getElementById('expense').textContent = totalExpenses.toFixed(2);
    const savingsProgress = totalIncome - totalExpenses;
    document.getElementById('savings-progress').textContent = savingsProgress.toFixed(2);
}

function addTransactionToHistory(amount, type, date, note) {
    const historyList = document.getElementById('history-list');
    const newTransaction = document.createElement('div');
    newTransaction.classList.add('history-item');
    newTransaction.innerHTML = `<span>₹{date} - ₹{type}</span><span>₹{note}</span><span>₹{type === 'income' ? '+' : '-'}₹₹{amount.toFixed(2)}</span>`;
    historyList.appendChild(newTransaction);

    document.getElementById('transaction-form').reset();
}


function updateChart() {
    const ctx = document.getElementById('expenseChart').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Food', 'Travel', 'Health'],
            datasets: [{
                label: 'Expenses by Category',
                data: [categoryTotals.food, categoryTotals.travel, categoryTotals.health],
                backgroundColor: ['#ff6384', '#36a2eb', '#ffce56']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}


function exportCSV() {
    const csvContent = "data:text/csv;charset=utf-8,"
        + transactions.map(t => `₹{t.date},₹{t.type},₹{t.amount},₹{t.note}`).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "expense_data.csv");
    document.body.appendChild(link);

    link.click();
    document.body.removeChild(link);
}
