let currentTask = "";

/**
 * Initializes board page. Initializes contacts and task arrays and renders board columns.
 */
async function initBoard() {
  contactsArray = await getSortedContactsArray();
  tasksArray = await getTasksArray();
  await renderBoard();
}

/**
 * Renders the Board for each task status column
 *
 */
async function renderBoard() {
  renderBoardColumn("to-do", "todo");
  renderBoardColumn("in-progress", "inprogress");
  renderBoardColumn("await-feedback", "awaitfeedback");
  renderBoardColumn("done", "done");
}

/**
 * Renders a Board Column
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
 * Renders a placeholder if no tasks were found in the dedicated column
 *
 * @param {String} columHTMLid task status from the DOM
 */
function checkEmptyColumn(columHTMLid) {
  let boardColRef = document.getElementById(columHTMLid);
  let titleRef =
    boardColRef.parentElement.getElementsByClassName("col-title-wrap");
  let title = [...titleRef].map((t) => t.innerText);
  let board = boardColRef.getElementsByClassName("task-card-wrap");
  if (board.length == 0) {
    boardColRef.innerHTML += getNoTask(title);
  }
}

/**
 * Checks whether a task has a certain task status
 *
 * @param {string} taskStatusId
 * @param {integer} indexTask
 * @returns {boolean} true if the task has the specified status, otherwise false
 */
function taskHasStatus(taskStatusId, indexTask) {
  return tasksArray[indexTask][1].status === taskStatusId;
}

/**
 * Checks whether a task has subtasks
 *
 * @param {integer} indexTask
 * @returns {boolean} true if task has subtasks, otherwise false
 */
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
    let indexTaskContact = 0;
    indexTaskContact < maximalShownBadges;
    indexTaskContact++
  ) {
    taskCardContactsRef.innerHTML += getTaskCardContactsTemplate(
      indexTaskContact,
      indexTask
    );
  }
  if (objKeys > maximalShownBadges) {
    taskCardContactsRef.innerHTML += getTaskAssignedContactsRemainderTemplate(
      objKeys - maximalShownBadges
    );
  }
}

/**
 * This Function toggles a user-feedback, if no searched task was found
 *
 * @param {Object} foundRef  the task element
 */
function setNoTaskFoundFeedback(foundRef) {
  let noTask = document.getElementById("no-task-found");
  if (foundRef.length == 0) {
    noTask.classList.remove("d-none");
  } else {
    noTask.classList.add("d-none");
  }
}

/**
 * Opens add task overlay
 *
 * @param {string} taskStatusId
 */
function openAddTaskOverlay(taskStatusId) {
  document.getElementById("add-task-overlay-wrap").classList.remove("d-none");
  document.getElementById("add-task-overlay-bg-wrap").classList.add("disable-scroll")
  document.getElementById("add-task-overlay-bg-wrap").classList.add("dim-active");
  setTimeout(() => {
  renderAddTaskForm("add-task-overlay", taskStatusId);
  document.getElementById("add-task-overlay-wrap").classList.add("overlay-open");
  }, overlayTransitionMiliSeconds);
}

/**
 * Closes add task overlay
 */
function closeAddTaskOverlay() {
  document.getElementById("add-task-overlay-wrap").classList.remove("overlay-open");
  document.getElementById("add-task-overlay-bg-wrap").classList.remove("dim-active");
   setTimeout(() => {
  document.getElementById("add-task-overlay-wrap").classList.add("d-none");
  document.getElementById("add-task-overlay-bg-wrap").classList.remove("disable-scroll")
  }, 500);
}

/**
 * This function sets the overlay from the current clicked task-element
 *
 * @param {String} indexTask  index of the task
 */
async function showTaskOverlay(indexTask) {
  let overlay = document.querySelector(".task-overlay-wrap");
  let currentTask = tasksArray[indexTask][1];
    document.getElementById("task-overlay").classList.add("disable-scroll")
    document.getElementById("task-overlay-wrap").classList.remove("d-none");
  blurBackgroundBoard();
  setTimeout(() => {
    getTaskOverlay(indexTask, currentTask, overlay);
    overlayWipe();
  }, overlayTransitionMiliSeconds);
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
  setTimeout(() => {
    overlay.innerHTML = "";
  document.getElementById("task-overlay-wrap").classList.add("d-none");
  document.getElementById("add-task-overlay-wrap").classList.add("d-none");
  document.getElementById("task-overlay").classList.remove("disable-scroll")
  }, 500);
}

/**
 * Adds a darker background to get a better focus on current overlay
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
 * Renders subtask progress bar progression fill
 *
 * @param {integer} indexTask
 */
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
