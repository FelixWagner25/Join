function getBoardCardTemplate(indexTask) {
  return `
    <div class="board-card-wrap">
          <div class="board-card d-flex-column">
            <div class="board-card-user-story-label d-flex-row-c-c ${tasksArray[indexTask].category}">${categoryText}</div>
            <div class="board-card-content d-flex">
                <h2 class="task-headline">${task.title}</h2>
                <div class="card-text-area">${description}</div>
                ${subtasksInfo.html}
                <div class="users-wrap">
                    <div class="users-icon-container d-flex">
                        ${assignedUsers}
                    </div>
                    <img src="${priorityIcon}" alt="${task.priority} priority">
                </div>
            </div>
        </div>
        <div class="progress d-flex-row-c-c">
            <div class="progress-bar d-flex">
                <div class="progress-bar-status" style="width: ${progressPercent}%" aria-min-value="0" aria-max-value="100" aria-valuenow="${progressPercent}"></div>
            </div>
            <span class="status-subtasks">${completed}/${total} Subtasks</span>
        </div>    
    </div>
    `;
}
