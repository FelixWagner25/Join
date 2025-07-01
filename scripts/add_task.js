// Keeps track of which priority is currently selected
let currentPriority = null;

// Array to store selected contacts
let selectedContacts = [];

// Variable to store all contacts
let allContacts = {};

async function addNewTask() {
  let newTaskData = getNewTaskInformation();
  // await submitObjectToDatabase("tasks", newTaskData);
  //renderBoard();
  closeAddTaskOverlay();
  showNewTaskCreatedMessage();
}

function getNewTaskInformation() {}

function closeAddTaskOverlay() {}

function showNewTaskCreatedMessage() {}

function setTaskPriority(htmlId) {
  let buttons = document.getElementsByClassName("task-priority-btn");
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].classList.remove("active-urgent", "active-medium", "active-low");
  }
  let activeBtn = document.getElementById(htmlId);
  switch (htmlId) {
    case "task-priority-urgent":
      activeBtn.classList.add("active-urgent");
      break;
    case "task-priority-low":
      activeBtn.classList.add("active-low");
    default:
      activeBtn.classList.add("active-medium");
      break;
  }
}

function toggleTaskCategoryDropdown() {
  let categoryDropdownRef = document.getElementById("task-category-dropdown");
  let categoryDropdownIconRef = document.getElementById(
    "task-category-dropdown-icon"
  );
  clearInputTagValue("task-category");
  categoryDropdownRef.classList.toggle("d-none");
  categoryDropdownIconRef.classList.toggle("task-dropdown-open-icon");
}

function clearInputTagValue(htmlId) {
  let inputRef = document.getElementById(htmlId);
  inputRef.value = "";
}

function setInputTagValue(htmlId, valueToSet) {
  let inputRef = document.getElementById(htmlId);
  inputRef.value = valueToSet;
}

async function loadContacts() {
  try {
    const response = await fetch(
      "https://join-461-default-rtdb.europe-west1.firebasedatabase.app/contacts.json"
    );
    allContacts = (await response.json()) || {};
  } catch (error) {
    console.error("Error loading contacts:", error);
    allContacts = {};
  }
}

/**
 * Sets the priority when user clicks a priority button
 * @param {string} priority - can be 'urgent', 'medium', or 'low'
 */
function setPriority(priority) {
  const buttons = document.querySelectorAll(".priority-btn");
  buttons.forEach((btn) => btn.classList.remove("active"));
  document.getElementById(`priority-${priority}`).classList.add("active");
  currentPriority = priority;
}

/**
 * Creates a delete button for subtasks
 * @param {HTMLElement} subtaskDiv - The subtask div to remove when clicked
 * @returns {HTMLElement} The delete button element
 */
function createDeleteButton(subtaskDiv) {
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "×";
  deleteBtn.classList.add("delete-subtask");
  deleteBtn.addEventListener("click", () => subtaskDiv.remove());
  return deleteBtn;
}

/**
 * Creates a complete subtask element
 * @param {string} text - The subtask text
 * @returns {HTMLElement} The complete subtask div
 */
function createSubtaskElement(text) {
  const subtaskDiv = document.createElement("div");
  subtaskDiv.classList.add("subtask");

  const span = document.createElement("span");
  span.textContent = text;

  const deleteBtn = createDeleteButton(subtaskDiv);

  subtaskDiv.appendChild(span);
  subtaskDiv.appendChild(deleteBtn);

  return subtaskDiv;
}

/**
 * Adds the subtask element to the DOM
 * @param {HTMLElement} subtaskElement - The subtask element to add
 */
function insertSubtaskIntoDOM(subtaskElement) {
  const container = document.querySelector(".input-with-icon");
  container.parentNode.insertBefore(subtaskElement, container.nextSibling);
}

/**
 * Main function to add a new subtask
 */
function addSubtask() {
  const input = document.getElementById("task-subtasks");
  const text = input.value.trim();

  if (text) {
    const subtaskElement = createSubtaskElement(text);
    insertSubtaskIntoDOM(subtaskElement);
    input.value = "";
  }
}

