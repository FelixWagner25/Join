async function renderTasks() {
    tasksArray = await getTasksArray();
    countTasks(tasksArray);
    getnearestDueDate(tasksArray)
}

function countTasks(tasksArray) {
    let taskStatus = ["todo", "inprogress", "awaitfeedback", "done"];
    let countToTasks = "";
    let countAll = tasksArray.length;
    let priority = tasksArray.filter((status) => status[1].priority == "urgent");
    for (let index = 0; index < taskStatus.length; index++) {
        countToTasks = tasksArray.filter((status) => status[1].status == taskStatus[index])
        renderSummaryBoard(countToTasks, taskStatus[index], countAll, priority)
    }
}

function renderSummaryBoard(countToTasks, taskID, totalTasks, priority) {
    let board = document.getElementById(`${taskID}-count`);
    let totalTasksRef = document.getElementById('tasks-board-count');
    let priorityTaskRef = document.getElementById('urgent-count');
    board.innerHTML = countToTasks.length;
    totalTasksRef.innerHTML = totalTasks ;
    priorityTaskRef.innerHTML = priority.length
}

function getnearestDueDate(tasksArray) {
    let deadline = document.getElementById('deadline-date');
    let date = new Date();
    let getcurrentDate = date.toISOString().split('T')[0];
    let dueDate = tasksArray.map((task) => task[1].dueDate);
    dueDate.sort();
    for (let index = 0; index < dueDate.length; index++) {
        if (dueDate[index] >= getcurrentDate) {
        deadline.innerHTML = dueDate[index]
        break
    } 
    }
}

function userGreeting(){
  let greet = document.getElementById('personal-greeting');
  let comma = document.getElementById('comma');
  let name = sessionStorage.getItem("user") || "G";
    timeGreeting();
    checkAnimation();
  if (name !== "G") {;
  comma.classList.remove('d-none');
  greet.innerHTML = name;
  } 
  return
}

async function checkAnimation() {
    const alreadyShown = sessionStorage.getItem('greetingShown');
    const screenWidth = window.innerWidth
    let greetContainer = document.getElementsByClassName('greeting')
    if (screenWidth > 820 && alreadyShown){
    sessionStorage.setItem('greetingShown', 'true');
    }  else if (screenWidth < 820 && !alreadyShown){ 
        await showGreetingAnimation();
        sessionStorage.setItem('greetingShown', 'true');
    addEventListener('animationend', () => {greetContainer[0].classList.remove('greet-animation')} )
    } else {
        return
    } 
}



async function showGreetingAnimation() {
    let greetingDiv = document.querySelector('.greeting')
    greetingDiv.classList.add('greet-animation')
}

function timeGreeting() {
    let text = document.getElementById('greeting-sentence');
    let time = new Date ();
    let timeHour = time.getHours();
    switch (true) {
        case timeHour <= 11:
            text.innerText = "Good Morning";
            break;
         case timeHour >= 18:
             text.innerText = "Good Evening"
            break;
        default:  text.innerText = "Good Afternoon"
            break;
    }
}