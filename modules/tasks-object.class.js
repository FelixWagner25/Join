class Task{

    assignedTo;
    category;
    description;
    dueDate;
    priority;
    status;
    title;
    assignedTo;
    subtasks;

    constructor(category, description, dueDate, priority, status, title,assignedTo, subtasks){
        this.category = category,
        this.description = description,
        this.dueDate = dueDate,
        this.priority = priority,
        this.status = status,
        this.title = title
        this.assignedTo = assignedTo
        this.subtasks = subtasks
        this.loadNewTask();
    }

    async loadNewTask() {
        let newTaskObj = {
        category: this.category,
        description: this.description,
        dueDate: this.dueDate,
        priority: this.priority,
        status: this.status,
        title: this.title,
        assignedTo: this.assignedTo,
        subtasks: this.subtasks
        };
        await submitObjectToDatabase("tasks", newTaskObj);
    }

     
}

