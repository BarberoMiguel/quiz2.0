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

if (document.title == "Home") {
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
}


if (document.title == "Question") {
    const provider = new firebase.auth.GoogleAuthProvider();
    const auth = firebase.auth();
    firebase.auth().onAuthStateChanged((user) => {
        if (!user) {
        window.location.href = "./home.html";
        }});

    let answers = [];
    let numberOfQuestions = 10;

    async function getQuizQuestions() {
        let questions = await fetch(`https://opentdb.com/api.php?amount=${numberOfQuestions}&category=23&difficulty=easy&type=multiple`)
        questions = await questions.json();
        questions = questions.results;
        return questions;
    }

    function mezclarArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1)); 
            [array[i], array[j]] = [array[j], array[i]]; 
        }
    }

    let questions;
    async function drawQuestions() {
        questions = await getQuizQuestions();
        for (let i = 0; i < numberOfQuestions; i++) {
            document.getElementById(`label${i+1}`).innerHTML = questions[i].question;
            let array = questions[i].incorrect_answers;
            array.push(questions[i].correct_answer);
            answers.push(questions[i].correct_answer);
            mezclarArray(array);
            for (let j = 0; j < array.length; j++) {
                document.getElementById(`${i+1}ans0${j+1}`).innerHTML = array[j];
                document.getElementById(`${i+1}ans${j+1}`).value = array[j];
            }
        } 
    }

    function bubbleSort(inputArr) {
        let len = inputArr.length;
        let swaped;
        for (let i = 0; i < len; i++) {
            swaped = false;
            for (let j = 0; j < len-i-1; j++) {
                if (inputArr[j].score < inputArr[j + 1].score) {
                    let tmp = inputArr[j];
                    inputArr[j] = inputArr[j + 1];
                    inputArr[j + 1] = tmp;
                    swaped = true;
                }
            }
            if (!swaped) {
                break;
            }
        }
        return inputArr;
    };

    //pintar los contenedores de las preguntas en el DOM
    let formulario = document.getElementById("formulario");
    for (let i = 1; i <= numberOfQuestions; i++) {
        let section = `<section id="pregunta${i}" class="container hide">
                            <h1 id="label${i}"></h1>
                            <section class="labels">`;
        for (let j = 1; j <= 4; j++) {
            section += `<label for="${i}ans${j}" id="${i}ans0${j}" class="color${j}"></label>
                        <input class="hide" type="radio" name="${i}ans" id="${i}ans${j}">`;
        }
        section += `</section>
                </section>`;
        formulario.innerHTML += section;
    }
    formulario.innerHTML += `<section class="hide container" id="pregunta${numberOfQuestions+1}">
                                <h1>For submiting your answers you must answer all the questions:</h2>
                                <button type="submit" class="navigation">Submit</button>
                            </section>`;
    document.getElementById("pregunta1").classList.toggle("hide");

    //pintar las preguntas en el DOM
    drawQuestions();
    let index = 1;

    //iniciar los botones next y previus
    let previous = document.getElementById("previous");
    let next = document.getElementById("next");
    previous.disabled = true;
    next.addEventListener("click", function() {
        index += 1;
        document.getElementById(`pregunta${index-1}`).style.animation = "salirIzquierda 1s ease-in-out";
        setTimeout(function() {
            document.getElementById(`pregunta${index-1}`).classList.add("hide");
            document.getElementById(`pregunta${index}`).style.animation = "entrarDerecha 1s ease-in-out";
            document.getElementById(`pregunta${index}`).classList.remove("hide");
        }, 750);
        switch (index) {
            case 2: 
                previous.disabled = false;
                break;
            case numberOfQuestions +1:
                next.disabled = true;
                break;
        }
    });
    previous.addEventListener("click", function() {
        index -= 1;
        document.getElementById(`pregunta${index+1}`).style.animation = "salirDerecha 1s ease-in-out";
        setTimeout(function() {
            document.getElementById(`pregunta${index+1}`).classList.toggle("hide");
            document.getElementById(`pregunta${index}`).style.animation = "entrarIzquierda 2s ease-in-out";
            document.getElementById(`pregunta${index}`).classList.toggle("hide");
        }, 750);
        switch (index) {
            case 1: 
            previous.disabled = true;
            break;
        case numberOfQuestions:
            next.disabled = false;
            break;
        }
    });

    //seleccionar una opción al pulsar un label
    for (let i = 1; i <= 10; i++) {
        for (let j = 1; j <= 4; j++) {
            document.getElementById(`${i}ans0${j}`).addEventListener("click", function() {
                for (let k = 1; k <= 4; k++) {
                    document.getElementById(`${i}ans${k}`).checked = false;
                    if (!document.getElementById(`${i}ans0${k}`).classList.contains(`color${k}`)) {
                        document.getElementById(`${i}ans0${k}`).classList.toggle(`color${k}`);
                        document.getElementById(`${i}ans0${k}`).classList.toggle(`colorselected`);
                    }
                }
                document.getElementById(`${i}ans${j}`).checked = true;
                document.getElementById(`${i}ans0${j}`).classList.toggle(`color${j}`);
                document.getElementById(`${i}ans0${j}`).classList.toggle(`colorselected`);
            })
        }
    }

    let score = 0;
    //validar el formulario
    let submit = document.getElementById("formulario");
    submit.addEventListener("submit", function(event) {
        event.preventDefault();
        let respuestas = [];
        for (let i = 0; i < numberOfQuestions*4; i++) {
            if (event.target[i].checked) {
                respuestas.push(event.target[i].value);
            };
        };
        if (respuestas.length < numberOfQuestions) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'You have to answer all questions!',
            })
        } else {
            for (let i = 0; i < numberOfQuestions; i++) {
                if (respuestas[i] == answers[i]) {
                    score += 1;
                } 
            }
            //mostrar la página final
            document.querySelector(".resultado").classList.toggle("hide");
            document.getElementById("pregunta11").classList.toggle("hide");
            document.querySelector("aside").classList.toggle("hide");

            //guardar datos
            let usuario;
            let email;
            firebase.auth().onAuthStateChanged((user) => {
                usuario = user.displayName;
                email = user.email;
                document.getElementById("usuario").innerHTML = ` ${usuario}`;
                let puntuacion =  {user: usuario, score: 10*score/numberOfQuestions};
                const fecha = new Date();
                let puntuacion1 = {date: `${fecha.getDate()}/${fecha.getMonth() + 1}/${fecha.getFullYear()}`, score: 10*score/numberOfQuestions};
                db.collection('usuarios').where('email', '==', email)
                    .get().then(user1 => {
                    user1.forEach((doc) => {
                        let docID = doc.id;
                        let scoreData = doc.data().scores;
                        if (scoreData == "") {
                            scoreData = [puntuacion1]
                        } else {
                            scoreData.push(puntuacion1);
                        };
                        const userFound = db.collection('usuarios').doc(docID);
                        userFound.update({
                            scores: scoreData
                        });
                    });
                })
                .catch((error) => {
                    console.error('Error al buscar usuarios:', error);
                    });
                db.collection("scores").get().then((data) => {
                    data.forEach((doc) => {
                        let scoresID = doc.id;
                        let scoresData = doc.data().scores;
                        scoresData.push(puntuacion);
                        scoresData = bubbleSort(scoresData);
                        const scoresFound = db.collection('scores').doc(scoresID);
                            scoresFound.update({
                                scores: scoresData
                            });
                        });
                })
                .catch((error) => {
                    console.error('Error al buscar scores:', error) });
            });

            //mostrar datos personalizados
            document.getElementById("score").innerHTML = `${score} / ${numberOfQuestions}`;
            let text = document.querySelector(".resultado p");
            let imageUrl = document.getElementById("resultado");
            if (score/numberOfQuestions == 1) {
                text.innerHTML = "Perfect Score!!";
                imageUrl.src = "../assets/gifs/10.gif";
            } else if (score/numberOfQuestions >= 0.7) {
                text.innerHTML = "Great score!!";
                imageUrl.src = "../assets/gifs/7-9.gif";
            } else if (score/numberOfQuestions >= 0.5) {
                text.innerHTML = "Well done!! You'll do better next Time!";
                imageUrl.src = "../assets/gifs/5-6.gif";
            } else {
                text.innerHTML = "Looks like you should study more";
                imageUrl.src = "../assets/gifs/0-4.gif";
            }
            for (let i = 0; i < questions.length; i++) {
                let color;
                if (questions[i].correct_answer == respuestas[i]) {
                    color = "color3";
                } else {
                    color = "color1"
                }
                document.getElementById("correctResults").innerHTML += `
                <tr class=${color}>
                    <td class="questionTable">${questions[i].question}</td>
                    <td>${respuestas[i]}</td>
                    <td>${questions[i].correct_answer}</td>
                </tr>`;
                
            }
        }
    })
};


if (document.title == "Results") {
    const provider = new firebase.auth.GoogleAuthProvider();
    const auth = firebase.auth();
    firebase.auth().onAuthStateChanged((user) => {
        if (!user) {
        window.location.href = "./home.html";
        }});

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


    // Cerrar sesión -------------------------------------------------------------------------------------
    let loginTopButton = document.getElementById('loginTop');

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

    loginTopButton.addEventListener("click", () => {
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
            Swal.fire('You signed out successfully!', '', 'success')
        } 
        })
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
}