let newTaskAssignedContactsIndices = [];
let newTaskSubtasks = [];
let newTaskPriority = "medium";
let currentDate = getCurrentDateYYYMMDD();

/**
 * Initializes the add task form
 */
async function addTaskInit() {
  contactsArray = await getSortedContactsArray();
  tasksArray = await getTasksArray();
  renderAddTaskForm("add-task-form-wrap", "todo");
}

/**
 * Renders add task form into html container
 *
 * @param {string} htmlId HTML Tag Id where task form shall be rendered
 * @param {string} taskStatusId Id of task status
 */
function renderAddTaskForm(htmlId, taskStatusId) {
  newTaskSubtasks = [];
  let ref = document.getElementById(htmlId);
  ref.innerHTML = "";
  ref.innerHTML = getAddTaskFormTemplate(taskStatusId);
}

/**
 * Adds new task to firebase server and directs user to board page
 *
 * @param {string} newTaskStatusId task status id
 */
async function addNewTask(newTaskStatusId) {
  let newTaskScalarData = getNewTaskScalarInformation(newTaskStatusId);
  await submitObjectToDatabase("tasks", newTaskScalarData);
  tasksArray = await getTasksArray();
  await submitNewTaskOptionalComplexInfo();
  clearAddTaskForm();
  showToastMessage("add-task-toast-msg");
  setTimeout(() => {
    directToBoardPage();
  }, 1000);
}

/**
 * Submits a new task's optional complex information to firebase server
 *
 * @param {string} editID
 */
async function submitNewTaskOptionalComplexInfo(editID) {
  let newTaskFirebaseId = "";
  if (editID) {
    newTaskFirebaseId = editID;
  } else {
    newTaskFirebaseId = tasksArray[tasksArray.length - 1][0];
  }
  await submitNewTaskAssignedContacts(newTaskFirebaseId);
  await submitNewTaskSubtasks(newTaskFirebaseId);
}

/**
 * Submits a new task's assigned contacts to firebase server
 *
 * @param {string} newTaskFireBaseId task firebase id
 */
async function submitNewTaskAssignedContacts(newTaskFireBaseId) {
  let path = "tasks/" + String(newTaskFireBaseId) + "/assignedTo";
  await deleteDataBaseElement(path);
  for (let contactID of newTaskAssignedContactsIndices) {
    let assignedContactEntry = contactsArray.find(
      (entry) => entry[0] === contactID
    );
    if (assignedContactEntry) {
      let keyValuePairs = {
        Id: contactID,
        name: assignedContactEntry[1].name,
      };
      await submitObjectToDatabase(path, keyValuePairs);
    }
  }
}

/**
 * Sets a subtask's status
 *
 * @param {htmlElement} currentElement
 * @param {integer} indexTask
 * @param {string} subtaskID
 */
async function setSubtaskStatus(currentElement, indexTask, subtaskID) {
  let path = tasksArray[indexTask][0];
  obj = currentElement.checked;
  await updateDatabaseObject(`tasks/${path}/subtasks/${subtaskID}/done`, obj);
  await initBoard();
}

/**
 * Submits a new task's subtask
 *
 * @param {string} newTaskFirebaseId
 */
async function submitNewTaskSubtasks(newTaskFirebaseId) {
  let path = "tasks/" + String(newTaskFirebaseId) + "/subtasks";
  await deleteDataBaseElement(path);
  for (let i = 0; i < newTaskSubtasks.length; i++) {
    let keyValuePairs = {};
    keyValuePairs.name = newTaskSubtasks[i].name;
    keyValuePairs.done = newTaskSubtasks[i].done;
    await submitObjectToDatabase(path, keyValuePairs);
  }
}

/**
 * Clears the add task form
 */
function clearAddTaskForm() {
  clearInputTagValue("task-title");
  clearInputTagValue("task-description");
  clearInputTagValue("task-due-date");
  setTaskPriority("task-priority-medium");
  clearInputTagValue("task-assigned-contacts");
  clearInputTagValue("task-category");
  clearInputTagValue("task-subtasks");
  newTaskAssignedContactsIndices = [];
  renderAssignedContactsBadges();
  newTaskSubtasks = [];
  renderSubtasks();
}

/**
 * Gets new task scalar information from input fields
 *
 * @param {string} newTaskStatusId
 * @param {object} editedTaskObj
 * @returns
 */
