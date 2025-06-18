function getBoardCardTemplate(indexTask) {
  return `
    <div class="board-card-wrap">
          <div class="board-card d-flex-column">
            <div class="board-card-user-story-label d-flex-row-c-c">${tasksArray[indexTask].category}</div>
            <div class="board-card-content d-flex">
                <h2 class="task-headline">${tasksArray[indexTask].title}</h2>
                <div class="card-text-area">${tasksArray[indexTask].description}</div>
                <div class="users-wrap">
                    <div class="users-icon-container d-flex">
                    </div>
                    <img src="" alt="${tasksArray[indexTask].priority} priority">
                </div>
            </div>
        </div> 
    </div>
    `;
}
