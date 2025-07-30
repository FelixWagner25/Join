let currentTask = "";

async function initBoard() {
  contactsArray = await getSortedContactsArray();
  tasksArray = await getTasksArray();
  await renderBoard();
}

async function getTasksArray() {
  tasksArray = [];
  let tasks = await getDataBaseElement("tasks");
  if (tasks == null) {
    return tasksArray;
  }
  tasksArray = Object.entries(tasks).map(([taskId, taskData]) => {
    if (taskData.assignedTo !== undefined) {
      taskData.assignedTo = Object.entries(taskData.assignedTo);
    }
    if (taskData.subtasks !== undefined) {
      taskData.subtasks = Object.entries(taskData.subtasks);
    }
    return [taskId, taskData];
  });
  return tasksArray;
}

/**
 * This Function renders the Board for each Task-Status
 * 
 */
async function renderBoard() {
  renderBoardColumn("to-do", "todo");
  renderBoardColumn("in-progress", "inprogress");
  renderBoardColumn("await-feedback", "awaitfeedback");
  renderBoardColumn("done", "done");
}

/**
 * This Function renders a Board Column
 * 
 * @param {String} columHTMLid task status from the DOM
 * @param {String} taskStatusId status from the firebase
 */
function renderBoardColumn(columHTMLid, taskStatusId) {
  let boardColRef = document.getElementById(columHTMLid);
  boardColRef.innerHTML = "";
  for (let i = 0; i < tasksArray.length; i++) {
    if (!taskHasStatus(taskStatusId, i)) {
      continue;
    }
    boardColRef.innerHTML += getBoardCardTemplate(i);
    if (subtasksExist(i)) {
      renderSubtaskProgressInfo(i);
    }
    renderBoardCardContacts(i);
  }
  checkEmptyColumn(columHTMLid);
}

/**
 * This Function renders a placeholder if no tasks were found in the dedicated column
 * 
 * @param {String} columHTMLid task status from the DOM
 */
function checkEmptyColumn(columHTMLid) {
  let boardColRef = document.getElementById(columHTMLid);
  let titleRef = boardColRef.parentElement.getElementsByClassName("col-title-wrap");
  let title = [...titleRef].map((t) => t.innerText);
  let board = boardColRef.getElementsByClassName("task-card-wrap");
  if (board.length == 0) {
    boardColRef.innerHTML += getNoTask(title);
  }
}

function taskHasStatus(taskStatusId, indexTask) {
  return tasksArray[indexTask][1].status === taskStatusId;
}

function subtasksExist(indexTask) {
  return tasksArray[indexTask][1].subtasks !== undefined;
}

/**
 * This Function renders all subtasks info on dedicated tasks
 * 
 * @param {String} indexTask index of tasks with subtasks
 */
function renderSubtaskProgressInfo(indexTask) {
  let htmlId = "subtasks-progress-" + String(indexTask);
  let taskSubtaskInfoRef = document.getElementById(htmlId);
  taskSubtaskInfoRef.innerHTML = "";
  taskSubtaskInfoRef.innerHTML = getTaskCardSubtaskTemplate(indexTask);
  renderSubtasksProgressbarFill(indexTask);
}

/**
 * This Function renders Tasks Contact with a lmit of maximum 3 badges, else indicated by a layer  
 * 
 * @param {String} indexTask index of tasks with subtasks
 */
function renderBoardCardContacts(indexTask) {
  let htmlId = "task-contacts-" + String(indexTask);
  let taskCardContactsRef = document.getElementById(htmlId);
  taskCardContactsRef.innerHTML = "";
  let objKeys = Object.keys(tasksArray[indexTask][1]?.assignedTo || {}).length;
  let maximalShownBadges = Math.min(3, objKeys);
  for (
    let indexTaskContact = 0; indexTaskContact < maximalShownBadges; indexTaskContact++
  ) {
    taskCardContactsRef.innerHTML += getTaskCardContactsTemplate(indexTaskContact, indexTask
    );
  }
  if (objKeys > maximalShownBadges) {
    taskCardContactsRef.innerHTML += getTaskAssignedContactsRemainderTemplate(objKeys - maximalShownBadges);
  }
}

