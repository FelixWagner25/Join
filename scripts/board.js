async function initBoard() {
  contactsArray = await getSortedContactsArray();
  tasksArray = await getTasksArray();
  console.log(tasksArray);

  await renderBoard(tasksArray);
}

async function getTasksArray() {
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

async function renderBoard(tasksArray) {
  renderBoardColumn("to-do", "todo", tasksArray);
  renderBoardColumn("in-progress", "inprogress", tasksArray);
  renderBoardColumn("await-feedback", "awaitfeedback", tasksArray);
  renderBoardColumn("done", "done", tasksArray);
}

function renderBoardColumn(columHTMLid, taskStatusId, tasksArray) {
  let boardColRef = document.getElementById(columHTMLid);
  boardColRef.innerHTML = "";
  for (let i = 0; i < tasksArray.length; i++) {
    if (!taskHasStatus(taskStatusId, i, tasksArray)) {
      continue;
    }
    boardColRef.innerHTML += getBoardCardTemplate(i, tasksArray);
    if (subtasksExist(i, tasksArray)) {
      renderSubtaskProgressInfo(i);
    }
    renderBoardCardContacts(i, tasksArray);
  }
  checkEmptyColumn(columHTMLid);
}

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

function taskHasStatus(taskStatusId, indexTask, tasksArray) {
  return tasksArray[indexTask][1].status === taskStatusId;
}

function subtasksExist(indexTask, tasksArray) {
  return tasksArray[indexTask][1].subtasks !== undefined;
}

function renderSubtaskProgressInfo(indexTask) {
  let htmlId = "subtasks-progress-" + String(indexTask);
  let taskSubtaskInfoRef = document.getElementById(htmlId);
  taskSubtaskInfoRef.innerHTML = "";
  taskSubtaskInfoRef.innerHTML = getTaskCardSubtaskTemplate(indexTask);
  renderSubtasksProgressbarFill(indexTask);
}

function renderBoardCardContacts(indexTask, tasksArray) {
  let htmlId = "task-contacts-" + String(indexTask);
  let taskCardContactsRef = document.getElementById(htmlId);
  taskCardContactsRef.innerHTML = "";
  let objKeys = Object.keys(tasksArray[indexTask][1]?.assignedTo || {}).length;
  for (
    let indexTaskContact = 0;
    indexTaskContact < objKeys;
    indexTaskContact++
  ) {
    taskCardContactsRef.innerHTML += getTaskCardContactsTemplate(
      indexTaskContact,
      indexTask,
      tasksArray
    );
  }
}

function getTaskCategoryClass(taskCategory) {
  let taskCategroyClass = "";
  switch (taskCategory) {
    case "user-story":
      taskCategroyClass = "bg-user-story";
      break;
    case "technical-task":
      taskCategroyClass = "bg-technical-task";
      break;
  }
  return taskCategroyClass;
}

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

function getCategoryNameTemplate(taskCategory) {
  switch (taskCategory) {
    case "user-story":
      return "User Story";
    case "technical-task":
      return "Technical Task";
  }
}

function searchTask() {
  let taskWrap = document.getElementsByClassName("task-card-wrap");
  let inputRef = document.getElementsByClassName("search-input");
  let searchRef = document.getElementsByClassName("task-description-wrap");
  let foundRef = "";
  [...taskWrap].forEach((c) => c.classList.add("d-none"));
  foundRef = [...searchRef].filter((t) =>
    t.innerText.includes(inputRef[0].value)
  );
  foundRef.forEach((c) =>
    c.parentElement.parentElement.classList.remove("d-none")
  );
}

function allowDrop(ev) {
  ev.preventDefault();
}

let currentTask = "";
async function startDragging(event) {
  tasksArray = await getTasksArray();
  toggleDragArea();
  currentTask = tasksArray[event];
  return currentTask;
}

async function moveTask(event) {
  let targetTask = event.target.closest(".col-content[id]");
  targetTask = targetTask.id.replace("-", "");
  await updateStatus(`tasks/${currentTask[0]}/status`, targetTask);
  await initBoard();
}

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
  document.getElementById("add-task-overlay-wrap").classList.remove("d-none");
  renderAddTaskForm("add-task-overlay", taskStatusId);
}

function closeAddTaskOverlay() {
  document.getElementById("add-task-overlay-wrap").classList.add("d-none");
}

async function showTaskOverlay(indexTask) {
  let overlay = document.querySelector(".task-overlay-wrap");
  tasksArray = await getTasksArray();
  let currentTask = tasksArray[indexTask][1];
  blurBackgroundBoard();
  setTimeout(() => {
    getTaskOverlay(indexTask, currentTask, overlay);
    overlayWipe();
  }, overlayTransitionMiliSeconds);
}

function blurBackgroundBoard() {
  document.getElementById("task-overlay").classList.remove("d-none");
}

function overlayWipe() {
  let taskOverlayRef = document.getElementById("task-overlay-wrap");
  taskOverlayRef.classList.add("open");
}

function closeTaskOverlays() {
  let overlay = document.getElementById("task-overlay-wrap");
  document.getElementById("task-overlay-wrap").classList.remove("open");
  document.getElementById("task-overlay").classList.add("d-none");
  document.getElementById("task-overlay").classList.remove("task-overlay-blur");
  newTaskAssignedContactsIndices = [];
  overlay.innerHTML = "";
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
