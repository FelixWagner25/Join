async function initBoard() {
  tasksArray = await getTasksArray();
  renderBoard();
}

async function getTasksArray() {
  let tasks = await getDataBaseElement("tasks");
  tasksArray = Object.entries(tasks);
  return tasksArray;
}

function renderBoard() {
  renderBoardColumn("to-do", "todo");
  // renderBoardColumn("in-progress");
  // renderBoardColumn("await-feedback");
  // renderBoardColumn("done");f
}

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
}

function taskHasStatus(taskStatusId, indexTask) {
  return tasksArray[indexTask][1].status === taskStatusId;
}

function subtasksExist(indexTask) {
  return tasksArray[indexTask][1].subtasks !== undefined;
}

function renderSubtaskProgressInfo(indexTask) {
  let htmlId = "subtasks-progress-" + String(indexTask);
  let taskSubtaskInfoRef = document.getElementById(htmlId);
  taskSubtaskInfoRef.innerHTML = "";
  taskSubtaskInfoRef.innerHTML = getTaskCardSubtaskTemplate(indexTask);
}

function renderBoardCardContacts(indexTask) {
  let htmlId = "task-contacts-" + String(indexTask);
  let taskCardContactsRef = document.getElementById(htmlId);
  taskCardContactsRef.innerHTML = "";

  for (
    let indexTaskContact = 0;
    indexTaskContact < tasksArray[indexTask][1].assignedTo.length;
    indexTaskContact++
  ) {
    taskCardContactsRef.innerHTML += getTaskCardContactsTemplate(
      indexTaskContact,
      indexTask
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
  let taskWrap = document.getElementsByClassName('task-card-wrap');
  let inputRef = document.getElementsByClassName('search-input');
  let searchRef = document.getElementsByClassName('task-description-wrap');
  let foundRef = "";
  [...taskWrap].forEach((c) => c.classList.add('d-none'));
  foundRef = [...searchRef].filter((t) => t.innerText.includes(inputRef[0].value));
  foundRef.forEach((c) => c.parentElement.parentElement.classList.remove('d-none'));
}

