function getBoardCardTemplate(indexTask) {
  return `
    <div class="board-card-wrap">
          <div class="board-card d-flex-column">
            <div class="task-category ${getTaskCategoryClass(
              tasksArray[indexTask][1].category
            )} d-flex-row-c-c">${tasksArray[indexTask][1].category}</div>
            <div class="board-card-content d-flex">
                <div class="task-headline">${
                  tasksArray[indexTask][1].title
                }</div>
                <div class="task-description">${
                  tasksArray[indexTask][1].description
                }</div>
                <div class="users-wrap">
                    <div class="users-icon-container d-flex">
                    </div>
                    <img src=${getTaskPriorityIconSrc(
                      tasksArray[indexTask][1].priority
                    )} >
                </div>
            </div>
        </div> 
    </div>
    `;
}
