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

const provider = new firebase.auth.GoogleAuthProvider();
const auth = firebase.auth();
firebase.auth().onAuthStateChanged((user) => {
    if (!user) {
       window.location.href = "../home.html";
    }});

let scores = db.collection('scores');
let bodyTable = document.querySelector("tbody");
let docID = "5p46fjBYjwl1ckFsurFO";
const documentoRef = db.collection("scores").doc(docID);
documentoRef.get().then((doc) => {
  const scores = doc.data().scores;
  for (let i = 0; i < scores.length; i++) {
    let tr = `<tr>
                <td>${i+1}</td>
                <td>${scores[i].user}</td>
                <td>${scores[i].score}</td>
              </tr>`;
    bodyTable.innerHTML += tr;
  };
});


