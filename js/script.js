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
      });
      document.getElementById("home").classList.add("hide");
      document.getElementById("username").innerHTML = `: ${username}`;
      document.getElementById("menu").classList.remove("hide");
      if (scores == 0) {
        document.getElementById("testAgain").classList.add("hide");
        document.getElementById("statistics").classList.add("hide");
      } else {
        document.getElementById("testNew").classList.add("hide");
      }
    })
} else {
  authCheck = false;
}
});

const loginButton = document.getElementById('loginButton');
const homeButton = document.getElementById('homeButton');
const loginTopButton = document.getElementById('loginTop');
const results = document.getElementById('results');
const linkStatistics = document.getElementById('linkStatistics');
const home = document.getElementById('home');
let grafico = false;

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
      console.log(user.email + ' signed out');
      location.reload();
    })
    .catch((error) => {
      console.log("Error: " + error);
    });
};

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
    dates = dates.slice(Math.max(dates.length - 15, 0));
    scores = scores.slice(Math.max(scores.length - 15, 0));
  }

  let data = {
    labels: dates,
    series: [scores],
  };
  
  var options = {
     
    height: '100%', 
    width: '100%',
    high: 10,
    axisX: {
      position: 'start',
      showGrid: false,
    },
    axisY: {
      onlyInteger: true,
    },
  };

  const chart = new Chartist.Bar('.ct-chart', data, options);
  chart.update();
}

// Eventos --------------------------------------------------------------------------------------------
loginButton.addEventListener("click", function() {
  console.log('test');
  signIn();
});

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

homeButton.addEventListener('click', function() {
  location.reload();
});

linkStatistics.addEventListener('click', function() {
  let statistics = document.getElementById("showStatistics");
  document.getElementById("menu").classList.add("hide");
  statistics.classList.remove("hide");
  grafico = true;
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      db.collection('usuarios')
        .get()
        .then(querySnapshot => {
          let id;
          querySnapshot.forEach(doc => {
            if (doc.data().email == user.email) {
              id = doc.id;
            }
          });
          createStats(id);
        })
    }
  }); 
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


//Resize
window.addEventListener("resize", function () {
  if (grafico) {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        db.collection('usuarios')
          .get()
          .then(querySnapshot => {
            let id;
            querySnapshot.forEach(doc => {
              if (doc.data().email == user.email) {
                id = doc.id;
              }
            });
            createStats(id);
          })
      }
    }); 
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
