const startQuizBtn = document.getElementById("start-quiz");
const questionContainer = document.querySelector(".questionContainer");
const mainSection = document.querySelector(".main");
const submitContent = document.querySelector(".submitContent");

class Questions {
    constructor(question, options, correctOption, hint) {
        this.question = question;
        this.options = options;
        this.correctOption = correctOption;
        this.hint = hint;
    }

    isCorrect(chosenOption) {
        return this.correctOption === chosenOption;
    }
}

class Quiz {
    constructor(questions) {
        this.questions = questions;
        this.currentQuestionIndex = 0;
        this.timerInterval = null;
        this.score = 0;
    }

    renderCurrentQuestion() {
        questionContainer.innerHTML = "";

        const currentQuestion = this.questions[this.currentQuestionIndex];

        questionContainer.innerHTML += `
                <div class="timer-bar">
                    <div id="timeProgress"></div>
                </div>
                <div id="questionNumber" class="question-number">
                    Question ${this.currentQuestionIndex + 1} / ${
            this.questions.length
        }
                </div>
                <h2 id="questionText" class="question-text">
                    ${currentQuestion.question}
                </h2>
                <div id="optionsContainer" class="options-container">
                    <button class="optionBtn" onClick="quiz.handleAnswer(0)">${
                        currentQuestion.options[0]
                    }</button>
                    <button class="optionBtn" onClick="quiz.handleAnswer(1)">${
                        currentQuestion.options[1]
                    }</button>
                    <button class="optionBtn" onClick="quiz.handleAnswer(2)">${
                        currentQuestion.options[2]
                    }</button>
                    <button class="optionBtn" onClick="quiz.handleAnswer(3)">${
                        currentQuestion.options[3]
                    }</button>
                </div>
                <p>Hint: ${currentQuestion.hint}</p>
                <div class="actionBtns">
                    ${
                        this.currentQuestionIndex === 0
                            ? ""
                            : `<button class="next-btn" onClick="quiz.loadPreviousQuestion()">Back</button>`
                    }
                    <button id="nextBtn" class="next-btn" onClick=${
                        this.isFinished()
                            ? "quiz.submitQuiz()"
                            : "quiz.loadNextQuestion()"
                    }>${this.isFinished() ? "Submit" : "Next"}</button>
                </div>
        `;
        this.startTimer();
    }

    handleAnswer(chosenOption) {
        const optionButtons = document.querySelectorAll(".optionBtn");
        optionButtons.forEach((btn) => (btn.disabled = true));
        const currentQuestion = this.questions[this.currentQuestionIndex];
        if (currentQuestion.isCorrect(chosenOption)) {
            optionButtons[chosenOption].classList.add("isCorrect");
            this.score++;
        } else {
            optionButtons[chosenOption].classList.add("isWrong");
            optionButtons[currentQuestion.correctOption].classList.add(
                "isCorrect"
            );
        }
        this.stopTimer();
    }

    loadNextQuestion() {
        if (!this.isFinished()) {
            this.currentQuestionIndex++;
            this.renderCurrentQuestion();
        }
    }

    loadPreviousQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.renderCurrentQuestion();
        }
    }

    startTimer() {
        let timeLeft = 60;
        const timeProgress = document.getElementById("timeProgress");
        if (timeProgress) {
            timeProgress.style.animationPlayState = "running";
            timeProgress.style.width = "0%";
        }
        this.timerInterval = setInterval(() => {
            if (timeLeft <= 0) {
                clearInterval(this.timerInterval);
                if (timeProgress)
                    timeProgress.style.animationPlayState = "paused";
                this.loadNextQuestion();
            } else {
                timeLeft--;
                if (timeProgress)
                    timeProgress.style.width = `${
                        ((60 - timeLeft) / 60) * 100
                    }%`;
            }
        }, 1000);
    }

    stopTimer() {
        clearInterval(this.timerInterval);
        const timeProgress = document.getElementById("timeProgress");
        if (timeProgress) {
            timeProgress.style.animationPlayState = "paused";
        }
    }

    isFinished() {
        return this.currentQuestionIndex >= this.questions.length - 1;
    }

    submitQuiz() {
        questionContainer.innerHTML = "";

        questionContainer.innerHTML += `
        <div class="submitContent" style="text-align: center;">
            <p style="font-size: 3rem; font-weight: bold;">${
                this.score >= 6 ? "Congratulations!" : "Better Luck Next Time!"
            }</p>
            <img src="./assets/${
                this.score >= 6 ? "congrats" : "failed"
            }.gif" alt="Congratulations" />
            <p style="font-size: 1.5rem; font-weight: bold;">Your final score is: <span>${
                this.score
            } /${this.questions.length}</span></p>
        </div>
        `;
    }
}

function getRandomQuestions() {
    const random = [...questionsData].sort(() => Math.random() - 0.5);
    return random.slice(0, 10);
}

const selectedRandomQuestion = getRandomQuestions().map(
    (question) =>
        new Questions(
            question.question,
            question.options,
            question.correctOption,
            question.hint
        )
);

let quiz;

startQuizBtn.addEventListener("click", () => {
    quiz = new Quiz(selectedRandomQuestion);

    startQuizBtn.classList.add("hidden");
    mainSection.classList.remove("hidden");
    quiz.renderCurrentQuestion();
});
