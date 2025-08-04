function getSubtaskListTemplate(indexSubtask) {
  return `
        <li id="task-subtask-${indexSubtask}" class="p-relative font-Inter-400-13px subtask-list-element d-flex-row-c-fs gap-8px">
            <div>&#x2022;</div>
            ${newTaskSubtasks[indexSubtask].name}
            <div class=" p-absolute d-flex-row-c-c gap-4px task-subtask-control-icon-wrap">
                <span class="task-edit-subtask-icon" onclick="editSubtask(${indexSubtask})"></span>
                <span class="separator-subtask-edit-delete-icons"></span>
                <span class="task-delete-subtask-icon" onclick="deleteSubtask(${indexSubtask})"></span>    
            </div>
        </li>
    `;
}

function getEditSubtaskTemplate(indexSubtask) {
  return `
    <input type="text" class="p-relative font-Inter-400-13px subtask-list-element edit-subtask" id="task-subtask-edit-${indexSubtask}" value="${newTaskSubtasks[indexSubtask].name}"></input>
        <div class=" p-absolute d-flex-row-c-c gap-4px task-subtask-control-icon-wrap">
            <div class="d-flex-row-c-c task-subtask-icon-wrap">
                <span class="task-delete-subtask-icon" onclick="deleteSubtask(${indexSubtask})"></span>
            </div>
            <span class="separator-subtask-edit-delete-icons"></span>
            <div class="d-flex-row-c-c task-subtask-icon-wrap">
                <span class="task-submit-subtask-icon" onclick="addEditedSubtask(${indexSubtask})"></span>
            </div>    
        </div>
    `;
}

function getTaskAssigendContactsTemplate(contactID, indexContact) {
  return `
    <div id="task-assigned-contact-wrap-${contactID}" onclick="toggleAssignContact('${contactID}',this)">
      <div class="pd-8px-16px task-assigned-contact-wrap">
        <div class="d-flex-row-c-fs gap-16px">
            <div class="profile-badge font-Inter-400-12px d-flex-row-c-c text-color-white ${getContactColorClassNameByFirebaseId(
              contactID
            )}">
                ${getFirstTwoStringInitialsByFirebaseId(contactID)}
            </div>
            ${contactsArray[indexContact][1].name}
        </div>
        <span class="task-assigned-contacts-checkbox-icon"></span>
      </div>
    </div>
    `;
}

function getTaskAssigendContactsOverlayTemplate(contactID, indexContact) {
  return `
    <div id="task-assigned-contact-wrap-overlay-${contactID}" onclick="toggleAssignContact('${contactID}',this)">
      <div class="d-flex-c-sb pd-8px-16px task-assigned-contact-wrap">  
      <div class="d-flex-row-c-fs gap-16px">
            <div class="profile-badge font-Inter-400-12px d-flex-row-c-c text-color-white ${getContactColorClassNameByFirebaseId(
              contactID
            )}">
                ${getFirstTwoStringInitialsByFirebaseId(contactID)}
            </div>
            ${contactsArray[indexContact][1].name}
        </div>
        <span class="task-assigned-contacts-checkbox-icon"></span>
      </div>
    </div>
    `;
}

function getTaskAssignedContactBadgeTemplate(contactID, indexContact) {
  return `
    <div class="profile-badge font-Inter-400-12px d-flex-row-c-c text-color-white ${getContactColorClassNameByFirebaseId(
      contactID
    )}">
        ${getFirstTwoStringInitialsByFirebaseId(contactID)}
    </div>
    `;
}

function getTaskAssignedContactsRemainderTemplate(numberRemainder) {
  return `
  <div class="font-Inter-400-20px d-flex-row-c-c text-color-2A3647">
    +${numberRemainder}
  </div>
  `;
}

function getAddTaskFormTemplate(taskStatusId) {
  return `
  <form
    class="max-width-976px"
    onsubmit="requiredInputValidation('${taskStatusId}'); event.preventDefault() "
  >
    <div class="form-sub-wraps d-flex-sb gap-48px pd-b-24px">
      <div class="d-flex-column gap-16px width-100p">
        <div class="d-flex-column gap-8px height-96px">
          <label
            for="task-title"
            class="font-Inter-400-20px text-color-2A3647"
            >Title<span class="col-red">*</span></label
          >
          <input
            class="task-input-border task-input-text-field font-Inter-400-20px required"
            type="text"
            id="task-title"
            placeholder="Enter a title"
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
            class="task-input-border task-input-text-area font-Inter-400-20px"
            id="task-description"
            placeholder="Enter a Description"
          ></textarea>
        </div>
        <div class="d-flex-column gap-8px height-96px">
          <label for="task-due-date" class="input-label"
            >Due date<span class="col-red">*</span></label
          >
          <input
            class="task-input-border task-input-date font-Inter-400-20px required"
            type="date"
            min="${currentDate}"
            id="task-due-date"
            placeholder="dd/mm/yyyy"
          />
           <div class="d-none validation font-Inter-400-13px text-color-FF8190">This field is required!</div>
        </div>
        
      </div>

      <div class="separator"></div>

      <div class="d-flex-column gap-32px width-100p">
        <div class="d-flex-column gap-8px">
          <label class="font-Inter-400-20px text-color-2A3647"
            >Priority</label
          >
          <div class="d-flex gap-16px overlay-priority">
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
          ></div>
        </div>

        <div class="d-flex-column gap-8px p-relative height-96px" onclick="event.stopPropagation()">
          <label
            for="task-category"
            class="font-Inter-400-20px text-color-2A3647"
            >Category<span class="col-red">*</span></label
          >
          <input
            class="p-relative task-input-border task-input-category font-Inter-400-20px required"
            type="text"
            id="task-category"
            placeholder="Select task category"
            onclick="openTaskCategoryDropdown()"
            autocomplete="off"
          />
          <span
            class="p-absolute task-dropdown-icon"
            id="task-category-dropdown-icon"
          ></span>
          <div
            class="d-none p-absolute task-input-dropdown"
            id="task-category-dropdown"
          >
            <div
              class="task-category-option"
              onclick="setInputTagValue('task-category', this.innerHTML),closeTaskCategoryDropdown() "
            >
              Technical Task
            </div>
            <div
              class="task-category-option"
              onclick="setInputTagValue('task-category', this.innerHTML), closeTaskCategoryDropdown()"
            >
              User Story
            </div>
          </div>
           <div class="d-none validation font-Inter-400-13px text-color-FF8190">This field is required!</div>
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
            placeholder="Add new subtask"
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
          <ul class="tasks-subtask-list" id="tasks-subtasks-list"></ul>
        </div>
      </div>
    </div>

    <div class="d-flex-row-end-sb task-button-mobile">
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
  </form>
`;
}
