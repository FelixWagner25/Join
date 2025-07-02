function getSubtaskListTemplate(subtaskId, subtaskText) {
  return `
        <li id="task-subtask-${subtaskId}" class="p-relative font-Inter-400-13px subtask-list-element"">
        ${subtaskText}
            <div class=" p-absolute d-flex-row-c-c gap-4px task-subtask-control-icon-wrap">
                <span class="task-edit-subtask-icon" onclick="${editSubtask()}"></span>
                <span class="separator-subtask-edit-delete-icons"></span>
                <span class="task-delete-subtask-icon" onclick="deleteSubtask(
                  ${subtaskId}
                )"></span>    
            </div>
        </li>
    `;
}
