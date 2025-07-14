let newTaskAssignedContactsIndices = [];
let newTaskSubtasks = [];
let newTaskPriority = "medium";
let currentDate = getCurrentDateYYYMMDD();

/* async function addTaskInit() {
  contactsArray = await getSortedContactsArray();
  tasksArray = await getTasksArray();
  renderAddTaskForm("add-task-form-wrap", "todo");
}

function renderAddTaskForm(htmlId, taskStatusId) {
  let ref = document.getElementById(htmlId);
  ref.innerHTML = "";
  ref.innerHTML = getAddTaskFormTemplate(taskStatusId);
}
 */
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
  showNewTaskCreatedMessage();
  clearAddTaskForm();
  renderBoard(tasksArray);
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
    console.log(newTaskFirebaseId);
    console.log(keyValuePairs);
    console.log(path);
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
  const subtaskName = getInputTagValue("task-subtasks");
  newTaskSubtasks.push({ name: subtaskName, done: false });
  renderSubtasks();
  clearInputTagValue("task-subtasks");
  resetSubtaskcontrolButtons();
  showSubtaskControlButtons();
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
  console.log(newTaskAssignedContactsIndices);

  let assignedContactsDropdownRef = "";
  let assignedContactsDropdownIconRef = "";
  let assignedContactsBadges = "";
  assignedContactsDropdownRef = document.getElementById(
    "task-assigned-contacts-dropdown"
  );
  assignedContactsDropdownIconRef = document.getElementById(
    "task-assigend-contacts-dropdown-icon"
  );
  assignedContactsBadges = document.getElementById(
    "task-assigned-contacts-badges"
  );

  assignedContactsDropdownRef.classList.toggle("d-none");
  assignedContactsDropdownRef.classList.toggle("d-flex-column");
  assignedContactsDropdownIconRef.classList.toggle("task-dropdown-open-icon");
  assignedContactsBadges.classList.toggle("d-none");
  renderTaskAssigendContacts();
  renderContactCheckboxes(newTaskAssignedContactsIndices);
  renderAssignedContactsBadges();
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
  // let assignedContactWrapRef;
  // if (overlay == true) {
  //   assignedContactWrapRef = document.getElementById(
  //     "task-assigned-contact-wrap-overlay" + contactID
  //   );
  // } else {
  //   assignedContactWrapRef = document.getElementById(
  //     "task-assigned-contact-wrap-" + contactID
  //   );
  // }

  //assignedContactWrapRef.classList.toggle("focus");
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

function renderAssignedContactsCheckboxes() {
  renderContactCheckboxes(newTaskAssignedContactsIndices);
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

async function deleteTask(indexTask) {
  closeTaskOverlays();
  await deleteDataBaseElement(`tasks/${tasksArray[indexTask][0]}`);
  await initBoard();
}

//Board editTask Area

async function editTask(indexTask) {
  tasksArray = await getTasksArray();
  let overlay = document.querySelector(".task-overlay-wrap");
  let currentTask = tasksArray[indexTask][1];
  let currentSubtasks = tasksArray[indexTask][1]?.subtasks || {}; //subtask objectmaker
  newTaskAssignedContactsIndices =
    currentTask.assignedTo?.map((i) => i[1].Id) || [];
  newSubtasksIndices = currentTask.subtasks?.map((i) => i[1].Id) || [];
  newTaskSubtasks = Object.values(currentSubtasks).map((i) => i[1]); //Werte der subtasks
  overlay.innerHTML = editTaskTemplate(indexTask, currentTask);
}

async function submitEditTask(indexTask) {
  let editedTaskObj = tasksArray[indexTask][1];
  let taskID = tasksArray[indexTask][0];
  let newTaskObj = getEditTaskScalarInformation(editedTaskObj); //der ganze neue Task
  await updateDatabaseObject(`tasks/${taskID}`, newTaskObj);
  tasksArray = await getTasksArray();
  await submitEditTaskOptionalComplexInfo(taskID);
  await initBoard();
  closeTaskOverlays();
}

function getEditTaskScalarInformation(editedTaskObj) {
  insertEditMandatoryTaskInfo(editedTaskObj);
  insertOptionalScalarTaskInfo(editedTaskObj);
  if (newTaskAssignedContactsIndices.length > 0) {
    editedTaskObj.assignedTo = convertContactToObject(
      newTaskAssignedContactsIndices
    );
  } else {
    editedTaskObj.assignedTo = {};
  }
  if (newSubtasksIndices.length > 0) {
    editedTaskObj.subtasks = convertSubtasksToObject(newSubtasksIndices);
  }
  return editedTaskObj;
}

function convertContactToObject(newSubtasksIndices) {
  const assignedToObj = {};
  for (let id of newSubtasksIndices) {
    const contact = contactsArray.find((entry) => entry[0] === id);
    if (contact) {
      assignedToObj[id] = {
        Id: contact[0],
        name: contact[1].name,
      };
    }
  }
  return assignedToObj;
}

function convertSubtasksToObject(subtaskIdsArray) {
  const subtaskObj = {};
  for (let id of subtaskIdsArray) {
    const entry = newTaskSubtasks.find((e) => Array.isArray(e) && e[0] === id);
    if (entry) {
      const data = entry[1];
      subtaskObj[id] = {
        name: data.name,
        done: data.done,
      };
    }
  }
  return subtaskObj;
}

function insertEditMandatoryTaskInfo(newTaskObj) {
  newTaskObj.title = getInputTagValue("task-title");
  newTaskObj.dueDate = getInputTagValue("task-due-date");
  newTaskObj.priority = newTaskPriority;
}

async function submitEditTaskOptionalComplexInfo(taskID) {
  await submitNewTaskSubtasks(taskID);
}

function getCurrentDateYYYMMDD() {
  let today = new Date();
  let year = String(today.getFullYear());
  let month = String(today.getMonth() + 1).padStart(2, "0");
  let day = String(today.getDate()).padStart(2, "0");
  return year + "-" + month + "-" + day;
}
