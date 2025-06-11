let allTasks = {};
let allContacts = {};


async function init() {
    await loadContacts();
    await loadTasks();
    renderBoard();
}

async function loadContacts() {
    try {
        const response = await fetch('https://join-461-default-rtdb.europe-west1.firebasedatabase.app/contacts.json');
        allContacts = await response.json() || {};
    } catch (error) {
        console.error('Error loading contacts:', error);
        allContacts = {};
    }
}

async function loadTasks() {
    try {
        const response = await fetch('https://join-461-default-rtdb.europe-west1.firebasedatabase.app/tasks.json');
        allTasks = await response.json() || {};
    } catch (error) {
        console.error('Error loading tasks:', error);
        allTasks = {};
    }
}