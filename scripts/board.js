let allTasks = {};
let allContacts = {};


async function init() {
    await loadContacts();
    await loadTasks();
    renderBoard();
}

async function loadContacts() {
    try {
        const response = await fetch('https://join-461-default-rtdb.europe-west1.firebasedatabase.app/contacts.json');
        allContacts = await response.json() || {};
    } catch (error) {
        console.error('Error loading contacts:', error);
        allContacts = {};
    }
}

async function loadTasks() {
    try {
        const response = await fetch('https://join-461-default-rtdb.europe-west1.firebasedatabase.app/tasks.json');
        allTasks = await response.json() || {};
    } catch (error) {
        console.error('Error loading tasks:', error);
        allTasks = {};
    }
}

function renderBoard() {
    
    const columns = {
        'todo': 'to-do',
        'in-progress': 'in-progress', 
        'await-feedback': 'await-feedback',
        'done': 'done'
    };
    
    const tasksPerColumn = {
        'todo': [],
        'in-progress': [],
        'await-feedback': [],
        'done': []
    };
    
    for (const taskId in allTasks) {
        const task = allTasks[taskId];
        const status = task.status || 'todo';
        if (tasksPerColumn[status]) {
            tasksPerColumn[status].push({ id: taskId, ...task });
        }
    }

    for (const status in columns) {
        const columnId = columns[status];
        const column = document.getElementById(columnId);
        const tasks = tasksPerColumn[status];
        
        if (tasks.length === 0) {
            showNoTaskFeedback(column);
        } else {
            hideNoTaskFeedback(column);
            tasks.forEach(task => {
                const taskCard = createTaskCard(task);
                column.appendChild(taskCard);
            });
        }
    }
}


function clearBoard() {
    const columns = ['to-do', 'in-progress', 'await-feedback', 'done'];
    columns.forEach(columnId => {
        const column = document.getElementById(columnId);
        const taskCards = column.querySelectorAll('.board-card');
        taskCards.forEach(card => card.remove());
    });
}


function showNoTaskFeedback(column) {
    const feedback = column.querySelector('.no-task-feedback');
    if (feedback) {
        feedback.style.display = 'flex';
    }
}


function hideNoTaskFeedback(column) {
    const feedback = column.querySelector('.no-task-feedback');
    if (feedback) {
        feedback.style.display = 'none';
    }
}

function createTaskCard(task) {
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('board-card');
    cardDiv.setAttribute('data-task-id', task.id);
    
    const categoryClass = getCategoryClass(task.category);
    const categoryText = getCategoryText(task.category);
    const description = task.description || 'No description provided';
    const subtasksInfo = getSubtasksInfo(task.subtasks);
    const assignedUsers = renderAssignedUsers(task.assignedTo);
    const priorityIcon = getPriorityIcon(task.priority);
    
    cardDiv.innerHTML = `
        <div class="board-card-wrap d-flex">
            <div class="board-card-user-story-label d-flex-row-c-c ${categoryClass}">${categoryText}</div>
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
    `;
    
    return cardDiv;
}

function getCategoryClass(category) {
    if (category === 'technical-task') {
        return 'technical-task';
    }
    return 'user-story'; 
}

function getCategoryText(category) {
    if (category === 'technical-task') {
        return 'Technical Task';
    }
    return 'User Story';
}