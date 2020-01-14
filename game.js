const img = document.querySelector('img');
const input = document.querySelector('input');
const checkBtn = document.querySelector('.check');
const giveUpBtn = document.querySelector('.giveUp');
const questionCounterText = document.querySelector('.questionCounter');
const scoreText = document.querySelector('.currentScore');
const highScoresList = document.querySelector('.highScoresList');

let score = 0;
let questionCounter = 0;
let availableQuestions = [];
let currentQuestion = 0;

const MAX_QUESTIONS = 3;
const POINT_FOR_FLAG = 1;

const storageArray = JSON.parse(localStorage.getItem("scores")) || [];

let questions = [];

// let questions = [
//     {
//         name: 'Poland',
//         alpha3Code: 'POL',
//         flag: 'https://restcountries.eu/data/pol.svg',
//     },
//     {
//         name: 'Ukraine',
//         alpha3Code: 'UKR',
//         flag: 'https://restcountries.eu/data/ukr.svg',
//     },
//     {
//         name: 'Sri Lanka',
//         alpha3Code: 'LKA',
//         flag: 'https://restcountries.eu/data/lka.svg',
//     },
// ];

// CONNECTION WITH API
const API_URL = 'https://restcountries.eu/rest/v2/all?fields=name;flag;alpha3Code'
fetch(API_URL)
        .then(res => {
            return res.json()
        })
        .then(loadedQuestions => {
            questions = loadedQuestions;
            startGame();
        })
        .catch(err => {
            console.error(err);
        });


startGame = () => {
    availableQuestions = [...questions];
    getNewQuestion();
}

getNewQuestion = () => {
    // IF I COMPLETED QUIZ
  if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
    setStorageItems(score);
    alert(`Twój wynik to: ${score} Gratulacje!`)
    return window.location.assign("./start.html");
  } else {
    // DIDN'T FINISH QUIZ - PLACING FLAGS and stats ON DISPLAY
    questionCounter++;
    questionCounterText.innerText = `Country: ${questionCounter}/${MAX_QUESTIONS}`;
    scoreText.innerText = `Your score: ${score}`;
    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    img.setAttribute('src', currentQuestion.flag);
    availableQuestions.splice(questionIndex, 1);
  }
};

checkBtn.addEventListener('click', () => {
    const answer = input.value;

    if (/[A-Z]/.test(answer)) {

        if(answer.length < 3) {
            alert(`wprowadź 3 literowy ISO lub pełną nazwę kraju, chodziło o ${currentQuestion.name.toUpperCase()}, Twój wynik to ${score}, próbuj dalej`);
            setStorageItems(score);
            return window.location.assign("./start.html");
        } else if (answer.length >=3) {
            if (answer === currentQuestion.name.toUpperCase() || answer === currentQuestion.alpha3Code) {
                checkBtn.classList.add("correct");
                incrementScore(POINT_FOR_FLAG);
            } else {
                setStorageItems(score);
                alert(`niepoprawna odpowiedź, chodziło o ${currentQuestion.name.toUpperCase()}, Twój wynik to ${score}, próbuj dalej`);
                return window.location.assign("./start.html");
            }
        }
    } else {
        setStorageItems(score);
        alert(`używaj tylko dużych liter, przegrałeś! chodziło o ${currentQuestion.name.toUpperCase()}`);
        return window.location.assign("./start.html");
    }

    setTimeout(() => {
        checkBtn.classList.remove("correct");
        getNewQuestion();
    }, 500);
    input.value = "";
    // console.log(storageArray);
})

// startGame();

incrementScore = num => {
    score += num;
}

// STORAGE HANDLER
setStorageItems = (score) => {
    storageArray.push(score);
    storageArray.sort((a, b) => b - a);
    localStorage.setItem("scores", JSON.stringify(storageArray));
}

getValueFromStorage = () => {
     for (i = 0; i < 3; i++) {
            const newScore = document.createElement('li');
            newScore.classList.add('score');
            newScore.textContent = `${i+1}. ${storageArray[i]}`;
            // console.log(newScore) 
            highScoresList.appendChild(newScore);
        }
}
getValueFromStorage();

// BUTTON GIVE UP HANDLER
giveUpBtn.addEventListener("click", () => {
    score = 0;
    setStorageItems(score);
    alert(`to ${currentQuestion.name}, nie odpuszczaj, spróbuj ponownie!`)
    return window.location.assign("./start.html");
})


