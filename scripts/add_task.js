let newTaskSubtasks = [];

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

function closeTaskCategoryDropdown() {
  let categoryDropdownRef = document.getElementById("task-category-dropdown");
  let categoryDropdownIconRef = document.getElementById(
    "task-category-dropdown-icon"
  );
  categoryDropdownRef.classList.add("d-none");
  categoryDropdownIconRef.classList.remove("task-dropdown-open-icon");
}

function showSubtaskControlButtons() {
  let subtaskInputValueLength =
    document.getElementById("task-subtasks").value.length;
  let addIconRef = document.getElementById("task-add-subtask-icon");
  let controlIconsWrapRef = document.getElementById(
    "task-clear-submit-subtask-icon-wrap"
  );
  if (subtaskInputValueLength > 0) {
    addIconRef.classList.add("d-none");
    controlIconsWrapRef.classList.remove("d-none");
  } else {
    addIconRef.classList.remove("d-none");
    controlIconsWrapRef.classList.add("d-none");
  }
}

function addSubtask() {
  let subtaskName = getInputTagValue("task-subtasks");
  newTaskSubtasks.push({ name: subtaskName, done: false });
  renderSubtasks();
  clearInputTagValue("task-subtasks");
  showSubtaskControlButtons();
}

function renderSubtasks() {
  let subtaskListRef = document.getElementById("tasks-subtasks-list");
  subtaskListRef.innerHTML = "";
  for (
    let indexSubtask = 0;
    indexSubtask < newTaskSubtasks.length;
    indexSubtask++
  ) {
    subtaskListRef.innerHTML += getSubtaskListTemplate(indexSubtask);
  }
}

function editSubtask(indexSubtask) {
  let editedSubtaskRef = document.getElementById(
    "task-subtask-" + indexSubtask
  );
  editedSubtaskRef.innerHTML = getEditSubtaskTemplate(indexSubtask);
}

function deleteSubtask(indexSubtask) {
  newTaskSubtasks.splice(indexSubtask, 1);
  renderSubtasks();
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
