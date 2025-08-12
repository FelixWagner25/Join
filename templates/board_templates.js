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
                  tasksArray[indexTask][1]?.description || ""
                }</div>   
            </div>
            <div class="d-flex-c-sb gap-8px" id="subtasks-progress-${indexTask}"></div>
            <div class="d-flex-c-sb task-priority-wrap">
                    <div class="d-flex mg-l-8px task-badge" id="task-contacts-${indexTask}">
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

function getTaskCardSubtaskTemplate(indexTask) {
  return `
  <div class="progress-bar">
    <div class="progress-bar-status" id="progress-${indexTask}"></div>
  </div>
  <div class="font-Inter-400-12px text-color-black d-flex">
    ${getTaskCompletedSubtasksNumber(indexTask)}/${
    tasksArray[indexTask][1].subtasks.length
  } Subtasks
  </div>
  `;
}

function getTaskCardContactsTemplate(indexTaskContact, indexTask) {
  return `
  <div class="task-card-contact-badge d-flex-row-c-c ${getContactColorClassNameByFirebaseId(
    tasksArray[indexTask][1].assignedTo[indexTaskContact][1].Id
  )}">
    <div class="font-Inter-400-12px">
      ${getFirstTwoStringInitialsByFirebaseId(
        tasksArray[indexTask][1].assignedTo[indexTaskContact][1].Id
      )}
    </div>
  </div>
  `;
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

    <h2 class="font-Inter-700-47px text-color-black  task-overlay-title">${
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
      <div class="font-Inter-400-20px text-color-black">${currentTask.priority} 
      <img src=${getTaskPriorityIconSrc(currentTask.priority)} ></div>
    </div>

    <div class="task-overlay-assignment-wrap d-flex-column">
      <div class="font-Inter-400-20px text-color-2A3647">Assigned To:</div>
      <article class="d-flex-column">${
        currentTask.assignedTo
          ?.map(
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
          .join("") || ""
      }
      </article>
    </div>

    <div class="task-overlay-assignment-wrap d-flex-column">
      <div class="font-Inter-400-20px text-color-2A3647">Subtasks</div>
      <article class="d-flex-column">${
        currentTask.subtasks
          ?.map(
            (s) =>
              ` <div class="input-container d-flex"><div class="input-checkbox task-overlay-checkbox-wrap d-flex-align-item-c font-Inter-400-16px text-color-black"><input type="checkbox" name="checkbox-subtask" ${
                s[1].done ? "checked" : ""
              } onclick="setSubtaskStatus(this, ${indexTask}, '${
                s[0]
              }')"><div>${s[1].name}</div></div></div>`
          )
          .join("") || ""
      }</article>
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
                <button class="contact-details-delete-contact" onclick="deleteTask(${indexTask})">
                <img
                    src="/assets/icons/delete.svg"
                    alt="delete trash bin"
                    class="delete-contact-icon"
                />
                <span class="edit-contact-text">Delete</span>
                </button>
            </div>
      </div>
  `;
}

function editTaskTemplate(indexTask, currentTask) {
  return `
  <div class="scroll-overlay">
<form class="max-width-976px" onsubmit="requiredInputValidation(undefined, ${indexTask}); event.preventDefault()">
            <div class="d-flex-column gap-8px pd-b-64px">
              <div class="d-flex-column gap-32px">
                <div class="d-flex-column gap-8px height-96px">
                  <label
                    for="task-title"
                    class="font-Inter-400-20px text-color-2A3647"
                    >Title<span class="col-red">*</span></label
                  >
                  <input
                    class="task-input-border task-input-text-field font-Inter-400-12px editable required"
                    type="text"
                    id="task-title"
                    value="${currentTask.title}"
                    
                  />
                  <div class="d-none validation font-Inter-400-13px text-color-FF8190">This field is required!</div>
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
                <div class="d-flex-column gap-8px height-96px">
                  <label for="task-due-date" class="input-label"
                    >Due date<span class="col-red">*</span></label
                  >
                  <input
                    class="task-input-border task-input-date font-Inter-400-20px editable required"
                    type="date"
                    min="${currentDate}"
                    id="task-due-date"
                    value="${currentTask.dueDate}"
                    onclick="this.showPicker()"
                    
                  />
                  <div class="d-none validation font-Inter-400-13px text-color-FF8190">This field is required!</div>
                </div>
              </div>

              <div class="separator"></div>

              <div class="d-flex-column gap-32px">
                <div class="d-flex-column gap-8px">
                  <label class="font-Inter-400-20px text-color-2A3647"
                    >Priority</label
                  >
                  <div class="d-flex gap-16px overlay-priority">
                    <button
                      type="button"
                      class="task-priority-btn d-flex-row-c-c gap-8px font-Inter-400-20px ${
                        currentTask.priority == "urgent"
                          ? `active-${currentTask.priority}`
                          : ""
                      }"
                      id="task-priority-urgent"
                      onclick="setTaskPriority('task-priority-urgent')"
                      
                    >
                      <span>Urgent</span>
                      <span class="task-priority-btn-icon urgent-icon"></span>
                    </button>
                    <button
                      type="button"
                      class="task-priority-btn d-flex-row-c-c gap-8px font-Inter-400-20px  ${
                        currentTask.priority == "medium"
                          ? `active-${currentTask.priority}`
                          : ""
                      }"
                      id="task-priority-medium"
                      onclick="setTaskPriority('task-priority-medium')"
                    >
                      <span>Medium</span>
                      <span class="task-priority-btn-icon medium-icon"></span>
                    </button>
                    <button
                      type="button"
                      class="task-priority-btn d-flex-row-c-c gap-8px font-Inter-400-20px  ${
                        currentTask.priority == "low"
                          ? `active-${currentTask.priority}`
                          : ""
                      }"
                      id="task-priority-low"
                      onclick="setTaskPriority('task-priority-low')"
                    >
                      <span>Low</span>
                      <span class="task-priority-btn-icon low-icon"></span>
                    </button>
                  </div>
                </div>

                <div class="d-flex-column gap-8px p-relative" onclick="event.stopPropagation()">
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
                    oninput="searchContact()"
                    onclick="openTaskAssignedContactsDropdown()"
                    autocomplete="off"
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
                    onkeypress="addSubtaskOnEnterPress(event)"
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
                  <ul class="tasks-subtask-list" id="tasks-subtasks-list">
                  ${
                    currentTask.subtasks
                      ?.map(
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
                      .join("") || ""
                  }
                  </ul>
                </div>
              </div>
            </div>

            <div class="d-flex-c-sb">
              <div class="font-Inter-400-16px">
                <span class="col-red">*</span>This field is required
              </div>

              <div class="task-form-btn-wrap d-flex">
                <button
                  class="task-form-btn d-flex-row-c-c text-color-white submit-task-btn"
                  type="submit"
                >
                  <span class="font-Inter-700-21px">Ok</span>
                  <span class="submit-task-btn-icon"></span>
                </button>
              </div>
            </div>
          </form>
        </div>`;
}
