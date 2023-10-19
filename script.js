
const firebaseConfig = {
  apiKey: "AIzaSyBI9SwSOMuFb1rO_tv7oaI26_TFJi8ugXo",
  authDomain: "quiz-f6e00.firebaseapp.com",
  projectId: "quiz-f6e00",
  storageBucket: "quiz-f6e00.appspot.com",
  messagingSenderId: "172246500008",
  appId: "1:172246500008:web:7f9cc8ba5f365d38ea389d"
};

firebase.initializeApp(firebaseConfig);// Inicializar app Firebase

const db = firebase.firestore();// db representa mi BBDD // Inicia Firestore

// Google Log In ------------------------------------------------------------------------------------
let loginButton = document.getElementById('loginButton');;
const provider = new firebase.auth.GoogleAuthProvider();
const auth = firebase.auth();
const users = db.collection('usuarios');
function signIn() {
  auth.signInWithPopup(provider)
     .then((result) => {
     const user = result.user;
     users.where('email', '==', user.email).get()
     .then((querySnapshot) => {
     if (querySnapshot.empty) {
          let usuario = {
               name: user.displayName,
               email: user.email,
               scores: [],
          }
          users.add(usuario)
          .then((docRef) => {
          console.log("Usuario agregado con ID: ", docRef.id);
          })
          .catch((error) => {
          console.error("Error al agregar el usuario: ", error);
          });
     }
     })
     .catch((error) => {
     console.error('Error al realizar la consulta:', error);
     });
     })
     .catch((error) => {
     console.error('Error al iniciar sesión:', error);
     });
};


// Cerrar sesión -------------------------------------------------------------------------------------
const signOut = () => {
  let user = firebase.auth().currentUser;
  firebase
    .auth()
    .signOut()
    .then(() => {
      console.log(user.email + 'signed out')
    })
    .catch((error) => {
      console.log("Error: " + error);
    });
};


// Eventos -------------------------------------------------------------------------------------------
loginButton.addEventListener("click", () => {
  signIn()
});

let loginTopButton = document.getElementById('loginTop');
loginTopButton.addEventListener("click", () => {
  if (authCheck == true) {
    Swal.fire({
      title: 'Do you want to sign out?',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      customClass: {
        title: 'signOutMessage'
      },
    }).then((result) => {
      if (result.isConfirmed) {
        signOut();
        Swal.fire('You signed out successfully!', '', 'success')
      } 
    })
    
  } else {
    signIn();
  }
});


// Gráfica --------------------------------------------------------------------------------------------
function createStats() {
  // fetch
  // String(new Date().getDate()).padStart(2, '0'); día actual
  // new Date().toLocaleString('default', { month: 'long' }); mes actual

  let dates = ['10 - Oct', '11 - Oct', '12 - Oct', '13 - Oct', '14 - Oct'];
  let scores = [4, 6, 9, 2, 5];

  let data = {
    labels: dates,
    series: [scores],
  };
  
  var options = {
    high: 10,
    height: 250,
    fullWidth: true,
    stretch: true,
    axisX: {
      position: 'start',
      showGrid: false,
      labelOffset: {
        x: 0,
        y: -10
      }
    },
    axisY: {
      onlyInteger: true,
      labelOffset: {
        x: 0,
        y: 5
      }
    },
    chartPadding: {
      top: 15,
      right: 25,
      bottom: 15,
      left: 0
    }
  };

  new Chartist.Bar('.ct-chart', data, options);
}

let home = document.getElementById('home');

function userHome() {
  home.innerHTML = `<article id="info">
  <h1>Welcome NAME</h1>
  <p>Ready to try again?</p>
  <button id="start"><a href="./pages/quiz">Start</a></button>
  <p>Check out your last scores!</p>
  <div id="chartBox">
  <div class="ct-chart ct-perfect-fourth"></div>
  </div>
  </article>`
  createStats();
}

function defaultHome() {
  home.innerHTML =`<article id="info">
  <h1>Welcome!</h1>
  <p>Test your knowledge on this 10 history questions quiz!</p>
  <p>Log in to get started!</p>
  </article>
  <article id="login">
  <button id="loginButton">Log In</button>
  </article>`
}

// Auth state observers
let authCheck = false;
firebase.auth().onAuthStateChanged((user) => {
if (user) {
  authCheck = true;
  setHome();
} else {
  authCheck = false;
  defaultHome();
}
});

async function getQuizQuestions() {
  let questions = await fetch("https://opentdb.com/api.php?amount=10&category=23&difficulty=easy&type=multiple")
  questions = await questions.json();
  return questions;
}


// Crear/guardar usuario con base de datos

/* // Función para agregar usuario creado a la base de datos
const createUser = (user) => {
  db.collection("users").add(user);
};

// Registrar usuario
const signUpUser = (email, password) => {
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      let user = userCredential.user;
      createUser({
        id: user.id,
        email: user.email,
      });
    })
    .catch((error) => {
      let errorCode = error.code;
      let errorMessage = error.message;
      alert("Error en el sistema" + error.message);
    });
};

// Login de usuario
const signInUser = (email, password) => {
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      let user = userCredential.user;
    })
    .catch((error) => {
      let errorCode = error.code;
      let errorMessage = error.message;
      alert("Error en el sistema" + error.message);
    });
};

// Sign Out
const signOut = () => {
  let user = firebase.auth().currentUser;
  firebase
    .auth()
    .signOut()
    .then(() => {
      alert("Has salido del sistema exitosamente.");
    })
    .catch((error) => {
      console.log("hubo un error: " + error);
    });
}; */

// Funciones

// Eventos


/* let loginSection = document.getElementById("login");
let loginPop = `<div id="loginPopUp">
                <form action="#" id="logInForm">
                <label for="email">Email: </label>
                <input type="email" name="email" id="email">
                <label for="password">Password: </label>
                <input type="text" name="password" id="password">
                <input type="submit" value="Submit">
                </form>
                </div>`; */