function getNewTaskScalarInformation(newTaskStatusId, editedTaskObj) {
  if (editedTaskObj) {
    insertMandatoryTaskInfo(editedTaskObj);
    insertOptionalScalarTaskInfo(editedTaskObj);
    return editedTaskObj;
  } else {
    let newTaskScalarInfo = {};
    insertMandatoryTaskInfo(newTaskScalarInfo, newTaskStatusId);
    insertOptionalScalarTaskInfo(newTaskScalarInfo);
    return newTaskScalarInfo;
  }
}

/**
 *
 * @param {object} newTaskObj
 * @param {string} newTaskStatusId
 */
function insertMandatoryTaskInfo(newTaskObj, newTaskStatusId) {
  newTaskObj.title = getInputTagValue("task-title");
  newTaskObj.dueDate = getInputTagValue("task-due-date");
  newTaskObj.priority = newTaskPriority;
  if (newTaskStatusId) {
    newTaskObj.category = getTaskCategoryFirebaseName();
    newTaskObj.status = newTaskStatusId;
  }
}

/**
 * Gets taks category firebase name
 *
 * @returns task category firebase name
 */
function getTaskCategoryFirebaseName() {
  let key = "";
  key = getInputTagValue("task-category");
  if (key.includes("Technical")) {
    return "technical-task";
  } else {
    return "user-story";
  }
}

/**
 * Inserts optional scalar task information into new Task object
 *
 * @param {object} newTaskObj
 */
function insertOptionalScalarTaskInfo(newTaskObj) {
  if (getInputTagValue("task-description") !== "") {
    newTaskObj.description = getInputTagValue("task-description");
  }
}

/**
 * Sets new task priority button
 *
 * @param {string} htmlId
 */
function setTaskPriority(htmlId) {
  resetAllPriorityBtns();
  let activeBtn = document.getElementById(htmlId);
  switch (htmlId) {
    case "task-priority-urgent":
      activeBtn.classList.add("active-urgent");
      newTaskPriority = "urgent";
      break;
    case "task-priority-low":
      activeBtn.classList.add("active-low");
      newTaskPriority = "low";
      break;
    default:
      activeBtn.classList.add("active-medium");
      newTaskPriority = "medium";
      break;
  }
}

/**
 * Resets all priority buttons to inactive
 */
function resetAllPriorityBtns() {
  let buttons = document.getElementsByClassName("task-priority-btn");
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].classList.remove("active-urgent", "active-medium", "active-low");
  }
}

/**
 * Toggles Task Category Dropdown
 */
function toggleTaskCategoryDropdown() {
  let categoryDropdownRef;
  let categoryDropdownIconRef;
  categoryDropdownRef = document.getElementById("task-category-dropdown");
  categoryDropdownIconRef = document.getElementById(
    "task-category-dropdown-icon"
  );
  clearInputTagValue("task-category");
  categoryDropdownRef.classList.toggle("d-none");
  categoryDropdownIconRef.classList.toggle("task-dropdown-open-icon");
}

/**
 * Closes Task Category Dropdown
 */
function closeTaskCategoryDropdown() {
  let categoryDropdownRef = document.getElementById("task-category-dropdown");
  let categoryDropdownIconRef = document.getElementById(
    "task-category-dropdown-icon"
  );
  categoryDropdownRef.classList.add("d-none");
  categoryDropdownIconRef.classList.remove("task-dropdown-open-icon");
}

/**
 * Shows a subtask's control buttons (sumit and clear)
 */
function showSubtaskControlButtons() {
  let subtaskInputValueLength;
  let addIconRef;
  let controlIconsWrapRef;
  subtaskInputValueLength =
    document.getElementById("task-subtasks").value.length;
  addIconRef = document.getElementById("task-add-subtask-icon");
  controlIconsWrapRef = document.getElementById(
    "task-clear-submit-subtask-icon-wrap"
  );
  addIconRef.classList.add("d-none");
  controlIconsWrapRef.classList.remove("d-none");
}

/**
 * Resets subtask control buttons
 */
function resetSubtaskcontrolButtons() {
  let addIconRef;
  let controlIconsWrapRef;
  if (addIconRef) {
    addIconRef.classList.remove("d-none");
    controlIconsWrapRef.classList.add("d-none");
  } else return;
}

/**
 * Adds a subtask
 */
function addSubtask() {
  normalizeSubtasksArray();
  const subtaskName = getInputTagValue("task-subtasks");
  newTaskSubtasks.push({ name: subtaskName, done: false });
  renderSubtasks();
  clearInputTagValue("task-subtasks");
  resetSubtaskcontrolButtons();
  showSubtaskControlButtons();
}

/**
 * Removes firebase id from subtasks array pulled from firebase server.
 */
