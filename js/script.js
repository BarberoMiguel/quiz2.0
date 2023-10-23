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

// Auth state observer -----------------------------------------------------------------------------------
let authCheck = false;

const loginTopButton = document.getElementById('loginTop');
const results = document.getElementById('results')
const home = document.getElementById('home');

// Google Log In ------------------------------------------------------------------------------------
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
      console.log(user.email + ' signed out')
    })
    .catch((error) => {
      console.log("Error: " + error);
    });
};

// Funciones -----------------------------------------------------------------------------------------

async function userHome(username, id) {
  home.innerHTML = `<article id="info" class="fadeIn">
  <h1>Welcome ${username}</h1>
  <p>Ready to try again?</p>
  <button id="start"><a href="./pages/question.html">Start</a></button>
  <p>Check out your last scores!</p>
  <div id="chartBox">
  <div class="ct-chart ct-perfect-fourth"></div>
  </div>
  </article>`
  createStats(id);
}

async function userHome_noScores(username) {
  home.innerHTML = `<article id="info" class="fadeIn">
  <h1>Welcome ${username}</h1>
  <p>Play for the first time!</p>
  <button id="start"><a href="./pages/question.html">Start</a></button>
  </article>`
}

async function defaultHome() {
  home.innerHTML =`<article id="info" class="fadeIn">
  <h1>Welcome!</h1>
  <p>Test your knowledge on this 10 history questions quiz!</p>
  <p>Log in to get started!</p>
  <button id="loginButton">Log In</button>
  </article>`
}

// Gráfica --------------------------------------------------------------------------------------------
let createStats = async function(id) {
  let dates = [];
  let scores = [];

  await db.collection('usuarios')
    .doc(id)
    .get()
    .then(doc => {
      let arr = doc.data().scores;
      for (i = 0; i < arr.length; i++) {
        dates.push(arr[i].date)
        scores.push(arr[i].score)
      }
    })

  if (window.innerWidth < 1024) {
    for (i = 0; i < dates.length; i++) {
      dates[i] = dates[i].slice(0, -5);
    }
    dates = dates.slice(Math.max(dates.length - 5, 0));
    scores = scores.slice(Math.max(scores.length - 5, 0));
  } else {
    dates = dates.slice(Math.max(dates.length - 7, 0));
    scores = scores.slice(Math.max(scores.length - 7, 0));
  }

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

// Eventos --------------------------------------------------------------------------------------------


loginTopButton.addEventListener("click", () => {
  if (authCheck == true) {
    Swal.fire({
      title: 'Do you want to sign out?',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      customClass: {
        title: 'sweetAlert'
      },
    }).then((result) => {
      if (result.isConfirmed) {
        signOut();
        Swal.fire({
          icon: 'success',
          title: 'You signed out successfully!',
          customClass: {
            title: 'sweetAlert'
          }
        })
      } 
    })
  } else {
    signIn();
  }
});

results.addEventListener('click', function(event) {
  if (authCheck == false) {
    event.preventDefault()
    Swal.fire({
      icon: 'error',
      title: 'You have to sign in first!',
      customClass: {
        title: 'sweetAlert'
      },
    })
  }
})


firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    authCheck = true;
    let username = user.displayName;
    db.collection('usuarios')
      .get()
      .then(querySnapshot => {
        let id;
        let scores;
        querySnapshot.forEach(doc => {
          if (doc.data().email == user.email) {
            id = doc.id;
            scores = doc.data().scores.length;
          }
        })
        if (scores == 0) {
          userHome_noScores(username);
        } else {
          userHome(username, id);
        }
      })
  } else {
    authCheck = false;
    defaultHome();
    const loginButton = document.getElementById('loginButton');
    loginButton.addEventListener("click", signIn);
  }
});

let mute = document.getElementById("muteButton");
let audio = document.getElementById("audio");
mute.addEventListener("click", function() {
  if (audio.muted) {
    audio.muted = false;
  } else {
    audio.muted = true;
  }
});

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