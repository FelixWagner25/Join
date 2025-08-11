let initialContacts = [];

async function resetJoinContent() {
  deleteAllUsers();
  resetContacts();
  submitInitialContacts();
  showToastMessage("reset-join-msg");
}

async function resetContacts() {
  await deleteAllContacts();
  await submitInitialContacts();
}

async function deleteAllContacts() {
  await deleteDataBaseElement("contacts");
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

async function deleteAllUsers() {
  await deleteDataBaseElement("user");
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
