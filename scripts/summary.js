/**
 * This Function renders all Tasks in background to have the correct amount of tasks entrys for dedicated functions
 *
 */
async function renderTasks() {
  tasksArray = await getTasksArray();
  countTasks(tasksArray);
  countTriage(tasksArray);
  getnearestDueDate(tasksArray);
}

/**
 * This Function sets all current Tasks per task-status
 *
 */
function countTasks() {
  let taskStatus = ["todo", "inprogress", "awaitfeedback", "done"];
  let countToTasks = "";
  let priority = tasksArray.filter((status) => status[1].priority == "urgent");
  for (let index = 0; index < taskStatus.length; index++) {
    countToTasks = tasksArray.filter(
      (status) => status[1].status == taskStatus[index],
    );
    renderSummaryBoard(countToTasks, taskStatus[index], priority);
  }
}

/**
 * This Function counts the amount of triage-tasks
 * 
 * @param {Array} tasksArray - list of all current stored tasks
 */
function countTriage(tasksArray) {
  let triageFigure = document.getElementById('email-request-count')
  let priority = tasksArray.filter((status) => status[1].status == "triage");
  triageFigure.innerHTML = priority.length
}

/**
 * This Function renders needed tasks information into the DOM
 *
 * @param {Array} countToTasks list of tasks objects for each task-status
 * @param {String} taskID Tasks-status
 * @param {Array} priority list of tasks objects with status: urgent
 */
function renderSummaryBoard(countToTasks, taskID, priority) {
  let board = document.getElementById(`${taskID}-count`);
  let totalTasksRef = document.getElementById("tasks-board-count");
  let priorityTaskRef = document.getElementById("urgent-count");
  board.innerHTML = countToTasks.length;
  totalTasksRef.innerHTML = tasksArray.length;
  priorityTaskRef.innerHTML = priority.length;
}

/**
 * This function gives back the nearest tasks deadline from the Board
 *
 */
function getnearestDueDate() {
  let deadline = document.getElementById("deadline-date");
  let date = new Date();
  let getcurrentDate = date.toISOString().split("T")[0];
  let dueDate = tasksArray.map((task) => task[1].dueDate);
  dueDate.sort();
  for (let index = 0; index < dueDate.length; index++) {
    if (dueDate[index] >= getcurrentDate) {
      deadline.innerHTML = dueDate[index];
      break;
    }
  }
}

/**
 * This Function takes users name from the session storage for a personalized greeting message
 *
 */
function userGreeting() {
  let greet = document.getElementById("personal-greeting");
  let comma = document.getElementById("comma");
  let name = sessionStorage.getItem("user") || "G";
  timeGreeting();
  checkAnimation();
  if (name !== "G") {
    comma.classList.remove("d-none");
    greet.innerHTML = name;
  }
}

/**
 * This function wether triggers greeting-Animation (mobile-only) or does nothing
 *
 * @returns {void}
 */
async function checkAnimation() {
  const alreadyShown = sessionStorage.getItem("greetingShown");
  const screenWidth = window.innerWidth;
  let greetContainer = document.getElementsByClassName("greeting-container");
  if (screenWidth > 1440) {
    sessionStorage.setItem("greetingShown", "true");
  } else if (screenWidth < 1440 && !alreadyShown) {
    await showGreetingAnimation();
    sessionStorage.setItem("greetingShown", "true");
    addEventListener("animationend", () => {
      greetContainer[0].classList.remove("greet-animation");
    });
  } else {
    return;
  }
}

/**
 * This Function shows the greeting Animation
 *
 */
async function showGreetingAnimation() {
  let greetingDiv = document.querySelector(".greeting-container");
  greetingDiv.classList.add("greet-animation");
}

/**
 * This Function sets a specific greeting based on the current time of day
 *
 */
function timeGreeting() {
  let text = document.getElementById("greeting-sentence");
  let time = new Date();
  let timeHour = time.getHours();
  switch (true) {
    case timeHour <= 11:
      text.innerText = "Good Morning";
      break;
    case timeHour >= 18:
      text.innerText = "Good Evening";
      break;
    default:
      text.innerText = "Good Afternoon";
      break;
  }
}