/**
 * This Function sets backgroundclass based on tasks category class
 * 
 * @param {String} current taskCategory class
 * @returns {String} new background class
 */
function getTaskCategoryClass(taskCategory) {
  let taskCategoryClass = "";
  switch (taskCategory) {
    case "user-story":
      taskCategoryClass = "bg-user-story";
      break;
    case "technical-task":
      taskCategoryClass = "bg-technical-task";
      break;
  }
  return taskCategoryClass;
}

/**
 * This function turns tasks status into the according status-svg  
 * 
 * @param {String} taskUrgency status of the tasks
 * @returns {String} svg-path according to status
 */
function getTaskPriorityIconSrc(taskUrgency) {
  let iconSrc = "";
  switch (taskUrgency) {
    case "urgent":
      iconSrc = "/assets/icons/urgent.svg";
      break;
    case "medium":
      iconSrc = "/assets/icons/medium.svg";
      break;
    case "low":
      iconSrc = "/assets/icons/low.svg";
      break;
  }
  return iconSrc;
}

/**
 * this Function turns task status into correct spelling
 * 
 * @param {String} taskCategory task category: user-story / technical-task
 * @returns {String} correct spelled task Category
 */
function getCategoryNameTemplate(taskCategory) {
  switch (taskCategory) {
    case "user-story":
      return "User Story";
    case "technical-task":
      return "Technical Task";
  }
}

/**
 * This Function allows to search within the boards for title and description
 * 
 */
function searchTask() {
  let taskWrap = document.getElementsByClassName("task-card-wrap");
  let inputRef = document.getElementsByClassName("search-input");
  let searchRef = document.getElementsByClassName("task-description-wrap");
  let foundRef = "";
  [...taskWrap].forEach((c) => c.classList.add("d-none"));
  foundRef = [...searchRef].filter((t) =>
    t.innerText.toLowerCase().includes(inputRef[0].value.toLowerCase())
  );
  foundRef.forEach((c) =>
    c.parentElement.parentElement.classList.remove("d-none")
  );
}

/**
 * This Function activates Drop Function while Drag&Drop
 * 
 * @param {event} ev 
 */
function allowDrop(ev) {
  ev.preventDefault();
}

/**
 * This Function starts Drag
 * 
 * @param {event} event 
 * @returns {void}
 */
async function startDragging(event) {
  tasksArray = await getTasksArray();
  toggleDragArea();
  currentTask = tasksArray[event];
  return currentTask;
}

/**
 * This function sets new status of dropped Tasks 
 * 
 * @param {event} event 
 */
async function moveTask(event) {
  let targetTask = event.target.closest(".col-content[id]");
  targetTask = targetTask.id.replace("-", "");
  await updateStatus(`tasks/${currentTask[0]}/status`, targetTask);
  await initBoard();
}

/**
 * This Function toggles all Drop-Zones
 * 
 */
function toggleDragArea() {
  let area = document.querySelectorAll(".col-empty-wrap:last-of-type");
  [...area].forEach((c) => c.classList.toggle("d-none"));
}

async function updateStatus(path = "", taskData = {}) {
  let response = await fetch(database + path + ".json", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(taskData),
  });
}

function openAddTaskOverlay(taskStatusId) {
  document
    .getElementById("add-task-overlay-bg-wrap")
    .classList.add("dim-active");
  document
    .getElementById("add-task-overlay-wrap")
    .classList.add("overlay-open");
  renderAddTaskForm("add-task-overlay", taskStatusId);
}

function closeAddTaskOverlay() {
  document
    .getElementById("add-task-overlay-bg-wrap")
    .classList.remove("dim-active");
  document
    .getElementById("add-task-overlay-wrap")
    .classList.remove("overlay-open");
}

/**
 * This function sets the overlay from the current clicked task-element
 * 
 * @param {String} indexTask  index of the task 
 */
