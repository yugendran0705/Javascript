const quizData = [
    {
        question: "What is 2 + 2?",
        options: ["3", "4", "5", "6"],
        answer: "4",
        explanation: "Basic arithmetic: 2 + 2 equals 4."
    },
    {
        question: "Which planet is known as the Red Planet?",
        options: ["Venus", "Mars", "Jupiter", "Saturn"],
        answer: "Mars",
        explanation: "Mars is called the Red Planet due to its reddish appearance caused by iron oxide (rust) on its surface."
    },
    {
        question: "Who is the author of Vagabond?",
        options: ["Eiichiro Oda", "Junji Ito", "Takehiko Inoue", "Kentaro Miura"],
        answer: "Takehiko Inoue",
        explanation: "Takehiko Inoue is the author of Vagabond."
    }
];

let currentQuestion = 0;
let score = 0;

const questionEl = document.getElementById('question');
const optionsEl = document.getElementById('options');
const nextBtn = document.getElementById('nextBtn');
const resultEl = document.getElementById('result');

function loadQuestion() {
    const currentQuiz = quizData[currentQuestion];
    questionEl.textContent = currentQuiz.question;
    optionsEl.innerHTML = '';

    currentQuiz.options.forEach(option => {
        const li = document.createElement('li');
        li.textContent = option;
        li.addEventListener('click', () => selectAnswer(option));
        optionsEl.appendChild(li);
    });

    nextBtn.style.display = 'none';
    resultEl.style.display = 'none';
}

function selectAnswer(selected) {
    const currentQuiz = quizData[currentQuestion];
    const isCorrect = selected === currentQuiz.answer;

    if (isCorrect) {
        score++;
    }

    optionsEl.querySelectorAll('li').forEach(li => {
        li.style.pointerEvents = 'none';
        if (li.textContent === currentQuiz.answer) {
            li.style.background = '#90EE90'; 
        } else if (li.textContent === selected && !isCorrect) {
            li.style.background = '#FFB6C1'; 
        }
    });

    nextBtn.style.display = 'block';
}

function nextQuestion() {
    currentQuestion++;

    if (currentQuestion < quizData.length) {
        loadQuestion();
    } else {
        showResult();
    }
}

function showResult() {
    questionEl.style.display = 'none';
    optionsEl.style.display = 'none';
    nextBtn.style.display = 'none';
    resultEl.style.display = 'block';

    resultEl.innerHTML = `
        <h2>Quiz Complete!</h2>
        <p>Your score: ${score} out of ${quizData.length}</p>
        <h3>Review:</h3>
        ${quizData.map((q, i) => `
            <p>${i + 1}. ${q.question}<br>
            Answer: ${q.answer}<br>
            ${q.explanation}</p>
        `).join('')}
    `;
}

loadQuestion(); 