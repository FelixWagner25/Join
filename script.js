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
 * Function to validate users credentials after submit
 * 
 * @param {object} event event-object to stop page-reload after submit
 */
function signupFormValidation(event) {
    event.preventDefault();
    let userInput = document.getElementsByTagName('input')
    let mail = document.getElementById('email')
    if (userInput[2].value === userInput[3].value &&
      mail.value.includes('.'))
      /* checkbox validation */
     {
      console.log("alles richtig");
      getNewUserInformation()
    } else {
      /* alert if validation is faulty  */
    console.log("etwas falsch");
  }
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