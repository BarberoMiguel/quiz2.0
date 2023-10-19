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