/**
 * Loads contacts from Firebase and shows them in the dropdown
 */
async function initAssignedToDropdown() {
  if (Object.keys(allContacts).length > 0) return; // Already loaded

  try {
    const response = await fetch(
      "https://join-461-default-rtdb.europe-west1.firebasedatabase.app/contacts.json"
    );
    allContacts = await response.json();

    renderContactsDropdown();
  } catch (error) {
    console.error("Error loading contacts:", error);
  }
}

/**
 * Creates a dropdown option element for a single contact
 */
function createContactOption(id, contact, isSelected) {
  const optionDiv = document.createElement("div");
  optionDiv.classList.add("multi-select-option d-flex-align-item-c");

  optionDiv.innerHTML = `
    <input type="checkbox" id="contact-${id}" ${isSelected ? "checked" : ""} 
           onchange="toggleContact('${id}', '${contact.name}')">
    <label for="contact-${id}">${contact.name}</label>
  `;

  return optionDiv;
}

/**
 * Checks if a contact is currently selected
 */
function isContactSelected(id) {
  return selectedContacts.some((c) => c.id === id);
}

/**
 * Clears and rebuilds the contacts dropdown
 */
function renderContactsDropdown() {
  const dropdown = document.getElementById("contacts-dropdown");
  dropdown.innerHTML = "";

  for (const id in allContacts) {
    if (allContacts.hasOwnProperty(id)) {
      const contact = allContacts[id];
      const option = createContactOption(id, contact, isContactSelected(id));
      dropdown.appendChild(option);
    }
  }
}

/**
 * Toggles the assigned to dropdown
 */
function toggleAssignedDropdown() {
  const dropdown = document.getElementById("contacts-dropdown");
  const isVisible = dropdown.style.display === "block";
  dropdown.style.display = isVisible ? "none" : "block";

  if (!isVisible && Object.keys(allContacts).length === 0) {
    initAssignedToDropdown();
  }
}

/**
 * Toggles a contact selection
 */
function toggleContact(contactId, contactName) {
  const existingIndex = selectedContacts.findIndex((c) => c.id === contactId);

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
  const container = document.getElementById("selected-contacts");

  if (selectedContacts.length === 0) {
    container.innerHTML =
      '<span style="color: #999;">Select contacts to assign</span>';
  } else {
    container.innerHTML = "";
    selectedContacts.forEach((contact) => {
      const tag = document.createElement("div");
      tag.classList.add("selected-tag");
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
  selectedContacts = selectedContacts.filter((c) => c.id !== contactId);
  updateSelectedContactsDisplay();
  renderContactsDropdown();
}

/**
 * Sets up the category dropdown with default options
 */
function initCategoryDropdown() {
  const dropdown = document.getElementById("task-category");
  const categories = ["Technical Task", "User Story"];

  dropdown.innerHTML =
    '<option value="" disabled selected>Select category</option>';
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.toLowerCase().replace(" ", "-");
    option.textContent = category;
    dropdown.appendChild(option);
  });
}

/**
 * Gets all values from the form to create a new task
 * @returns {Object|null} The task data or null if required fields are missing
 */
function getTaskValues() {
  const title = document.getElementById("task-title").value.trim();
  const dueDate = document.getElementById("task-due-date").value;
  const category = document.getElementById("task-category").value;

  const description = document.getElementById("task-description").value.trim();

  const subtasks = Array.from(document.querySelectorAll(".subtask span")).map(
    (el) => el.textContent
  );

  if (!title || !dueDate || !category || !currentPriority) {
    alert(
      "Please fill in all required fields: Title, Due Date, Category and Priority!"
    );
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
    status: "to-do",
    createdAt: new Date().toISOString(),
  };
}

// Close dropdown when clicking outside
document.addEventListener("click", function (event) {
  const wrapper = document.querySelector(".multi-select-wrapper");
  const dropdown = document.getElementById("contacts-dropdown");

  if (wrapper && dropdown && !wrapper.contains(event.target)) {
    dropdown.style.display = "none";
  }
});
