let newTaskAssignedContactsIndices = [];
let newTaskSubtasks = [];
let newTaskPriority = "medium";

async function addNewTask() {
  let newTaskScalarData = getNewTaskScalarInformation();
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
  for (let i = 0; i < newTaskAssignedContactsIndices.length; i++) {
    let keyValuePairs = {};
    keyValuePairs.Id = contactsArray[newTaskAssignedContactsIndices[i]][0];
    keyValuePairs.name =
      contactsArray[newTaskAssignedContactsIndices[i]][1].name;
    await submitObjectToDatabase(path, keyValuePairs);
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

function getNewTaskScalarInformation() {
  let newTaskScalarInfo = {};
  insertMandatoryTaskInfo(newTaskScalarInfo);
  insertOptionalScalarTaskInfo(newTaskScalarInfo);
  return newTaskScalarInfo;
}

function insertMandatoryTaskInfo(newTaskObj) {
  newTaskObj.title = getInputTagValue("task-title");
  newTaskObj.dueDate = getInputTagValue("task-due-date");
  newTaskObj.category = getTaskCategoryFirebaseName()
  newTaskObj.status = "todo";
  newTaskObj.priority = newTaskPriority;
}

function getTaskCategoryFirebaseName() {
  let key = getInputTagValue("task-category");
if (key.includes('Technical')){
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

// function getNewTaskAssignedContactsObj() {
//   let assignedContacts = {};
//   for (let index = 0; index < newTaskAssignedContactsIndices.length; index++) {
//     let keyValuePair = {};
//     keyValuePair.Id = contactsArray[newTaskAssignedContactsIndices[index]][0];
//     keyValuePair.name =
//       contactsArray[newTaskAssignedContactsIndices[index]][1].name;
//     assignedContacts[index] = keyValuePair;
//   }
//   return assignedContacts;
// }

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
    assignedContactsRef.innerHTML +=
      getTaskAssigendContactsTemplate(indexContact);
  }
}

function renderAssignedContactsCheckboxes() {
  for (
    let indexContact = 0;
    indexContact < newTaskAssignedContactsIndices.length;
    indexContact++
  ) {
    let indexAssignedContact = newTaskAssignedContactsIndices[indexContact];
    let assignedContactWrapRef = document.getElementById(
      "task-assigned-contact-wrap-" + indexAssignedContact
    );
    assignedContactWrapRef.classList.add("focus");
  }
}

function toggleAssignContact(indexContact) {
  let assignedContactWrapRef = document.getElementById(
    "task-assigned-contact-wrap-" + indexContact
  );
  assignedContactWrapRef.classList.toggle("focus");
  toggleValueFromArray(indexContact, newTaskAssignedContactsIndices);
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

function renderAssignedContactsBadges() {
  let badgesRef = document.getElementById("task-assigned-contacts-badges");
  badgesRef.innerHTML = "";
  for (
    let indexContact = 0;
    indexContact < newTaskAssignedContactsIndices.length;
    indexContact++
  ) {
    badgesRef.innerHTML += getTaskAssignedContactBadgeTemplate(
      newTaskAssignedContactsIndices[indexContact]
    );
  }
}




//Board editTask Area

function editTask(indexTask) {
 let overlay = document.querySelector(".task-overlay-wrap");
 overlay.innerHTML = ""
 overlay.innerHTML = editTaskTemplate(indexTask)
}


async function submitEditTask(indexTask ) {
let obj = getCurrentTaskOBj(indexTask)
obj = getEditTaskScalarInformation(obj);
console.log(obj);

  await submitObjectToDatabase("tasks", obj);
  tasksArray = await getTasksArray();
  await submitNewTaskOptionalComplexInfo(); //statt submitnew PUT-rqeust
  initBoard()
  getTaskOverlay(indexTask)
}

function getEditTaskScalarInformation(obj) {
  insertEditMandatoryTaskInfo(obj);
  insertOptionalScalarTaskInfo(obj);
  return obj;
}

function insertEditMandatoryTaskInfo(newTaskObj) {
  newTaskObj.title = getInputTagValue("task-title");
  newTaskObj.dueDate = getInputTagValue("task-due-date");
  newTaskObj.priority = newTaskPriority;
}
