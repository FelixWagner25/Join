let allTasks = {};

async function initBoard() {
  await loadContacts();
  await loadTasks();
  renderBoard();
}

async function getTasksArray() {
  let tasks = await getDataBaseElement("tasks");
  let tasksArray = [];
  tasksArray = Object.entries(tasks);
  return tasksArray;
}

async function loadTasks() {
  try {
    const response = await fetch(
      "https://join-461-default-rtdb.europe-west1.firebasedatabase.app/tasks.json"
    );
    allTasks = (await response.json()) || {};
  } catch (error) {
    console.error("Error loading tasks:", error);
    allTasks = {};
  }
}

function renderBoard() {
  const columns = {
    todo: "to-do",
    "in-progress": "in-progress",
    "await-feedback": "await-feedback",
    done: "done",
  };

  const tasksPerColumn = {
    todo: [],
    "in-progress": [],
    "await-feedback": [],
    done: [],
  };

  for (const taskId in allTasks) {
    const task = allTasks[taskId];
    const status = task.status || "todo";
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
      tasks.forEach((task) => {
        const taskCard = createTaskCard(task);
        column.appendChild(taskCard);
      });
    }
  }
}

function clearBoard() {
  const columns = ["to-do", "in-progress", "await-feedback", "done"];
  columns.forEach((columnId) => {
    const column = document.getElementById(columnId);
    const taskCards = column.querySelectorAll(".board-card");
    taskCards.forEach((card) => card.remove());
  });
}

function showNoTaskFeedback(column) {
  const feedback = column.querySelector(".no-task-feedback");
  if (feedback) {
    feedback.style.display = "flex";
  }
}

function hideNoTaskFeedback(column) {
  const feedback = column.querySelector(".no-task-feedback");
  if (feedback) {
    feedback.style.display = "none";
  }
}

function createTaskCard(task) {
  const cardDiv = document.createElement("div");
  cardDiv.classList.add("board-card-wrap");
  cardDiv.setAttribute("data-task-id", task.id);

  const categoryClass = getCategoryClass(task.category);
  const categoryText = getCategoryText(task.category);
  const description = task.description || "No description provided";
  const subtasksInfo = getSubtasksInfo(task.subtasks);
  const assignedUsers = renderAssignedUsers(task.assignedTo);
  const priorityIcon = getPriorityIcon(task.priority);

  cardDiv.innerHTML = `
        <div class="board-card d-flex-column">
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

  cardDiv.addEventListener("click", () => openTaskOverlay(task));

  return cardDiv;
}

function getSubtasksInfo(subtasks) {
  if (!subtasks || subtasks.length === 0) {
    return { html: "", completed: 0, total: 0 };
  }

  const total = subtasks.length;
  const completed = 0;
  const progressPercent = total > 0 ? (completed / total) * 100 : 0;

  const html = `
        <div class="progress d-flex-row-c-c">
            <div class="progress-bar d-flex">
                <div class="progress-bar-status" style="width: ${progressPercent}%" aria-min-value="0" aria-max-value="100" aria-valuenow="${progressPercent}"></div>
            </div>
            <span class="status-subtasks">${completed}/${total} Subtasks</span>
        </div>
    `;

  return { html, completed, total };
}

function getSimpleColor(index) {
  const colors = ["#2a3647", "#ff7a00", "#1abc9c", "#3498db"];
  return colors[index % colors.length];
}

function renderAssignedUsers(assignedTo) {
  if (!assignedTo || assignedTo.length === 0) return "";

  return assignedTo
    .map((contact, index) => {
      const initials = getInitials(contact.name);
      const backgroundColor = getSimpleColor(index);

      return `<div class="users-icon" style="background-color: ${backgroundColor}">
                  ${initials}
                </div>`;
    })
    .join("");
}

function getInitials(name) {
  if (!name) return "NN";

  const parts = name.trim().split(" ");
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }

  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function getCategoryClass(category) {
  if (category === "technical-task") {
    return "technical-task";
  }
  return "user-story";
}

function getCategoryText(category) {
  if (category === "technical-task") {
    return "Technical Task";
  }
  return "User Story";
}

function getPriorityIcon(priority) {
  switch (priority) {
    case "urgent":
      return "/assets/icons/urgent.svg";
    case "medium":
      return "/assets/icons/medium.svg";
    case "low":
      return "/assets/icons/low.svg";
    default:
      return "/assets/icons/medium.svg";
  }
}

function addTechnicalTaskStyles() {
  const style = document.createElement("style");
  style.textContent = `
        .board-card-user-story-label.technical-task {
            background-color: #1abc9c !important;
        }
    `;
  document.head.appendChild(style);
}

function openTaskOverlay(task) {
  const overlay = document.getElementById("task-overlay");
  const detailContainer = document.getElementById("task-detail-view");

  detailContainer.innerHTML = `
    <h2>${task.title}</h2>
    <p>Description: ${task.description}</p>
    <p>Due Date: ${task.dueDate || "No date set"}</p>
    <p>Priority: ${task.priority}</p>
    <p>Category: ${task.category}</p>
    <div class="assigned-users">
      ${renderAssignedUsers(task.assignedTo)}
    </div>
    <button onclick="openTaskEdit(${JSON.stringify(task).replace(
      /"/g,
      "&quot;"
    )})" class="btn btn-edit">Edit</button>
  `;

  overlay.classList.remove("hidden");
}

function closeOverlay() {
  document.getElementById("task-overlay").classList.add("hidden");
}

function openTaskEdit(task) {
  const detailContainer = document.getElementById("task-detail-view");

  detailContainer.innerHTML = `
    <h2>Edit Task</h2>
    <label>Title</label>
    <input type="text" id="edit-title" value="${task.title}" />

    <label>Description</label>
    <textarea id="edit-description">${task.description || ""}</textarea>

    <label>Due Date</label>
    <input type="date" id="edit-date" value="${task.dueDate || ""}" />

    <label>Priority</label>
    <select id="edit-priority">
      <option value="urgent" ${
        task.priority === "urgent" ? "selected" : ""
      }>Urgent</option>
      <option value="medium" ${
        task.priority === "medium" ? "selected" : ""
      }>Medium</option>
      <option value="low" ${
        task.priority === "low" ? "selected" : ""
      }>Low</option>
    </select>

    <label>Category</label>
    <input type="text" id="edit-category" value="${task.category}" />

    <button onclick="saveTaskEdit('${task.id}')">Save Changes</button>
  `;
}

async function saveTaskEdit(taskId) {
  const updatedTask = {
    title: document.getElementById("edit-title").value,
    description: document.getElementById("edit-description").value,
    dueDate: document.getElementById("edit-date").value,
    priority: document.getElementById("edit-priority").value,
    category: document.getElementById("edit-category").value,
  };

  await fetch(
    `https://join-461-default-rtdb.europe-west1.firebasedatabase.app/tasks/${taskId}.json`,
    {
      method: "PATCH",
      body: JSON.stringify(updatedTask),
    }
  );

  await loadTasks();
  clearBoard();
  renderBoard();
  closeOverlay();
}
