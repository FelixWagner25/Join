const database = 'https://join-461-default-rtdb.europe-west1.firebasedatabase.app/'

/**
 * Function to log in as guest
 *
 */
function guestLogin() {
  location.href = "/templates/desktop_template.html";
}

/**
 * Function to forward user to signup page
 *
 */
function signupPage() {
  location.href = "assets/html/signup.html";
}

function stopEventPropagation(event) {
  event.stopPropagation();
}


/**
 * Function to force user to accept Privacy Policy
 * 
 */
function checkInput() {
    let checkbox = document.getElementById('accept-policy')
    let button = document.querySelector('.signup-btn')
if (!checkbox.checked){
  	button.setAttribute('disabled', 'true')
} else {
  button.removeAttribute('disabled')
}
}


/**
 * Function to validate users credentials after submit
 * 
 * @param {object} event event-object to stop page-reload after submit
 */
function signupFormValidation(event) {
    event.preventDefault();
    let userInput = document.getElementsByTagName('input')
    let mail = document.getElementById('email')
    let checkbox = document.getElementById('accept-policy')
    let passwordError = document.getElementById('password-error')
    let mailError = document.getElementById('email-error')
    const regex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
    if (userInput[2].value !== userInput[3].value){
      passwordError.classList.remove('d-none')
    } else 
    if (!regex.test(mail.value)){
      mailError.classList.remove('d-none')}
      else if (checkbox.checked){
      getNewUserInformation()
      }
      /* preventDefault nur nutzen, wenn Validierungsfehler */
}

/**
 * Function to create JSON-object
 * 
 */
function getNewUserInformation(){
  let userInput = document.getElementsByTagName('input')
  let userCredential = {}
  for (let index = 0; index < userInput.length; index++) {
      let key = userInput[index].name
      let value = userInput[index].value
      userCredential[key] = value;
  }
  console.log(userCredential);
}

/**
 * Function to send JSON to firebase-server
 * 
 * @param {*} path storage path on firebase-server
 * @param {JSON} data user-credentials as JSON
 */
async function submitNewUser(path="" , data={}) {
  let response = await fetch(database + path + ".json",
    {
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body: JSON.stringify(data)
    }
   );

  
}