function normalizeSubtasksArray() {
  for (let i = 0; i < newTaskSubtasks.length; i++) {
    if (Array.isArray(newTaskSubtasks[i])) {
      const data = newTaskSubtasks[i][1];
      const obj = {
        name: data.name,
        done: data.done,
      };
      newTaskSubtasks[i] = obj;
    }
  }
  subtasksNormalized = true;
}

/**
 * Renders a task's subtasks
 */
function renderSubtasks() {
  let subtaskListRef;
  subtaskListRef = document.getElementById("tasks-subtasks-list");
  subtaskListRef.innerHTML = "";
  for (
    let indexSubtask = 0;
    indexSubtask < newTaskSubtasks.length;
    indexSubtask++
  ) {
    subtaskListRef.innerHTML += getSubtaskListTemplate(indexSubtask);
  }
}

/**
 * Edits a subtask
 *
 * @param {integer} indexSubtask
 */
function editSubtask(indexSubtask) {
  let editedSubtaskRef = document.getElementById(
    "task-subtask-" + indexSubtask
  );
  editedSubtaskRef.innerHTML = getEditSubtaskTemplate(indexSubtask);
}

/**
 * Adds a new subtask to add task input form
 *
 * @param {integer} indexSubtask
 */
function addEditedSubtask(indexSubtask) {
  let inputRef = "task-subtask-edit-" + String(indexSubtask);
  editedSubtaskName = getInputTagValue(inputRef);
  newTaskSubtasks[indexSubtask].name = editedSubtaskName;
  renderSubtasks();
}

/**
 * Deletes a subtask from add task form
 *
 * @param {integer} indexSubtask
 */
function deleteSubtask(indexSubtask) {
  newTaskSubtasks.splice(indexSubtask, 1);
  renderSubtasks();
}

/**
 * Toggles task assigned contacts dropdown menu
 */
function toggleTaskAssignedContactsDropdown() {
  let assignedContactsDropdownRef = document.getElementById(
    "task-assigned-contacts-dropdown"
  );
  assignedContactsDropdownRef.classList.toggle("d-none");
  assignedContactsDropdownRef.classList.toggle("d-flex-column");
  toggleTaskAssignedContactsDropdownIcon();
  toggleTaskAssignedContactsBadges();
  renderTaskAssigendContacts();
  renderContactCheckboxes(newTaskAssignedContactsIndices);
  renderAssignedContactsBadges();
}

/**
 * Toggles the icon of task assigned contacts dropdown menu
 */
function toggleTaskAssignedContactsDropdownIcon() {
  let assignedContactsDropdownIconRef = document.getElementById(
    "task-assigend-contacts-dropdown-icon"
  );
  assignedContactsDropdownIconRef.classList.toggle("task-dropdown-open-icon");
}

/**
 * Toggles the badges task assigned contacts
 */
function toggleTaskAssignedContactsBadges() {
  let assignedContactsBadges = document.getElementById(
    "task-assigned-contacts-badges"
  );
  assignedContactsBadges.classList.toggle("d-none");
}

/**
 * Opens taks assigned contacts dropdown menu
 */
function openTaskAssignedContactsDropdown() {
  let assignedContactsDropdownRef = document.getElementById(
    "task-assigned-contacts-dropdown"
  );
  assignedContactsDropdownRef.classList.remove("d-none");
  assignedContactsDropdownRef.classList.add("d-flex-column");
  openTaskAssignedContactsDropdownIcon();
  openTaskAssignedContactsDropdownBadges();
  renderTaskAssigendContacts();
  renderContactCheckboxes(newTaskAssignedContactsIndices);
  renderAssignedContactsBadges();
  searchContact();
}

/**
 * Opens task assigned contacts dropdown icon
 */
function openTaskAssignedContactsDropdownIcon() {
  let assignedContactsDropdownIconRef = document.getElementById(
    "task-assigend-contacts-dropdown-icon"
  );
  assignedContactsDropdownIconRef.classList.add("task-dropdown-open-icon");
}

/**
 * Shows badges of task assigned contacts
 */
function openTaskAssignedContactsDropdownBadges() {
  let assignedContactsBadges = document.getElementById(
    "task-assigned-contacts-badges"
  );
  assignedContactsBadges.classList.add("d-none");
}

/**
 * Closes task assigned contacts dropdown menu
 */
