// Stores all created tasks in an array
let tasks = [];

// Keeps track of which priority is currently selected
let currentPriority = null;

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

    deleteBtn.addEventListener('click', function() {
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
  const dropdown = document.getElementById('task-assigned');
  
  try {
    const response = await fetch('https://join-461-default-rtdb.europe-west1.firebasedatabase.app/contacts.json');
    const contacts = await response.json();
    
    while (dropdown.options.length > 1) {
      dropdown.remove(1);
    }
  
    for (const id in contacts) {
      if (contacts.hasOwnProperty(id)) {
        const contact = contacts[id];
        const option = new Option(contact.name, id);
        dropdown.add(option);
      }
    }
  } catch (error) {
    console.error('Error loading contacts:', error);
  }
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
 * Saves the task when user clicks create button
 */
function saveTask() {
  const task = getTaskValues();
  
  if (!task) return;

  console.log('Task data:', task);
  tasks.push(task);
  console.log('All tasks:', tasks);
  clearForm();
}

/**
 * Clears all form fields when user clicks clear button
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