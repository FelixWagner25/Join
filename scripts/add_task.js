let newTaskAssignedContactsIndices = [];
let newTaskSubtasks = [];
let newTaskPriority = "medium";

async function addNewTask(newTaskStatusId, overlay = false) {
  let newTaskScalarData = getNewTaskScalarInformation(newTaskStatusId, overlay);
  await submitObjectToDatabase("tasks", newTaskScalarData);
  tasksArray = await getTasksArray();
  await submitNewTaskOptionalComplexInfo();
  showNewTaskCreatedMessage();
  clearAddTaskForm(overlay);
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

function clearAddTaskForm(overlay) {
  if (overlay == true) {
    clearInputTagValue("task-title-overlay");
    clearInputTagValue("task-description-overlay");
    clearInputTagValue("task-due-date-overlay");
    setTaskPriority("task-priority-medium-overlay");
    clearInputTagValue("task-assigned-contacts-overlay");
    clearInputTagValue("task-category-overlay");
    clearInputTagValue("task-subtasks-overlay");
  } else {
    clearInputTagValue("task-title");
    clearInputTagValue("task-description");
    clearInputTagValue("task-due-date");
    setTaskPriority("task-priority-medium");
    clearInputTagValue("task-assigned-contacts");
    clearInputTagValue("task-category");
    clearInputTagValue("task-subtasks");
  }

  newTaskAssignedContactsIndices = [];
  renderAssignedContactsBadges(overlay);
  newTaskSubtasks = [];
  renderSubtasks(overlay);
}

function getNewTaskScalarInformation(newTaskStatusId, overlay) {
  let newTaskScalarInfo = {};
  insertMandatoryTaskInfo(newTaskScalarInfo, newTaskStatusId, overlay);
  insertOptionalScalarTaskInfo(newTaskScalarInfo, overlay);
  return newTaskScalarInfo;
}

function insertMandatoryTaskInfo(newTaskObj, newTaskStatusId, overlay) {
  if (overlay == true) {
    newTaskObj.title = getInputTagValue("task-title-overlay");
    newTaskObj.dueDate = getInputTagValue("task-due-date-overlay");
    newTaskObj.category = getTaskCategoryFirebaseName(overlay);
    newTaskObj.priority = newTaskPriority;
    newTaskObj.status = newTaskStatusId;
  } else {
    newTaskObj.title = getInputTagValue("task-title");
    newTaskObj.dueDate = getInputTagValue("task-due-date");
    newTaskObj.category = getTaskCategoryFirebaseName(overlay);
    newTaskObj.priority = newTaskPriority;
    newTaskObj.status = newTaskStatusId;
  }
}

function getTaskCategoryFirebaseName(overlay) {
  let key = "";
  if (overlay == true) {
    key = getInputTagValue("task-category-overlay");
  } else {
    key = getInputTagValue("task-category");
  }
  if (key.includes("Technical")) {
    return "technical-task";
  } else {
    return "user-story";
  }
}

function insertOptionalScalarTaskInfo(newTaskObj, overlay) {
  if (overlay == true) {
    if (getInputTagValue("task-description-overlay") !== "") {
      newTaskObj.description = getInputTagValue("task-description-overlay");
    } else {
      if (getInputTagValue("task-description") !== "") {
        newTaskObj.description = getInputTagValue("task-description");
      }
    }
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

function toggleTaskCategoryDropdown(overlay) {
  let categoryDropdownRef;
  let categoryDropdownIconRef;
  if (overlay == true) {
    categoryDropdownRef = document.getElementById(
      "task-category-dropdown-overlay"
    );
    categoryDropdownIconRef = document.getElementById(
      "task-category-dropdown-icon"
    );
    clearInputTagValue("task-category-overlay");
  } else {
    categoryDropdownRef = document.getElementById("task-category-dropdown");
    categoryDropdownIconRef = document.getElementById(
      "task-category-dropdown-icon"
    );
    clearInputTagValue("task-category");
  }
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

function toggleTaskAssignedContactsDropdown(overlay) {
  let assignedContactsDropdownRef = "";
  let assignedContactsDropdownIconRef = "";
  let assignedContactsBadges = "";
  if (overlay == true) {
    assignedContactsDropdownRef = document.getElementById(
      "task-assigned-contacts-dropdown-overlay"
    );
    assignedContactsDropdownIconRef = document.getElementById(
      "task-assigend-contacts-dropdown-icon-overlay"
    );
    assignedContactsBadges = document.getElementById(
      "task-assigned-contacts-badges-overlay"
    );
  } else {
    assignedContactsDropdownRef = document.getElementById(
      "task-assigned-contacts-dropdown"
    );
    assignedContactsDropdownIconRef = document.getElementById(
      "task-assigend-contacts-dropdown-icon"
    );
    assignedContactsBadges = document.getElementById(
      "task-assigned-contacts-badges"
    );
  }

  assignedContactsDropdownRef.classList.toggle("d-none");
  assignedContactsDropdownRef.classList.toggle("d-flex-column");
  assignedContactsDropdownIconRef.classList.toggle("task-dropdown-open-icon");
  assignedContactsBadges.classList.toggle("d-none");
  renderTaskAssigendContacts(overlay);
  renderContactCheckboxes(newTaskAssignedContactsIndices, overlay);
  renderAssignedContactsBadges(overlay);
}

function renderAssignedContactsBadges(overlay) {
  renderContactsBadges(newTaskAssignedContactsIndices, overlay);
}

function renderContactsBadges(array, overlay) {
  let badgesRef;
  if (overlay == true) {
    badgesRef = document.getElementById(
      "task-assigned-contacts-badges-overlay"
    );
  } else {
    badgesRef = document.getElementById("task-assigned-contacts-badges");
  }
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
  renderAssignedContactsBadges(false);
  renderAssignedContactsBadges(true);
}

function toggleValueFromArray(value, array) {
  let index = array.indexOf(value);
  if (index !== -1) {
    array.splice(index, 1);
  } else {
    array.push(value);
  }
}

function renderTaskAssigendContacts(overlay) {
  let assignedContactsRef = "";
  if (overlay == true) {
    assignedContactsRef = document.getElementById(
      "task-assigned-contacts-dropdown-overlay"
    );
    assignedContactsRef.innerHTML = "";
    for (
      let indexContact = 0;
      indexContact < contactsArray.length;
      indexContact++
    ) {
      assignedContactsRef.innerHTML += getTaskAssigendContactsOverlayTemplate(
        contactsArray[indexContact][0],
        indexContact
      );
    }
  } else {
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
}

function renderAssignedContactsCheckboxes(contactIndices, overlay) {
  if (contactIndices) {
    let contactArray = contactIndices.split(",");
    renderContactCheckboxes(contactArray, false);
  } else {
    renderContactCheckboxes(newTaskAssignedContactsIndices, overlay);
  }
}

function renderContactCheckboxes(array, overlay) {
  for (let indexContact = 0; indexContact < array.length; indexContact++) {
    let assignedContactWrapRef;
    let indexAssignedContact = array[indexContact];
    if (overlay == true) {
      assignedContactWrapRef = document.getElementById(
        "task-assigned-contact-wrap-overlay-" + indexAssignedContact
      );
    } else {
      assignedContactWrapRef = document.getElementById(
        "task-assigned-contact-wrap-" + indexAssignedContact
      );
    }
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
  const contactIndices = getContactIDs(indexTask);
  const subtaskIndexes = getSubtaskIDs(indexTask);
  newTaskAssignedContactsIndices = [...contactIndices];
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
  insertEditMandatoryTaskInfo(obj, false);
  insertOptionalScalarTaskInfo(obj, false);
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