function closeTaskAssignedContactsDropdown() {
  let assignedContactsDropdownRef = document.getElementById(
    "task-assigned-contacts-dropdown"
  );
  assignedContactsDropdownRef.classList.add("d-none");
  assignedContactsDropdownRef.classList.remove("d-flex-column");
  closeTaskAssignedContactsDropdownIcon();
  closeTaskAssignedContactsDropdownBadges();
  renderTaskAssigendContacts();
  renderContactCheckboxes(newTaskAssignedContactsIndices);
  renderAssignedContactsBadges();
  clearInputTagValue("task-assigned-contacts");
}

/**
 * Hides task assigned contacts dropdown icon
 */
function closeTaskAssignedContactsDropdownIcon() {
  let assignedContactsDropdownIconRef = document.getElementById(
    "task-assigend-contacts-dropdown-icon"
  );
  assignedContactsDropdownIconRef.classList.remove("task-dropdown-open-icon");
}

/**
 * Hides task assigned contacts badges
 */
function closeTaskAssignedContactsDropdownBadges() {
  let assignedContactsBadges = document.getElementById(
    "task-assigned-contacts-badges"
  );
  assignedContactsBadges.classList.remove("d-none");
}

/**
 * Renders assigned contact badges
 */
function renderAssignedContactsBadges() {
  renderContactsBadges(newTaskAssignedContactsIndices);
}

/**
 * Renders contact Badges
 * @param {array} array
 */
function renderContactsBadges(array) {
  let badgesRef;
  badgesRef = document.getElementById("task-assigned-contacts-badges");
  badgesRef.innerHTML = "";
  let maximalShownBadges = Math.min(3, array.length);
  for (let i = 0; i < maximalShownBadges; i++) {
    badgesRef.innerHTML += getTaskAssignedContactBadgeTemplate(array[i], i);
  }
  if (array.length > maximalShownBadges) {
    badgesRef.innerHTML += getTaskAssignedContactsRemainderTemplate(
      array.length - maximalShownBadges
    );
  }
}

/**
 * Toggle assignment of a contact
 *
 * @param {string} contactID
 * @param {htmlElement} htmlElement
 */
function toggleAssignContact(contactID, htmlElement) {
  htmlElement.classList.toggle("focus");
  toggleValueFromArray(contactID, newTaskAssignedContactsIndices);
  renderAssignedContactsBadges();
}

/**
 * Toggle an arbitrary value from an array
 *
 * @param {*} value arbitrary value
 * @param {*} array array
 */
function toggleValueFromArray(value, array) {
  let index = array.indexOf(value);
  if (index !== -1) {
    array.splice(index, 1);
  } else {
    array.push(value);
  }
}

/**
 * Renders a taks assigned contacts
 */
function renderTaskAssigendContacts() {
  let assignedContactsRef = "";
  assignedContactsRef = document.getElementById(
    "task-assigned-contacts-dropdown"
  );
  assignedContactsRef.innerHTML = "";
  for (
    let indexContact = 0;
    indexContact < contactsArray.length;
    indexContact++
  ) {
    assignedContactsRef.innerHTML += getTaskAssigendContactsTemplate(
      contactsArray[indexContact][0],
      indexContact
    );
  }
}

/**
 * Renders checkboxes of assigned contacts in add task form
 *
 * @param {array} array
 */
function renderContactCheckboxes(array) {
  for (let indexContact = 0; indexContact < array.length; indexContact++) {
    let indexAssignedContact = array[indexContact];
    assignedContactWrapRef = document.getElementById(
      "task-assigned-contact-wrap-" + indexAssignedContact
    );
    assignedContactWrapRef.classList.add("focus");
  }
}

/**
 * Returns current date.
 * @returns current day in format YYYYMMDD
 */
function getCurrentDateYYYMMDD() {
  let today = new Date();
  let year = String(today.getFullYear());
  let month = String(today.getMonth() + 1).padStart(2, "0");
  let day = String(today.getDate()).padStart(2, "0");
  return year + "-" + month + "-" + day;
}

/**
 * Searches a contact to assign via contact's name
 */
function searchContact() {
  let searchKey = document
    .getElementById("task-assigned-contacts")
    .value.toLowerCase();
  let foundRefs = "";
  let contactsRefs = Array.from(
    document.getElementsByClassName("task-assigned-contact-wrap")
  );
  for (let i = 0; i < contactsRefs.length; i++) {
    contactsRefs[i].classList.add("d-none");
  }
  foundRefs = contactsRefs.filter((htmlElement) =>
    htmlElement.innerText.toLowerCase().includes(searchKey)
  );
  for (let i = 0; i < foundRefs.length; i++) {
    foundRefs[i].classList.remove("d-none");
  }
}
