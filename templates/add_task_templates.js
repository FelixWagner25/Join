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
    <div class="d-flex-c-sb pd-8px-16px task-assigned-contact-wrap" id="task-assigned-contact-wrap-${contactID}" onclick="toggleAssignContact('${contactID}')">
        <div class="d-flex-row-c-fs gap-16px">
            <div class="profile-badge font-Inter-400-12px d-flex-row-c-c text-color-white ${getContactColorClassNameByFirebaseId(
         contactID
            )}">
                ${getFirstTwoStringInitialsByFirebaseId(
                  contactID
                )}
            </div>
            ${contactsArray[indexContact][1].name}
        </div>
        <span class="task-assigned-contacts-checkbox-icon"></span>
    </div>
    `;
}

function getTaskAssignedContactBadgeTemplate(contactID, indexContact) {
  return `
    <div class="profile-badge font-Inter-400-12px d-flex-row-c-c text-color-white ${getContactColorClassNameByFirebaseId(
         contactID
            )}">
                ${getFirstTwoStringInitialsByFirebaseId(
                  contactID
                )}
    </div>
    `;
}
