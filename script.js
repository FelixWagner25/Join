const database =
  "https://join-461-default-rtdb.europe-west1.firebasedatabase.app/";

let contactsArray = [];
let tasksArray = [];
/**
 * Function to log in as guest
 *
 */
function guestLogin() {
  saveSession("Gast");
  location.href = "assets/html/summary.html";
}

/**
 * Function to forward user to signup page
 *
 */
function signupPage() {
  location.href = "assets/html/signup.html";
}

/**
 * This function prevents event propagation.
 *
 * @param {Event} event - event object to stop event propagation
 */
function stopEventPropagation(event) {
  event.stopPropagation();
}

/**
 * Function to check the state of all required input fields and the acceptance checkbox.
 *
 */
function checkInput() {
  let checkbox = document.getElementById("accept-policy");
  let requiredInputs = document.querySelectorAll("input");
  let button = document.querySelector(".signup-btn");
  if (
    [...requiredInputs].every((input) => input.value !== "") &&
    checkbox.checked
  ) {
    button.removeAttribute("disabled");
  } else {
    button.setAttribute("disabled", "true");
  }
}

/**
 * Function to reset error-messages on login & signup page
 *
 *
 */
function resetErrorMessage() {
  let error = document.getElementsByTagName("input");
  let message = document.getElementsByClassName("validation");
  [...error].forEach((element) => {
    element.parentElement.classList.remove("error-border");
  });
  [...message].forEach((message) => {
    message.classList.add("d-none");
  });
}

/**
 * Function to validate users credentials after button submit
 * Prevent if email format is invalid or passwords don't match
 *
 * @param {Event} event event-object to stop page-reload after submit
 */
function signupFormValidation(event) {
  event.preventDefault();
  if (!regexValidation()) {
    return;
  }
  let userInput = document.getElementsByTagName("input");
  if (userInput[2].value !== userInput[3].value) {
    showErrorMessage("password", []);
  } else {
    getNewUserInformation();
  }
}

function regexValidation() {
  const regexMail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  const regexPhone = /^\+?\d{8,}$/;
  let mail = document.querySelectorAll("input");
  let filteredMail = [...mail].filter((t) => t.type == "email");
  let filteredPhone = [...mail].filter((t) => t.type == "tel");
  let valid = true;
  if (!regexMail.test(filteredMail[0].value)) {
    showErrorMessage("email", []);
    valid = false;
  }
  if (filteredPhone[0]?.value && !regexPhone.test(filteredPhone[0].value)) {
    showErrorMessage("phone", []);
    valid = false;
  } else return valid;
}

/**
 * This functions adds error-messages, based on the errors-id
 *
 * @param {Parameters} field declares the specific error id
 * @param {Array} array fields to iterate, if available
 */
function showErrorMessage(field, array) {
  let errorRef = document.getElementById(`${field}-error`);
  errorRef.classList.remove("d-none");
  array?.forEach((input) => {
    input.parentElement.classList.add("error-border");
  });
  errorRef.previousElementSibling.classList.add("error-border");
}

/**
 * Function to trigger Password visible/unvisible for user
 *
 * @param {HTMLElement}  x the clicked Icon element
 */
function showPassword(x) {
  let password = x.previousElementSibling;
  if (password.type === "password" && password.value.length > 0) {
    password.type = "text";
    x.setAttribute("class", "pw-icon-on");
  } else {
    password.type = "password";
    x.setAttribute("class", "pw-icon");
  }
}

/**
 * Function to create JSON-object (signup - user credential), if checkMailRedundancy is false
 *
 */
function getNewUserInformation() {
  let userInput = document.getElementsByTagName("input");
  let userCredential = {};
  let key = "";
  let value = "";
  for (let index = 0; index < userInput.length; index++) {
    key = userInput[index].name;
    value = userInput[index].value;
    userCredential[key] = value;
  }
  checkMailRedundancy(userCredential);
}

/**
 * This function validates, if the mail during sign-up-process is already used in the database
 *
 * @param {object} credentials the sign-up credentials
 */
async function checkMailRedundancy(credentials) {
  let response = await fetch(database + "/user" + ".json");
  let responseRef = await response.json();
  let mails = getUsedMails(responseRef);
  if (responseRef === null) {
    postJSON("user", credentials);
    showMessage(credentials);
    return;
  }
  if (!mails.includes(credentials.email)) {
    postJSON("user", credentials);
    showMessage(credentials);
    return;
  }
  showErrorMessage("email-redundancy", []);
}

function getUsedMails(responseRef) {
  let mailValue = Object.values(responseRef);
  let newMail = mailValue.map((i) => {
    return i.email;
  });
  return newMail;
}

/**
 * This Function gives the User feedback, if signup was successful.
 * Also triggers to add a new contact
 *
 * @param {object} credentials object to
 */
