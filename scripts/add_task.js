let newTaskAssignedContactsIndices = [];
let newTaskSubtasks = [];
let newTaskPriority = "medium";
let currentDate = getCurrentDateYYYMMDD();

async function addTaskInit() {
  contactsArray = await getSortedContactsArray();
  tasksArray = await getTasksArray();
  renderAddTaskForm("add-task-form-wrap", "todo");
}

function renderAddTaskForm(htmlId, taskStatusId) {
  newTaskSubtasks = [];
  let ref = document.getElementById(htmlId);
  ref.innerHTML = "";
  ref.innerHTML = getAddTaskFormTemplate(taskStatusId);
}

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

async function setSubtaskStatus(currentElement, indexTask, subtaskID) {
  let path = tasksArray[indexTask][0];
  obj = currentElement.checked;
  await updateDatabaseObject(`tasks/${path}/subtasks/${subtaskID}/done`, obj);
  await initBoard();
}

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

function insertMandatoryTaskInfo(newTaskObj, newTaskStatusId) {
  newTaskObj.title = getInputTagValue("task-title");
  newTaskObj.dueDate = getInputTagValue("task-due-date");
  newTaskObj.priority = newTaskPriority;
  if (newTaskStatusId) {
    newTaskObj.category = getTaskCategoryFirebaseName();
    newTaskObj.status = newTaskStatusId;
  }
  return;
}

function getTaskCategoryFirebaseName() {
  let key = "";
  key = getInputTagValue("task-category");
  if (key.includes("Technical")) {
    return "technical-task";
  } else {
    return "user-story";
  }
}

function insertOptionalScalarTaskInfo(newTaskObj) {
  if (getInputTagValue("task-description") !== "") {
    newTaskObj.description = getInputTagValue("task-description");
  }
}

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

function resetAllPriorityBtns() {
  let buttons = document.getElementsByClassName("task-priority-btn");
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].classList.remove("active-urgent", "active-medium", "active-low");
  }
}

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

function closeTaskCategoryDropdown() {
  let categoryDropdownRef = document.getElementById("task-category-dropdown");
  let categoryDropdownIconRef = document.getElementById(
    "task-category-dropdown-icon"
  );
  categoryDropdownRef.classList.add("d-none");
  categoryDropdownIconRef.classList.remove("task-dropdown-open-icon");
}

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

function resetSubtaskcontrolButtons() {
  let addIconRef;
  let controlIconsWrapRef;
  if (addIconRef) {
    addIconRef.classList.remove("d-none");
    controlIconsWrapRef.classList.add("d-none");
  } else return;
}

function addSubtask() {
  normalizeSubtasksArray();
  const subtaskName = getInputTagValue("task-subtasks");
  newTaskSubtasks.push({ name: subtaskName, done: false });
  renderSubtasks();
  clearInputTagValue("task-subtasks");
  resetSubtaskcontrolButtons();
  showSubtaskControlButtons();
}

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

function editSubtask(indexSubtask) {
  let editedSubtaskRef = document.getElementById(
    "task-subtask-" + indexSubtask
  );
  editedSubtaskRef.innerHTML = getEditSubtaskTemplate(indexSubtask);
}

function addEditedSubtask(indexSubtask) {
  let inputRef = "task-subtask-edit-" + String(indexSubtask);
  editedSubtaskName = getInputTagValue(inputRef);
  newTaskSubtasks[indexSubtask].name = editedSubtaskName;
  renderSubtasks();
}

function deleteSubtask(indexSubtask) {
  newTaskSubtasks.splice(indexSubtask, 1);
  renderSubtasks();
}

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

function toggleTaskAssignedContactsDropdownIcon() {
  let assignedContactsDropdownIconRef = document.getElementById(
    "task-assigend-contacts-dropdown-icon"
  );
  assignedContactsDropdownIconRef.classList.toggle("task-dropdown-open-icon");
}

function toggleTaskAssignedContactsBadges() {
  let assignedContactsBadges = document.getElementById(
    "task-assigned-contacts-badges"
  );
  assignedContactsBadges.classList.toggle("d-none");
}

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

function openTaskAssignedContactsDropdownIcon() {
  let assignedContactsDropdownIconRef = document.getElementById(
    "task-assigend-contacts-dropdown-icon"
  );
  assignedContactsDropdownIconRef.classList.add("task-dropdown-open-icon");
}

function openTaskAssignedContactsDropdownBadges() {
  let assignedContactsBadges = document.getElementById(
    "task-assigned-contacts-badges"
  );
  assignedContactsBadges.classList.add("d-none");
}

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

function closeTaskAssignedContactsDropdownIcon() {
  let assignedContactsDropdownIconRef = document.getElementById(
    "task-assigend-contacts-dropdown-icon"
  );
  assignedContactsDropdownIconRef.classList.remove("task-dropdown-open-icon");
}

function closeTaskAssignedContactsDropdownBadges() {
  let assignedContactsBadges = document.getElementById(
    "task-assigned-contacts-badges"
  );
  assignedContactsBadges.classList.remove("d-none");
}

function renderAssignedContactsBadges() {
  renderContactsBadges(newTaskAssignedContactsIndices);
}

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

function toggleAssignContact(contactID, htmlElement) {
  htmlElement.classList.toggle("focus");
  toggleValueFromArray(contactID, newTaskAssignedContactsIndices);
  renderAssignedContactsBadges();
}

function toggleValueFromArray(value, array) {
  let index = array.indexOf(value);
  if (index !== -1) {
    array.splice(index, 1);
  } else {
    array.push(value);
  }
}

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

function renderContactCheckboxes(array) {
  for (let indexContact = 0; indexContact < array.length; indexContact++) {
    let indexAssignedContact = array[indexContact];
    assignedContactWrapRef = document.getElementById(
      "task-assigned-contact-wrap-" + indexAssignedContact
    );
    assignedContactWrapRef.classList.add("focus");
  }
}

function getCurrentDateYYYMMDD() {
  let today = new Date();
  let year = String(today.getFullYear());
  let month = String(today.getMonth() + 1).padStart(2, "0");
  let day = String(today.getDate()).padStart(2, "0");
  return year + "-" + month + "-" + day;
}

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
