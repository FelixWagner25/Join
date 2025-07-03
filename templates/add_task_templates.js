function getSubtaskListTemplate(indexSubtask) {
  return `
        <li id="task-subtask-${indexSubtask}" class="p-relative font-Inter-400-13px subtask-list-element">
        ${newTaskSubtasks[indexSubtask].name}
            <div class=" p-absolute d-flex-row-c-c gap-4px task-subtask-control-icon-wrap">
                <span class="task-edit-subtask-icon" onclick="editSubtask(${indexSubtask})"></span>
                <span class="separator-subtask-edit-delete-icons"></span>
                <span class="task-delete-subtask-icon" onclick="deleteSubtask(
                  ${indexSubtask}
                )"></span>    
            </div>
        </li>
    `;
}

function getEditSubtaskTemplate(indexSubtask) {
  return `
    <input type="text" class="p-relative font-Inter-400-13px subtask-list-element" value="${newTaskSubtasks[indexSubtask].name}"></input>
    `;
}
