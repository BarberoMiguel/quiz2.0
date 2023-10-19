const firebaseConfig = {
  apiKey: "AIzaSyBI9SwSOMuFb1rO_tv7oaI26_TFJi8ugXo",
  authDomain: "quiz-f6e00.firebaseapp.com",
  projectId: "quiz-f6e00",
  storageBucket: "quiz-f6e00.appspot.com",
  messagingSenderId: "172246500008",
  appId: "1:172246500008:web:7f9cc8ba5f365d38ea389d"
};

firebase.initializeApp(firebaseConfig);// Inicializaar app Firebase

const db = firebase.firestore();// db representa mi BBDD //inicia Firestore

const googleSignInButton = document.getElementById("loginButton");

const provider = new firebase.auth.GoogleAuthProvider();
const auth = firebase.auth();
const users = db.collection('usuarios');
googleSignInButton.addEventListener("click", () => {
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
});

/* let data = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
  series: [[5, 2, 4, 2, 0]],
};

var options = {
  height: 200,
  fullWidth: true,
};

new Chartist.Line(".ct-chart", data, options);
 */


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


let loginSection = document.getElementById("login");
let loginButton = document.getElementById('loginButton');
let loginTopButton = document.getElementById('loginTop');
let loginPop = `<div id="loginPopUp">
                <form action="#" id="logInForm">
                <label for="email">Email: </label>
                <input type="email" name="email" id="email">
                <label for="password">Password: </label>
                <input type="text" name="password" id="password">
                <input type="submit" value="Submit">
                </form>
                </div>`;


loginTopButton.addEventListener("click", () => {
  loginSection.innerHTML += loginPop;
});
