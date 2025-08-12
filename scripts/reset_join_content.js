let initialContacts = [];

async function resetJoinContent() {
  await deleteDataBaseElements();
  await submitInitialContacts();
  await submitInitialTasks();
   showToastMessage("reset-join-msg")
 }

async function resetContacts() {
  await deleteDataBaseElements();
  /* await submitInitialContacts(); */
}

async function deleteDataBaseElements() {
  await deleteDataBaseElement("contacts");
  await deleteDataBaseElement("tasks");
  await deleteDataBaseElement("user");
}

async function submitInitialContacts() {
  for (let i = 0; i < initialContacts.length; i++) {
    submitObjectToDatabase("contacts", initialContacts[i]);
  }
}

function addInitalContact(name, email, phone) {
  initialContact = new InitialContact(name, email, phone);
  initialContacts.push(initialContact);
}

addInitalContact("Anja Schmidt", "schmidt@gmail.com", "49111111111");
addInitalContact("Markus Müller", "müller@t-online.de", "49222222222");
addInitalContact("Tanja Meyer", "meyer@web.de", "49333333333");
addInitalContact("Beate Krause", "krause@gmail.com", "49444444444");
addInitalContact("Thomas Schneider", "schneider@gmail.com", "49555555555");
addInitalContact("Sophie Hoffmann", "hoffmann@gmail.com", "49666666666");
addInitalContact("Lukas Becker", "becker@t-online.de", "49777777777");
addInitalContact("Axel Fischer", "fischer@gmail.com", "49888888888");
addInitalContact("Tim Weber", "weber@gmail.com", "49999999999");
addInitalContact("Theresa Koch", "koch@gmail.com", "49101010101");

async function submitInitialTasks() {
   let contactsRef =  await getDataBaseElement("contacts");
   let contactsObj = Object.entries(contactsRef)
  taskNew("technical-task","put here Description", "2025-12-12", "low", "todo","First Test Task",[{"Id":contactsObj[1][0], "name": contactsObj[1][1].name}], [{"name":"subtask1", "done": true},{"name":"subtask2", "done": false}])
  taskNew("technical-task","responsive Reset SE?", "2025-11-12", "medium", "todo","Reset responsive iPhone SE?",[{"Id":contactsObj[2][0], "name": contactsObj[2][1].name},{"Id":contactsObj[3][0], "name": contactsObj[3][1].name}], [{"name":"subtask1", "done": true},{"name":"subtask2", "done": false}])
  taskNew("user-story","", "2025-02-12", "urgent", "inprogress","call Boss",[], [{"name":"call Boss", "done": false},{"name":"cry", "done": false}])
  taskNew("user-story","please add AssignedTo", "2025-08-20", "urgent", "awaitfeedback","finish Reset-Function",[{"Id":contactsObj[3][0], "name": contactsObj[3][1].name}], [{"name":"subtask1", "done": true},{"name":"subtask2", "done": true}])
  taskNew("technical-task","", "2025-10-12", "urgent", "inprogress","El Pollo Loco!",[{"Id":contactsObj[6][0], "name": contactsObj[6][1].name}], [])
}

function taskNew(category, description, dueDate, priority, status, title,assignedTo, subtasks) {
  new Task(category, description, dueDate, priority, status, title,assignedTo, subtasks)
}