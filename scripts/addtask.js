// Stores all created tasks in an array
let tasks = [];

// Keeps track of which priority is currently selected
let currentPriority = null;

// Array to store selected contacts
let selectedContacts = [];

// Variable to store all contacts
let allContacts = {};

/**
 * Sets the priority when user clicks a priority button
 * @param {string} priority - can be 'urgent', 'medium', or 'low'
 */
function setPriority(priority) {
  const buttons = document.querySelectorAll('.priority-btn');
  buttons.forEach(btn => btn.classList.remove('active'));
  document.getElementById(`priority-${priority}`).classList.add('active');
  currentPriority = priority;
}

/**
 * Adds a new subtask when user clicks add button or presses enter
 */
function addSubtask() {
  const input = document.getElementById('task-subtasks');
  const text = input.value.trim();

  if (text) {
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
 * Loads contacts from Firebase and shows them in the dropdown
 */
async function initAssignedToDropdown() {
  if (Object.keys(allContacts).length > 0) return; // Already loaded

  try {
    const response = await fetch('https://join-461-default-rtdb.europe-west1.firebasedatabase.app/contacts.json');
    allContacts = await response.json();


    renderContactsDropdown();
  } catch (error) {
    console.error('Error loading contacts:', error);
  }
}

/**
 * Renders the contacts dropdown with checkboxes
 */
function renderContactsDropdown() {
  const dropdown = document.getElementById('contacts-dropdown');
  dropdown.innerHTML = '';

  for (const id in allContacts) {
    if (allContacts.hasOwnProperty(id)) {
      const contact = allContacts[id];
      const isSelected = selectedContacts.some(c => c.id === id);

      const optionDiv = document.createElement('div');
      optionDiv.classList.add('multi-select-option');

      optionDiv.innerHTML = `
                        <input type="checkbox" id="contact-${id}" ${isSelected ? 'checked' : ''} 
                               onchange="toggleContact('${id}', '${contact.name}')">
                        <label for="contact-${id}">${contact.name}</label>
                    `;

      dropdown.appendChild(optionDiv);
    }
  }
}

/**
 * Toggles the assigned to dropdown
 */
function toggleAssignedDropdown() {
  const dropdown = document.getElementById('contacts-dropdown');
  const isVisible = dropdown.style.display === 'block';
  dropdown.style.display = isVisible ? 'none' : 'block';

  if (!isVisible && Object.keys(allContacts).length === 0) {
    initAssignedToDropdown();
  }
}

/**
 * Toggles a contact selection
 */
function toggleContact(contactId, contactName) {
  const existingIndex = selectedContacts.findIndex(c => c.id === contactId);

  if (existingIndex > -1) {
    selectedContacts.splice(existingIndex, 1);
  } else {
    selectedContacts.push({ id: contactId, name: contactName });
  }

  updateSelectedContactsDisplay();
}

/**
 * Updates the display of selected contacts
 */
function updateSelectedContactsDisplay() {
  const container = document.getElementById('selected-contacts');

  if (selectedContacts.length === 0) {
    container.innerHTML = '<span style="color: #999;">Select contacts to assign</span>';
  } else {
    container.innerHTML = '';
    selectedContacts.forEach(contact => {
      const tag = document.createElement('div');
      tag.classList.add('selected-tag');
      tag.innerHTML = `
                        ${contact.name}
                        <span class="remove" onclick="removeContact('${contact.id}')">&times;</span>
                    `;
      container.appendChild(tag);
    });
  }
}

/**
 * Removes a contact from selection
 */
function removeContact(contactId) {
  selectedContacts = selectedContacts.filter(c => c.id !== contactId);
  updateSelectedContactsDisplay();
  renderContactsDropdown();
}

/**
 * Sets up the category dropdown with default options
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
 * Gets all values from the form to create a new task
 * @returns {Object|null} The task data or null if required fields are missing
 */
function getTaskValues() {
  const title = document.getElementById('task-title').value.trim();
  const dueDate = document.getElementById('task-due-date').value;
  const category = document.getElementById('task-category').value;

  const description = document.getElementById('task-description').value.trim();

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
    assignedTo: selectedContacts.length > 0 ? selectedContacts : null,
    subtasks: subtasks.length > 0 ? subtasks : null,
    status: 'todo',
    createdAt: new Date().toISOString()
  };
}

/**
 * Saves the task when user clicks create button
 */
async function saveTask() {
  const task = getTaskValues();

  if (!task) return;

  try {
    const response = await fetch('https://join-461-default-rtdb.europe-west1.firebasedatabase.app/tasks.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(task)
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    console.log('Task saved successfully:', data);
    clearForm();
    alert('Task created successfully!');
  } catch (error) {
    console.error('Error saving task:', error);
    alert('Error saving task. Please try again.');
  }
}

/**
 * Clears all form fields when user clicks clear button
 */
function clearForm() {
  document.getElementById('task-title').value = '';
  document.getElementById('task-description').value = '';
  document.getElementById('task-due-date').value = '';
  document.getElementById('task-category').value = '';
  document.getElementById('task-subtasks').value = '';

  document.querySelectorAll('.priority-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  currentPriority = null;

  document.querySelectorAll('.subtask').forEach(subtask => {
    subtask.remove();
  });

  selectedContacts = [];
  updateSelectedContactsDisplay();
  document.getElementById('contacts-dropdown').style.display = 'none';
}

// Close dropdown when clicking outside
document.addEventListener('click', function (event) {
  const wrapper = document.querySelector('.multi-select-wrapper');
  const dropdown = document.getElementById('contacts-dropdown');

  if (!wrapper.contains(event.target)) {
    dropdown.style.display = 'none';
  }
});