async function showTaskOverlay(indexTask) {
  let overlay = document.querySelector(".task-overlay-wrap");
  let currentTask = tasksArray[indexTask][1];
  blurBackgroundBoard();
  setTimeout(() => {
    getTaskOverlay(indexTask, currentTask, overlay);
    overlayWipe();
  }, overlayTransitionMiliSeconds);
}

/**
 * adds a darker background to get a better focus on current overlay
 * 
 */
function blurBackgroundBoard() {
  document.getElementById("task-overlay").classList.add("dim-active");
}

/**
 * This Function shows the overlay element
 * 
 */
function overlayWipe() {
  let taskOverlayRef = document.getElementById("task-overlay-wrap");
  taskOverlayRef.classList.add("open");
}

/**
 * This Function removes the Task Overlay
 * 
 */
function closeTaskOverlays() {
  let overlay = document.getElementById("task-overlay-wrap");
  document.getElementById("task-overlay-wrap").classList.remove("open");
  document.getElementById("task-overlay").classList.remove("dim-active");
  newTaskAssignedContactsIndices = [];
  renderBoard();
}

function getTaskCompletedSubtasksNumber(indexTask) {
  let completedSubtasksNumber = 0;
  for (
    let indexSubtask = 0;
    indexSubtask < tasksArray[indexTask][1].subtasks.length;
    indexSubtask++
  ) {
    if (tasksArray[indexTask][1].subtasks[indexSubtask][1].done == true) {
      completedSubtasksNumber += 1;
    }
  }
  return completedSubtasksNumber;
}

function renderSubtasksProgressbarFill(indexTask) {
  let progBarRef = document.getElementById("progress-" + String(indexTask));
  let widthString =
    String(
      (
        getTaskCompletedSubtasksNumber(indexTask) /
        tasksArray[indexTask][1].subtasks.length
      ).toFixed(2) * 100
    ) + "%";
  progBarRef.style.width = widthString;
}

/**
 * This Function deletes the current active Task
 * 
 * @param {String} indexTask  index of the task 
 */
async function deleteTask(indexTask) {
  closeTaskOverlays();
  await deleteDataBaseElement(`tasks/${tasksArray[indexTask][0]}`);
  await initBoard();
}

/**
 * This Function opens edit-Task Overlay and loads its specific content
 * 
 * @param {String} indexTask index of the task 
 */
async function editTask(indexTask) {
  tasksArray = await getTasksArray();
  let overlay = document.querySelector(".task-overlay-wrap");
  let currentTask = tasksArray[indexTask][1];
  loadOptionalScalarTaskInfo(currentTask, indexTask);
  overlay.innerHTML = editTaskTemplate(indexTask, currentTask);
}

/**
 * This Function sets the optional content from the to-edit-Task (assignedTo / subtasks)
 * 
 * @param {Object} currentTask the current edited Task
 * @param {String} indexTask index of the task 
 */
function loadOptionalScalarTaskInfo(currentTask, indexTask) {
  let currentSubtasks = tasksArray[indexTask][1]?.subtasks || {};
  newTaskAssignedContactsIndices =
  currentTask.assignedTo?.map((i) => i[1].Id) || [];
  newSubtasksIndices = currentTask.subtasks?.map((i) => i[1].Id) || [];
  newTaskSubtasks = Object.values(currentSubtasks).map((i) => i[1]);
}

/**
 * This Function submits the edited Task to the firebase and reloads the board 
 * 
 * @param {String} indexTask index of the task 
 */
async function submitEditTask(indexTask) {
  let editedTaskObj = tasksArray[indexTask][1];
  let taskID = tasksArray[indexTask][0];
  let newTaskObj = getNewTaskScalarInformation("", editedTaskObj);
  await updateDatabaseObject(`tasks/${taskID}`, newTaskObj);
  tasksArray = await getTasksArray();
  await submitNewTaskOptionalComplexInfo(taskID);
  await initBoard();
  closeTaskOverlays();
}
