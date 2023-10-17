async function getQuizQuestions() {
    let questions = await fetch("https://opentdb.com/api.php?amount=10&category=23&difficulty=easy&type=multiple")
    questions = await questions.json();
    return questions;
}   
