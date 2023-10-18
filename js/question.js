let answers = [];

async function getQuizQuestions() {
    let questions = await fetch("https://opentdb.com/api.php?amount=10&category=23&difficulty=easy&type=multiple")
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

async function drawQuestions() {
    let questions = await getQuizQuestions();
    for (let i = 0; i < 10; i++) {
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
        document.getElementById(`pregunta${index}`).classList.toggle("hide");
        document.getElementById(`pregunta${index-1}`).classList.toggle("hide");
        document.getElementById(`pregunta${index}`).style.animation = "entrarDerecha 1s ease-in-out";
    }, 750);
    switch (index) {
        case 2: 
            previous.disabled = false;
            break;
        case 11:
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
    case 10:
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
    for (let i = 0; i < 40; i++) {
        if (event.target[i].checked) {
            respuestas.push(event.target[i].value);
        };
    };
    if (respuestas.length < 10) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'You have to answer all questions!',
          })
    } else {
        for (let i = 0; i < 10; i++) {
            if (respuestas[i] == answers[i]) {
                score += 1;
            } 
        }
        document.getElementById("resultado").classList.toggle("hide");
        document.getElementById("pregunta11").classList.toggle("hide");
        document.querySelector("aside").classList.toggle("hide")
        document.getElementById("score").innerHTML = score;
    }
})
    
