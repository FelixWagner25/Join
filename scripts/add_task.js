let newTaskAssignedContactsIndices = [];
let newTaskSubtasks = [];
let newTaskPriority = "medium";

async function addTaskInit() {
  contactsArray = await getSortedContactsArray();
  tasksArray = await getTasksArray();
  renderAddTaskForm("add-task-form-wrap", "todo");
}

function renderAddTaskForm(htmlId, taskStatusId) {
  let ref = document.getElementById(htmlId);
  ref.innerHTML = "";
  ref.innerHTML = getAddTaskFormTemplate(taskStatusId);
}

async function addNewTask(newTaskStatusId) {
  let newTaskScalarData = getNewTaskScalarInformation(newTaskStatusId);
  await submitObjectToDatabase("tasks", newTaskScalarData);
  tasksArray = await getTasksArray();
  await submitNewTaskOptionalComplexInfo();
  showNewTaskCreatedMessage();
  clearAddTaskForm();
}

async function submitNewTaskOptionalComplexInfo() {
  let newTaskFirebaseId = tasksArray[tasksArray.length - 1][0];
  if (newTaskAssignedContactsIndices != []) {
    await submitNewTaskAssignedContacts(newTaskFirebaseId);
  }
  if (newTaskSubtasks != []) {
    await submitNewTaskSubtasks(newTaskFirebaseId);
  }
}

async function submitNewTaskAssignedContacts(newTaskFireBaseId) {
  let path = "tasks/" + String(newTaskFireBaseId) + "/assignedTo";
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

async function submitNewTaskSubtasks(newTaskFirebaseId) {
  let path = "tasks/" + String(newTaskFirebaseId) + "/subtasks";
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

function getNewTaskScalarInformation(newTaskStatusId) {
  let newTaskScalarInfo = {};
  insertMandatoryTaskInfo(newTaskScalarInfo, newTaskStatusId);
  insertOptionalScalarTaskInfo(newTaskScalarInfo);
  return newTaskScalarInfo;
}

function insertMandatoryTaskInfo(newTaskObj, newTaskStatusId) {
  newTaskObj.title = getInputTagValue("task-title");
  newTaskObj.dueDate = getInputTagValue("task-due-date");
  newTaskObj.category = getTaskCategoryFirebaseName();
  newTaskObj.priority = newTaskPriority;
  newTaskObj.status = newTaskStatusId;
}

function getTaskCategoryFirebaseName() {
  let key = getInputTagValue("task-category");
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

function showNewTaskCreatedMessage() {}

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

let subtasksNormalized = false;

function addSubtask() {
  if (!subtasksNormalized) {
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
  const subtaskName = getInputTagValue("task-subtasks");
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
  let assignedContactsDropdownIconRef = document.getElementById(
    "task-assigend-contacts-dropdown-icon"
  );
  let assignedContactsBadges = document.getElementById(
    "task-assigned-contacts-badges"
  );
  assignedContactsDropdownRef.classList.toggle("d-none");
  assignedContactsDropdownRef.classList.toggle("d-flex-column");
  assignedContactsDropdownIconRef.classList.toggle("task-dropdown-open-icon");
  assignedContactsBadges.classList.toggle("d-none");
  renderTaskAssigendContacts();
  renderAssignedContactsCheckboxes();
  renderAssignedContactsBadges();
}

function renderAssignedContactsBadges() {
  renderContactsBadges(newTaskAssignedContactsIndices);
}

function renderContactsBadges(array) {
  const badgesRef = document.getElementById("task-assigned-contacts-badges");
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

function toggleAssignContact(contactID) {
  let assignedContactWrapRef = document.getElementById(
    "task-assigned-contact-wrap-" + contactID
  );
  assignedContactWrapRef.classList.toggle("focus");
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
  let assignedContactsRef = document.getElementById(
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

function renderAssignedContactsCheckboxes(contactIndexes) {
  if (contactIndexes) {
    let contactArray = contactIndexes.split(",");
    renderContactCheckboxes(contactArray);
  } else {
    renderContactCheckboxes(newTaskAssignedContactsIndices);
  }
}

function renderContactCheckboxes(array) {
  for (let indexContact = 0; indexContact < array.length; indexContact++) {
    let indexAssignedContact = array[indexContact];
    let assignedContactWrapRef = document.getElementById(
      "task-assigned-contact-wrap-" + indexAssignedContact
    );
    assignedContactWrapRef.classList.add("focus");
  }
}

async function deleteTask(indexTask) {
  closeTaskOverlays();
  await deleteDataBaseElement(`tasks/${tasksArray[indexTask][0]}`);
  await initBoard();
}

//Board editTask Area

function editTask(indexTask) {
  const contactIndexes = getContactIDs(indexTask);
  const subtaskIndexes = getSubtaskIDs(indexTask);
  newTaskAssignedContactsIndices = [...contactIndexes];
  newSubtasksIndices = [...subtaskIndexes];
  const existingSubtasks = tasksArray[indexTask][1]?.subtasks || {};
  newTaskSubtasks = Object.values(existingSubtasks);
  subtasksNormalized = false;
  let overlay = document.querySelector(".task-overlay-wrap");
  overlay.innerHTML = "";
  overlay.innerHTML = editTaskTemplate(indexTask);
}

async function submitEditTask(indexTask) {
  let obj = getCurrentTaskOBj(indexTask);
  obj = getEditTaskScalarInformation(obj);
  let taskID = tasksArray[indexTask][0];
  await updateDatabaseObject(`tasks/${taskID}`, obj);
  tasksArray = await getTasksArray();
  await submitEditTaskOptionalComplexInfo(taskID);
  await initBoard();
  closeTaskOverlays();
}

function getEditTaskScalarInformation(obj) {
  insertEditMandatoryTaskInfo(obj);
  insertOptionalScalarTaskInfo(obj);
  if (newTaskAssignedContactsIndices.length > 0) {
    obj.assignedTo = convertContactToObject(newTaskAssignedContactsIndices);
  }
  if (newSubtasksIndices.length > 0) {
    obj.subtasks = convertSubtasksToObject(newSubtasksIndices);
  }
  return obj;
}

function convertContactToObject(contactIdsArray) {
  const result = {};
  for (let id of contactIdsArray) {
    const contact = contactsArray.find((entry) => entry[0] === id);
    if (contact) {
      result[id] = {
        Id: contact[0],
        name: contact[1].name,
      };
    }
  }
  return result;
}

function convertSubtasksToObject(subtaskIdsArray) {
  const result = {};
  for (let id of subtaskIdsArray) {
    const entry = newTaskSubtasks.find((e) => Array.isArray(e) && e[0] === id);
    if (entry) {
      const data = entry[1];
      result[id] = {
        name: data.name,
        done: data.done,
      };
    }
  }
  return result;
}

function insertEditMandatoryTaskInfo(newTaskObj) {
  newTaskObj.title = getInputTagValue("task-title");
  newTaskObj.dueDate = getInputTagValue("task-due-date");
  newTaskObj.priority = newTaskPriority;
}

async function submitEditTaskOptionalComplexInfo(taskID) {
  if (newTaskSubtasks != []) {
    await submitNewTaskSubtasks(taskID);
  }
}
