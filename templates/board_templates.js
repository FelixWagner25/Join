function getBoardCardTemplate(indexTask) {
  return `
    <div class="task-card-wrap bg-white" draggable="true" ondragstart="startDragging(${indexTask})">
          <div class="task-card d-flex-column" onclick="showTaskOverlay(${indexTask})">
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
    <div class="d-none col-empty-wrap"></div>
    `;
}

function getNoTask(title) {
  return `
    <div class="no-task-feedback font-OpenSans-400-16px d-flex-row-c-c">No Tasks ${title}</div>
    <div class="d-none col-empty-wrap"></div>
    `
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
  <div class="task-card-contact-badge d-flex-row-c-c ${getContactColorClassName(
          indexTaskContact
        )}">
    <div class="font-Inter-400-12px">
      ${getFirstTwoStringInitials(
        tasksArray[indexTask][1].assignedTo[indexTaskContact].name
      )}
    </div>
  </div>
  `;
}

 function showTaskOverlay(indexTask) {
  blurBackgroundBoard();
  setTimeout(() => {
    getTaskOverlay(indexTask);
    overlayWipe();
  }, overlayTransitionMiliSeconds);
}

function blurBackgroundBoard() {
  document.getElementById("task-overlay").classList.remove("d-none");
}

function getTaskOverlay(indexTask) {
  let overlay = document.querySelector(".task-overlay-wrap");
  overlay.innerHTML = `
    <div class="task-overlay d-flex-column">
    <div class="d-flex-c-sb">
      <div class="task-category font-Inter-400-16px ${getTaskCategoryClass(tasksArray[indexTask][1].category)} ">${getCategoryNameTemplate(tasksArray[indexTask][1].category)}</div>
        <div class="close-icon-overlay-wrap d-flex-row-c-c">
          <div class="close-icon-overlay d-flex-row-c-c" onclick="closeTaskOverlays()">
            <img src="/assets/icons/close.svg" alt="close" class="close-icon"/>
          </div>
        </div>
      </div>

    <h2 class="font-Inter-700-61px text-color-black">${tasksArray[indexTask][1].title}</h2>

    <div class="font-Inter-400-20px text-color-black task-overlay-desc">${
      tasksArray[indexTask][1].description
    }</div>

    <div class="task-overlay-meta-wrap d-flex">
      <div class="font-Inter-400-20px text-color-2A3647">Due date:</div>
      <div class="font-Inter-400-20px text-color-black">${
        tasksArray[indexTask][1].dueDate
      }</div>
    </div>

    <div class="task-overlay-meta-wrap d-flex">
      <div class="font-Inter-400-20px text-color-2A3647">Priority: </div>
      <div class="font-Inter-400-20px text-color-black">${
        tasksArray[indexTask][1].priority
      } 
      <img src=${getTaskPriorityIconSrc(tasksArray[indexTask][1].priority)} ></div>
    </div>

    <div class="task-overlay-assignment-wrap d-flex-column">
      <div class="font-Inter-400-20px text-color-2A3647">Assigned To:</div>
      <article class="d-flex-column">${tasksArray[indexTask][1].assignedTo.map((p) => `
        <div class=" d-flex-c-sb">
          <div class="task-overlay-contact d-flex-align-item-c">
            <div class="task-card-contact-badge d-flex-row-c-c ${getContactColorClassName(
          0
        )}">
              <div class="font-Inter-400-12px text-color-white">${getFirstTwoStringInitials(p.name)}
              </div>
            </div>
          <div class="font-OpenSans-400-19px">${p.name}</div>
          </div>
        </div>`).join("")}
      </article>
    </div>

    <div class="task-overlay-assignment-wrap d-flex-column">
      <div class="font-Inter-400-20px text-color-2A3647">Subtasks</div>
      <article class="d-flex-column">${tasksArray[indexTask][1].subtasks?.map((s) => ` <div class="input-container d-flex"><div class="input-checkbox task-overlay-checkbox-wrap d-flex-align-item-c font-Inter-400-16px text-color-black"><input type="checkbox" name="checkbox-subtask"><div>${s}</div></div></div>`).join("")}</article>
    </div>

    <div class="edit-delete-wrap d-flex">
                <div
                class="contact-details-edit-contact"
                onclick=""
                >
                <img
                    src="/assets/icons/edit.svg"
                    alt="edit pencil"
                    class="edit-contact-icon"
                />
                <span class="edit-contact-text">Edit</span>
                </div>
                <div class="contact-details-delete-contact" onclick="">
                <img
                    src="/assets/icons/delete.svg"
                    alt="delete trash bin"
                    class="delete-contact-icon"
                />
                <span class="edit-contact-text">Delete</span>
                </div>
            </div>
      </div>
  `;
}

function overlayWipe() {
  let taskOverlayRef = document.getElementById("task-overlay-wrap");
  taskOverlayRef.classList.add("open");
}

function closeTaskOverlays() {
  document.getElementById("task-overlay-wrap").classList.remove("open");
  document.getElementById("task-overlay").classList.add("d-none");
  document.getElementById("task-overlay").classList.remove("task-overlay-blur");
}
