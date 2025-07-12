function getBoardCardTemplate(indexTask, tasksArray) {
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
                  tasksArray[indexTask][1]?.description || ""
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
    `;
}

function getTaskCardSubtaskTemplate(indexTask, tasksArray) {
  return `
  <div class="progress-bar">
    <div class="progress-bar-status" id="progress-${indexTask}"></div>
  </div>
  <div class="font-Inter-400-12px text-color-black">
    ${tasksArray[indexTask][1].subtasks.length}/${tasksArray[indexTask][1].subtasks.length} Subtasks
  </div>
  `;
}

function getTaskCardContactsTemplate(indexTaskContact, indexTask, tasksArray) {
  return `
  <div class="task-card-contact-badge d-flex-row-c-c ${getContactColorClassNameByFirebaseId(
    tasksArray[indexTask][1].assignedTo[indexTaskContact][1].Id
  )}">
    <div class="font-Inter-400-12px">
      ${getFirstTwoStringInitialsByFirebaseId(tasksArray[indexTask][1].assignedTo[indexTaskContact][1].Id || "")}
    </div>
  </div>
  `;
}

async function showTaskOverlay(indexTask) {
  let overlay = document.querySelector(".task-overlay-wrap");
  tasksArray = await getTasksArray();
  let currentTask =  tasksArray[indexTask][1]
  blurBackgroundBoard();
  setTimeout(() => {
    getTaskOverlay(indexTask,currentTask, overlay);
    overlayWipe();
  }, overlayTransitionMiliSeconds);
}

function blurBackgroundBoard() {
  document.getElementById("task-overlay").classList.remove("d-none");
}

function getTaskOverlay(indexTask, currentTask, overlay) {
  overlay.innerHTML = `
    <div class="task-overlay d-flex-column">
    <div class="d-flex-c-sb">
      <div class="task-category font-Inter-400-16px ${getTaskCategoryClass(
        currentTask.category
      )} ">${getCategoryNameTemplate(currentTask.category)}</div>
        <div class="close-icon-overlay-wrap d-flex-row-c-c">
          <div class="close-icon-overlay d-flex-row-c-c" onclick="closeTaskOverlays()">
            <img src="/assets/icons/close.svg" alt="close" class="close-icon"/>
          </div>
        </div>
      </div>

    <h2 class="font-Inter-700-61px text-color-black">${
      currentTask.title
    }</h2>

    <div class="font-Inter-400-20px text-color-black task-overlay-desc">${
      currentTask?.description || ""
    }</div>

    <div class="task-overlay-meta-wrap d-flex">
      <div class="font-Inter-400-20px text-color-2A3647">Due date:</div>
      <div class="font-Inter-400-20px text-color-black">${
        currentTask.dueDate
      }</div>
    </div>

    <div class="task-overlay-meta-wrap d-flex">
      <div class="font-Inter-400-20px text-color-2A3647">Priority: </div>
      <div class="font-Inter-400-20px text-color-black">${
        currentTask.priority
      } 
      <img src=${getTaskPriorityIconSrc(
        currentTask.priority
      )} ></div>
    </div>

    <div class="task-overlay-assignment-wrap d-flex-column">
      <div class="font-Inter-400-20px text-color-2A3647">Assigned To:</div>
      <article class="d-flex-column">${currentTask.assignedTo?.map(
          (p) => `
        <div class=" d-flex-c-sb">
          <div class="task-overlay-contact d-flex-align-item-c">
            <div class="task-card-contact-badge d-flex-row-c-c ${getContactColorClassNameByFirebaseId(
         p[1].Id
            )}">
              <div class="font-Inter-400-12px text-color-white">${getFirstTwoStringInitialsByFirebaseId(
                p[1].Id
              )}
              </div>
            </div>
          <div class="font-OpenSans-400-19px">${p[1].name}</div>
          </div>
        </div>`
        )
        .join("")}
      </article>
    </div>

    <div class="task-overlay-assignment-wrap d-flex-column">
      <div class="font-Inter-400-20px text-color-2A3647">Subtasks</div>
      <article class="d-flex-column">${currentTask.subtasks?.map(
          (s) =>
            ` <div class="input-container d-flex"><div class="input-checkbox task-overlay-checkbox-wrap d-flex-align-item-c font-Inter-400-16px text-color-black"><input type="checkbox" name="checkbox-subtask"><div>${s[1].name}</div></div></div>`
        )
        .join("") || ""}</article>
    </div>

    <div class="edit-delete-wrap d-flex">
                <button
                class="contact-details-edit-contact"
                onclick="editTask(${indexTask})"
                >
                <img
                    src="/assets/icons/edit.svg"
                    alt="edit pencil"
                    class="edit-contact-icon"
                />
                <span class="edit-contact-text">Edit</span>
                </button>
                <div class="contact-details-delete-contact" onclick="deleteTask(${indexTask})">
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

