import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";

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

document.getElementById('inputForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const purpose = document.getElementById('purpose').value;
    const amount = document.getElementById('amount').value;
    const paidBy = document.getElementById('options').value;
    const timestamp = new Date().toISOString(); // Current date and time

    // Save data to Firebase
    push(ref(database, 'payments'), {
        purpose: purpose,
        amount: amount,
        paidBy: paidBy,
        timestamp: timestamp
    }).then(() => {
        alert('Data saved successfully!');
    }).catch((error) => {
        console.error('Error saving data: ', error);
    });

    // Clear the form
    document.getElementById('inputForm').reset();
});

let btn = document.getElementById("btn");

btn.addEventListener("click", () => {
    window.location.href = "viewPayments.html";
});
