// ====================
// Firebase (Für später aktivieren)
// ====================
/*
const firebaseConfig = {
  apiKey: "MEIN_API_KEY",
  authDomain: "join-461.firebaseapp.com",
  databaseURL: "https://join-461-default-rtdb.europe-west1.firebasedatabase.app/",
  projectId: "join-461",
  storageBucket: "join-461.appspot.com",
  messagingSenderId: "MEINE_SENDER_ID",
  appId: "MEINE_APP_ID"
};
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const tasksRef = database.ref('tasks');
const usersRef = database.ref('users');
*/


/**
 * Speichert alle erstellten Aufgaben
 * @type {Array}
 */
let tasks = [];

/**
 * Speichert die aktuell gewählte Priorität
 * @type {string|null}
 */
let currentPriority = null;

/**
 * Platzhalter bis Contacts fertig ist
 * @type {Array}
 */
const PLACEHOLDER_CONTACTS = [
  { id: '1', name: 'Max Mustermann', color: '#FF5733' },
  { id: '2', name: 'Bruce Wayne', color: '#33FF57' },
  { id: '3', name: 'Son Goku', color: '#3357FF' }
];

/**
 * Setzt die Priorität (wird von HTML onclick aufgerufen)
 * @param {string} priority - 'urgent', 'medium', 'low'
 */
function setPriority(priority) {
  const buttons = document.querySelectorAll('.priority-btn');
  buttons.forEach(btn => btn.classList.remove('active'));
  document.getElementById(`priority-${priority}`).classList.add('active');
  currentPriority = priority;
}

/**
 * Fügt einen neuen Subtask hinzu (wird von HTML onclick/onkeypress aufgerufen)
 */
function addSubtask() {
  const input = document.getElementById('task-subtasks');
  const text = input.value.trim();

  if (text) {
    // Neues div-Element für den Subtask erstellen
    const subtaskDiv = document.createElement('div');
    subtaskDiv.classList.add('subtask');

    const span = document.createElement('span');
    span.textContent = text;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '×';
    deleteBtn.classList.add('delete-subtask');

    deleteBtn.addEventListener('click', function () {
      subtaskDiv.remove();
    });

    subtaskDiv.appendChild(span);
    subtaskDiv.appendChild(deleteBtn);

    const container = document.querySelector('.input-with-icon');
    container.parentNode.insertBefore(subtaskDiv, container.nextSibling);

    input.value = '';
  }
}

/**
 * Dropdown für Zuweisung (wird von HTML onload aufgerufen)
 */
function initAssignedToDropdown() {
  const dropdown = document.getElementById('task-assigned');
  
  dropdown.innerHTML = '<option value="" disabled selected>Select contact</option>';
  PLACEHOLDER_CONTACTS.forEach(contact => {
    const option = document.createElement('option');
    option.value = contact.id;
    option.textContent = contact.name;
    option.style.color = contact.color;
    dropdown.appendChild(option);
  });
}

/**
 * Dropdown für Kategorien (wird von HTML onload aufgerufen)
 */
function initCategoryDropdown() {
  const dropdown = document.getElementById('task-category');
  const categories = ["Technical Task", "User Story"];
  
  dropdown.innerHTML = '<option value="" disabled selected>Select category</option>';
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category.toLowerCase().replace(' ', '-');
    option.textContent = category;
    dropdown.appendChild(option);
  });
}

/**
 * Holt alle Werte aus dem Formular für die neue Aufgabe
 * @returns {Object|null} gibt das Task-Objekt zurück oder null, wenn etwas fehlt
 */
function getTaskValues() {
  const title = document.getElementById('task-title').value.trim();
  const dueDate = document.getElementById('task-due-date').value;
  const category = document.getElementById('task-category').value;

  const description = document.getElementById('task-description').value.trim();
  const assignedTo = document.getElementById('task-assigned').value;

  const subtasks = Array.from(document.querySelectorAll('.subtask span'))
    .map(el => el.textContent);

  if (!title || !dueDate || !category || !currentPriority) {
    alert('Please fill in all required fields: Title, Due Date, Category and Priority!');
    return null;
  }

  return {
    title,
    description: description || null,
    dueDate,
    category,
    priority: currentPriority,
    assignedTo: assignedTo || null,
    subtasks: subtasks.length > 0 ? subtasks : null,
    status: 'todo',
    createdAt: new Date().toISOString()
  };
}

/**
 * Speichert den aktuellen Task (wird von HTML onclick aufgerufen)
 */
function saveTask() {
  const task = getTaskValues();
  
  if (!task) return;

  console.log('Task-Daten:', task);
  tasks.push(task);
  console.log('Aktuelle Tasks:', tasks);
  clearForm();
}

/**
 * Leert alle Formularfelder (wird von HTML onclick aufgerufen)
 */
function clearForm() {
  document.getElementById('task-title').value = '';
  document.getElementById('task-description').value = '';
  document.getElementById('task-due-date').value = '';
  document.getElementById('task-assigned').value = '';
  document.getElementById('task-category').value = '';
  document.getElementById('task-subtasks').value = '';

  document.querySelectorAll('.priority-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  currentPriority = null;

  document.querySelectorAll('.subtask').forEach(subtask => {
    subtask.remove();
  });
}



