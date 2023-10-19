// Google sign in
/* <div id="g_id_onload"
     data-client_id="858801986512-q7fr89ncr3cirmbklgj16m96hfmrphsb.apps.googleusercontent.com"
     data-context="signin"
     data-ux_mode="popup"
     data-callback="signInWithGoogle"
     data-auto_prompt="false">
</div>

<div class="g_id_signin"
     data-type="standard"
     data-shape="rectangular"
     data-theme="outline"
     data-text="signin_with"
     data-size="large"
     data-logo_alignment="left">
</div> */

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

const googleSignInButton = document.getElementById("google-sign-in-button");

googleSignInButton.addEventListener("click", () => {
     const provider = new firebase.auth.GoogleAuthProvider();
     const auth = firebase.auth();
     auth.signInWithPopup(provider)
     .then((result) => {
     const user = result.user;
     
     
     })
     .catch((error) => {
     const errorCode = error.code;
     const errorMessage = error.message;
     // Más manejo de errores
     });
});




