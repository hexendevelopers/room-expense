import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getDatabase, ref, onValue, update } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";

// Your Firebase configuration object
const firebaseConfig = {
    apiKey: "AIzaSyBOAX1RPqMuHVipjEKogEA-Gr7QVqtaZpM",
    authDomain: "room-expense-tracker-4cc0c.firebaseapp.com",
    projectId: "room-expense-tracker-4cc0c",
    storageBucket: "room-expense-tracker-4cc0c.appspot.com",
    messagingSenderId: "486310102636",
    appId: "1:486310102636:web:763371dc857a3b9d983a49"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const paymentsRef = ref(database, 'payments');

// Function to calculate count and total amount by payer
function calculateStats(data) {
    const stats = {
        shijas: { count: 0, total: 0 },
        swalih: { count: 0, total: 0 },
        sabth: { count: 0, total: 0 },
        nishad: { count: 0, total: 0 }
    };
    let totalAmount = 0;

    data.forEach(item => {
        if (stats.hasOwnProperty(item.paidBy)) {
            stats[item.paidBy].count++;
            stats[item.paidBy].total += parseFloat(item.amount);
        }
        totalAmount += parseFloat(item.amount);
    });

    return { stats, totalAmount };
}

// Function to enable editing a payment
function enableEditing(row, paymentData) {
    row.innerHTML = `
        <td><input type="text" value="${paymentData.purpose}" id="purposeInput" /></td>
        <td><input type="text" value="${paymentData.amount}" id="amountInput" /></td>
        <td><input type="text" value="${paymentData.paidBy}" id="paidByInput" /></td>
        <td>${paymentData.timestamp}</td>
        <td><button class="saveBtn">Save</button></td>
    `;

    row.querySelector('.saveBtn').addEventListener('click', () => {
        const updatedData = {
            purpose: row.querySelector('#purposeInput').value,
            amount: parseFloat(row.querySelector('#amountInput').value),
            paidBy: row.querySelector('#paidByInput').value,
            timestamp: paymentData.timestamp // Keep the original timestamp
        };
        savePaymentData(paymentData.key, updatedData);
    });
}

// Function to save the updated payment data to Firebase
function savePaymentData(key, data) {
    const paymentRef = ref(database, `payments/${key}`);
    update(paymentRef, data).then(() => {
        alert('Data updated successfully');
    }).catch((error) => {
        console.error('Error updating data:', error);
    });
}

// Fetch and display data
onValue(paymentsRef, (snapshot) => {
    const tableBody = document.querySelector('#paymentsTable tbody');
    const shijasCountElem = document.getElementById('shijasCount');
    const shijasAmountElem = document.getElementById('shijasAmount');
    const swalihCountElem = document.getElementById('swalihCount');
    const swalihAmountElem = document.getElementById('swalihAmount');
    const sabthCountElem = document.getElementById('sabthCount');
    const sabthAmountElem = document.getElementById('sabthAmount');
    const nishadCountElem = document.getElementById('nishadCount');
    const nishadAmountElem = document.getElementById('nishadAmount');
    const totalAmountElem = document.getElementById('totalAmount');

    tableBody.innerHTML = ''; // Clear existing data

    const paymentsData = [];
    snapshot.forEach((childSnapshot) => {
        const data = childSnapshot.val();
        paymentsData.push({
            key: childSnapshot.key, // Add the key to the payment data
            purpose: data.purpose,
            amount: data.amount,
            paidBy: data.paidBy,
            timestamp: new Date(data.timestamp).toLocaleString()
        });
    });

    const { stats, totalAmount } = calculateStats(paymentsData);

    shijasCountElem.textContent = stats.shijas.count;
    shijasAmountElem.textContent = stats.shijas.total.toFixed(2);
    swalihCountElem.textContent = stats.swalih.count;
    swalihAmountElem.textContent = stats.swalih.total.toFixed(2);
    sabthCountElem.textContent = stats.sabth.count;
    sabthAmountElem.textContent = stats.sabth.total.toFixed(2);
    nishadCountElem.textContent = stats.nishad.count;
    nishadAmountElem.textContent = stats.nishad.total.toFixed(2);
    totalAmountElem.textContent = totalAmount.toFixed(2);

    paymentsData.forEach((data) => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${data.purpose}</td>
            <td>${data.amount}</td>
            <td>${data.paidBy}</td>
            <td>${data.timestamp}</td>
            <td><button class="editBtn">Edit</button></td>
        `;

        row.querySelector('.editBtn').addEventListener('click', () => {
            enableEditing(row, data);
        });

        tableBody.appendChild(row);
    });
});

// Export to Excel functionality
document.getElementById('exportBtn').addEventListener('click', () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.table_to_sheet(document.getElementById('paymentsTable'));
    XLSX.utils.book_append_sheet(wb, ws, 'Payments');
    XLSX.writeFile(wb, 'payments.xlsx');
});
