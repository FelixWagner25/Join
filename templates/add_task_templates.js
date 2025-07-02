function getSubtaskListTemplate(subtaskText) {
  return `
        <li class="p-relative font-Inter-400-13px subtask-list-element"">
        ${subtaskText}
            <div class=" p-absolute d-flex-row-c-c gap-4px task-subtask-control-icon-wrap">
                <span class="task-edit-subtask-icon" onclick="${editSubtask()}"></span>
                <span class="separator-subtask-edit-delete-icons"></span>
                <span class="task-delete-subtask-icon" onclick="deleteSubtask(this)"></span>    
            </div>
        </li>
    `;
}