function showMessage(credentials) {
  addNewContactOnSignup(credentials);
  let messageBox = document.querySelector(".signup-message");
  let blur = document.querySelector(".background-fade");
  let signup = document.querySelector(".signup");
  messageBox.classList.remove("d-none");
  messageBox.classList.add("d-flex-row-c-c");
  blur.style.backgroundColor = "rgb(0, 0, 0, 0.10)";
  signup.style.zIndex = "-1";
  setTimeout(() => {
    location.href = "/index.html";
  }, 1800);
}

/**
 * This function creates a contact-object from users signup and posts it into /contacts-path
 *
 * @param {object} contactData dedicated information for contact-list
 */
function addNewContactOnSignup(contactData) {
  let contactObj = {};
  contactObj = {
    email: contactData.email,
    name: contactData.name,
    phone: "",
  };
  postJSON("contacts", contactObj);
}

/**
 * Function to send JSON to firebase-server
 *
 * @param {*} path storage path on firebase-server
 * @param {JSON} data any object as JSON for database
 */
async function postJSON(path = "", data = {}) {
  let response = await fetch(database + path + ".json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

/**
 * This function gets all users-credentials from database and triggers credential-check-function
 *
 * @param {string} path path of the database
 */
async function userLogin(path = "user") {
  let response = await fetch(database + path + ".json", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  let responseRef = await response.json();
  checkLogInCredentials(responseRef);
}

/**
 * This function checks, if login-credentials are valid to credentials from database
 *
 * @param {object} responseRef all user credentials from the database
 */
async function checkLogInCredentials(responseRef) {
  let x = Object.values(responseRef);
  let loginInput = document.getElementsByTagName("input");
  let name = filterUserName(x, loginInput);
  let credentialsMerge = x.map((i) => {
    return i.email + i.password;
  });
  if (credentialsMerge.includes(loginInput[0].value + loginInput[1].value)) {
    location.href = "assets/html/summary.html";
    saveSession(name);
  } else {
    showErrorMessage("password", [...loginInput]);
  }
}

function filterUserName(x, loginInput) {
  let correctuser = x.filter((x) => x.email == loginInput[0].value);
  let user = correctuser.map((n) => n.name);
  return user;
}

function saveSession(name) {
  setSessionStorage("user", name[0]);
  setSessionStorage(
    "initials",
    name[0]
      .split(" ")
      .map((i) => i[0]?.toUpperCase())
      .join("")
  );
}

function setSessionStorage(key, value) {
  sessionStorage.setItem(key, value);
}

/**
 * Function to get database element from firebase server as JSON
 *
 * @param {string} path
 * @returns - database element as JSON
 */
async function getDataBaseElement(path = "") {
  let response = await fetch(database + path + ".json", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  let responseJSON = await response.json();
  return responseJSON;
}

async function submitObjectToDatabase(path = "", object = {}) {
  let response = await fetch(database + path + ".json", {
    method: "POST",
    header: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(object),
  });
}

async function updateDatabaseObject(path = "", object = {}) {
  let response = await fetch(database + path + ".json", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(object),
  });
}

/**
 * This function delets an element form firebase server and collects the response as JSON
 *
 * @param {string} path
 * @returns
 */
async function deleteDataBaseElement(path = "") {
  let response = await fetch(database + path + ".json", {
    method: "DELETE",
  });
  let responseJSON = await response.json();
  return responseJSON;
}

function getFirstTwoStringInitials(inputString) {
  let inputStringSplit = inputString.split(" ");
  let stringInitials = "";
  if (inputStringSplit.length == 1) {
    stringInitials = inputStringSplit[0].charAt(0).toUpperCase();
  } else {
    stringInitials =
      inputStringSplit[0].charAt(0).toUpperCase() +
      inputStringSplit[1].charAt(0).toUpperCase();
  }
  return stringInitials;
}

function getFirstTwoStringInitialsByFirebaseId(contactID) {
  let stringInitials = "";
  for (let elementID of contactsArray) {
    if (contactID === elementID[0]) {
      let inputStringSplit = elementID[1].name.split(" ");
      if (inputStringSplit.length == 1) {
        stringInitials = inputStringSplit[0].charAt(0).toUpperCase();
      } else {
        stringInitials =
          inputStringSplit[0].charAt(0).toUpperCase() +
          inputStringSplit[1].charAt(0).toUpperCase();
      }
    }
  }

  return stringInitials;
}

function clearInputTagValue(htmlId) {
  let inputRef = document.getElementById(htmlId);
  inputRef.value = "";
}

function getInputTagValue(htmlId) {
  return document.getElementById(htmlId).value;
}

function setInputTagValue(htmlId, valueToSet) {
  let inputRef = document.getElementById(htmlId);
  inputRef.value = valueToSet;
}