//renderAssignedContactsCheckboxes anpassen zur Nutzung Auskommentierter Funktion. 
function getContactIDs(indexTask) {
/*   const contactObj = tasksArray[indexTask][1]?.assignedTo || {};
   return Object.keys(contactObj) */  
    let objValues = Object.values(tasksArray[indexTask][1]?.assignedTo || {});
    let activeContacts = objValues.map((p) => p[1].Id)
    let contactIndexes = []
  let contactArrayIteration = contactsArray.map((p) => p[0])
  for (let i = 0; i < contactArrayIteration.length; i++) {
    if (activeContacts.includes(contactArrayIteration[i]))
    contactIndexes.push(contactArrayIteration[i])
  }
return contactIndexes
}

function getSubtaskIDs(indexTask) {
  const subtaskObj = tasksArray[indexTask][1]?.subtasks || {};
  return Object.keys(subtaskObj);
}

function editTaskTemplate(indexTask, currentTask) {
  return `
<form class="max-width-976px" onsubmit="submitEditTask(${indexTask}); event.preventDefault()">
            <div class="d-flex-column gap-8px pd-b-64px">
              <div class="d-flex-column gap-32px">
                <div class="d-flex-column gap-8px">
                  <label
                    for="task-title"
                    class="font-Inter-400-20px text-color-2A3647"
                    >Title<span class="col-red">*</span></label
                  >
                  <input
                    class="task-input-border task-input-text-field font-Inter-400-12px editable"
                    type="text"
                    id="task-title"
                    value="${currentTask.title}"
                    required
                  />
                </div>

                <div class="d-flex-column gap-8px">
                  <label
                    for="task-description"
                    class="font-Inter-400-20px text-color-2A3647"
                    >Description</label
                  >
                  <textarea
                    class="task-input-border task-input-text-area font-Inter-400-12px editable"
                    id="task-description"
                  >${currentTask?.description || ""}</textarea>
                </div>
                <div class="d-flex-column gap-8px">
                  <label for="task-due-date" class="input-label"
                    >Due date<span class="col-red">*</span></label
                  >
                  <input
                    class="task-input-border task-input-date editable"
                    type="date"
                    id="task-due-date"
                    value="${currentTask.dueDate}"
                    required
                  />
                </div>
              </div>

              <div class="separator"></div>

              <div class="d-flex-column gap-32px">
                <div class="d-flex-column gap-8px">
                  <label class="font-Inter-400-20px text-color-2A3647"
                    >Priority</label
                  >
                  <div class="d-flex gap-16px">
                    <button
                      type="button"
                      class="task-priority-btn d-flex-row-c-c gap-8px font-Inter-400-20px"
                      id="task-priority-urgent"
                      onclick="setTaskPriority('task-priority-urgent')"
                    >
                      <span>Urgent</span>
                      <span class="task-priority-btn-icon urgent-icon"></span>
                    </button>
                    <button
                      type="button"
                      class="task-priority-btn d-flex-row-c-c gap-8px font-Inter-400-20px active-medium"
                      id="task-priority-medium"
                      onclick="setTaskPriority('task-priority-medium')"
                    >
                      <span>Medium</span>
                      <span class="task-priority-btn-icon medium-icon"></span>
                    </button>
                    <button
                      type="button"
                      class="task-priority-btn d-flex-row-c-c gap-8px font-Inter-400-20px"
                      id="task-priority-low"
                      onclick="setTaskPriority('task-priority-low')"
                    >
                      <span>Low</span>
                      <span class="task-priority-btn-icon low-icon"></span>
                    </button>
                  </div>
                </div>

                <div class="d-flex-column gap-8px p-relative">
                  <label
                    for="task-assigned-contacts"
                    class="font-Inter-400-20px text-color-2A3647"
                    >Assigned To</label
                  >
                  <input
                    class="p-relative task-input-border task-input-category font-Inter-400-20px"
                    type="text"
                    id="task-assigned-contacts"
                    placeholder="Select contacts to assign"
                    readonly
                    onclick="toggleTaskAssignedContactsDropdown()"
                  />
                  <span
                    class="p-absolute task-dropdown-icon"
                    id="task-assigend-contacts-dropdown-icon"
                  ></span>
                  <div
                    class="d-none p-absolute task-input-dropdown"
                    id="task-assigned-contacts-dropdown"
                  ></div>
                  <div
                    class="d-flex gap-8px p-relative"
                    id="task-assigned-contacts-badges"
                  >
                 ${currentTask.assignedTo?.map(
                     (p) => `
        <div class=" d-flex-c-sb">
          <div class="task-overlay-contact d-flex-align-item-c">
            <div class="task-card-contact-badge d-flex-row-c-c ${getContactColorClassNameByFirebaseId(
         p[1].Id
            )}">
              <div class="font-Inter-400-12px text-color-white">${getFirstTwoStringInitialsByFirebaseId(
                   p[1].Id
                ) || ""}
            
              </div>
            </div>
          </div>
        </div>`
                   )
                   .join("")}
                  </div>
                </div>
    

                <div class="d-flex-column gap-8px p-relative">
                  <label
                    for="task-subtasks"
                    class="font-Inter-400-20px text-color-2A3647"
                    >Subtasks</label
                  >
                  <input
                    oninput="showSubtaskControlButtons()"
                    class="p-relative task-input-border task-input-category font-Inter-400-20px"
                    type="text"
                    id="task-subtasks"
                    value="${currentTask?.subtask || ""}"
                  />
                  <span
                    class="p-absolute task-subtask-icon task-add-subtask-icon"
                    id="task-add-subtask-icon"
                  ></span>
                  <div
                    class="d-none p-absolute d-flex gap-8px task-subtask-icon"
                    id="task-clear-submit-subtask-icon-wrap"
                  >
                    <div
                      class="d-flex-row-c-c task-subtask-icon-wrap"
                      onclick="clearInputTagValue('task-subtasks')"
                    >
                      <span class="task-clear-subtask-icon"></span>
                    </div>
                    <span class="separator"></span>
                    <div
                      class="d-flex-row-c-c task-subtask-icon-wrap"
                      onclick="addSubtask()"
                    >
                      <span class="task-submit-subtask-icon"></span>
                    </div>
                  </div>
                  <ul id="tasks-subtasks-list">
                  ${currentTask.subtasks?.map(
                      (s, i) => ` 
                            <li id="task-subtask-${i}" class="p-relative font-Inter-400-13px subtask-list-element d-flex-row-c-fs gap-8px">
            <div>&#x2022;</div>
            <span class="new-input">${s[1].name}</span>
            <div class=" p-absolute d-flex-row-c-c gap-4px task-subtask-control-icon-wrap">
                <span class="task-edit-subtask-icon" onclick="editSubtask(${i})"></span>
                <span class="separator-subtask-edit-delete-icons"></span>
                <span class="task-delete-subtask-icon" onclick="deleteSubtask(${i})"></span>    
            </div>
        </li>
                    `
                    )
                    .join("") || ""}

                  </ul>
                </div>
              </div>
            </div>

            <div class="d-flex-row-end-sb">
              <div class="font-Inter-400-16px">
                <span class="col-red">*</span>This field is required
              </div>

              <div class="task-form-btn-wrap d-flex">
                <button
                  class="task-form-btn d-flex-row-c-c clear-task-btn"
                  type="reset"
                  onclick="clearAddTaskForm()"
                >
                  <span class="font-Inter-400-20px">Clear</span>
                  <span class="clear-task-btn-icon"></span>
                </button>
                <button
                  class="task-form-btn d-flex-row-c-c text-color-white submit-task-btn"
                  type="submit"
                >
                  <span class="font-Inter-700-21px">Create Task</span>
                  <span class="submit-task-btn-icon"></span>
                </button>
              </div>
            </div>
          </form>`;
}
