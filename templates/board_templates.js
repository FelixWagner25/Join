function getBoardCardTemplate(indexTask) {
  return `
    <div class="task-card-wrap" >
          <div class="task-card d-flex-column" onclick="showTaskOverlay()">
            <div>
              <div class="task-category font-Inter-400-16px ${getTaskCategoryClass(
                tasksArray[indexTask][1].category
              )} ">${getCategoryNameTemplate(
    tasksArray[indexTask][1].category
  )}</div>
            </div>
            <div class="task-description-wrap d-flex">
                <div class="task-headline font-Inter-700-16px">${
                  tasksArray[indexTask][1].title
                }</div>
                <div class="task-description font-Inter-400-16px">${
                  tasksArray[indexTask][1].description
                }</div>   
            </div>
            <div class="d-flex-c-sb" id="subtasks-progress-${indexTask}"></div>
            <div class="d-flex-c-sb">
                    <div class="d-flex mg-l-8px" id="task-contacts-${indexTask}">
                    </div>
                    <img src=${getTaskPriorityIconSrc(
                      tasksArray[indexTask][1].priority
                    )} >
                </div>
        </div> 
    </div>
    `;
}

function getTaskCardSubtaskTemplate(indexTask) {
  return `
  <div class="progress-bar">
    <div class="progress-bar-status" id="progress-${indexTask}"></div>
  </div>
  <div class="font-Inter-400-12px text-color-black">
    ${tasksArray[indexTask][1].subtasks.length}/${tasksArray[indexTask][1].subtasks.length} Subtasks
  </div>
  `;
}

function getTaskCardContactsTemplate(indexTaskContact, indexTask) {
  return `
  <div class="task-card-contact-badge d-flex-row-c-c ${getContactColorClassById(
    tasksArray[indexTask][1].assignedTo[indexTaskContact].id
  )}">
    <div class="font-Inter-400-12px">
      ${getFirstTwoStringInitials(
        tasksArray[indexTask][1].assignedTo[indexTaskContact].name
      )}
    </div>
  </div>
  `;
}


function showTaskOverlay(params) {
  blurBackgroundBoard();
  setTimeout(() => {
  getTaskOverlay();
  }, overlayTransitionMiliSeconds);
}


function blurBackgroundBoard() {
  document.getElementById("task-overlay").classList.remove("d-none");
}

function getTaskOverlay(params) {
  let overlay = document.getElementById('task-overlay')
  overlay.innerHTML = `
  <div class="task-overlay-wrap bg-white" id="task-overlay-wrap" onclick="event.stopPropagation()">
    <div class="task-overlay">
    </div>
  </div>
  `;
}

function overlayWipe(params) {
  let taskOverlayRef = document.getElementById("task-overlay-wrap");
  taskOverlayRef.classList.add("overlay-open");
}

function closeTaskOverlays() {
  document.getElementById("task-overlay-wrap").classList.remove("task-overlay-wrap");
  document.getElementById("task-overlay").classList.add("d-none");
  document.getElementById("task-overlay").classList.remove("task-overlay-blur");
}