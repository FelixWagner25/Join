function getBoardCardTemplate(indexTask) {
  return `
    <div class="task-card-wrap">
          <div class="task-card d-flex-column">
            <div class="task-category font-Inter-400-16px ${getTaskCategoryClass(
              tasksArray[indexTask][1].category
            )} d-flex-row-c-c">${tasksArray[indexTask][1].category}</div>
            <div class="task-description-wrap d-flex">
                <div class="task-headline font-Inter-700-16px">${
                  tasksArray[indexTask][1].title
                }</div>
                <div class="task-description font-Inter-400-16px">${
                  tasksArray[indexTask][1].description
                }</div>
                <div class="d-flex-c-sb">
                    <div class="d-flex" id="task-contacts">
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

function getTaskCardContactsTemplate(indexTask) {}
