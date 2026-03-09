// Quiz Application Logic
class QuizApp {
  constructor() {
    console.log("QuizApp initializing...");
    this.questions = [];
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.answered = false;
    this.selectedAnswer = null;
    this.totalQuestions = 0;

    const elementsInitialized = this.initializeElements();
    if (elementsInitialized) {
      this.loadQuestions();
    } else {
      console.error("Failed to initialize DOM elements");
      document.body.innerHTML = `
        <div style="text-align: center; padding: 50px; font-family: Arial, sans-serif;">
          <h1>Quiz App Error</h1>
          <p>Failed to initialize the application. Please check if all required HTML elements are present.</p>
          <p>Check the browser console for more details.</p>
        </div>
      `;
    }
  }

  initializeElements() {
    console.log("Initializing DOM elements...");

    // Get DOM elements
    this.progressFill = document.getElementById("progress-fill");
    this.questionCounter = document.getElementById("question-counter");
    this.scoreDisplay = document.getElementById("score-display");
    this.questionTitle = document.getElementById("question-title");
    this.seriesDisplay = document.getElementById("series-display");
    this.optionsContainer = document.getElementById("options-container");
    this.feedbackContainer = document.getElementById("feedback-container");
    this.feedbackMessage = document.getElementById("feedback-message");
    this.explanation = document.getElementById("explanation");
    this.nextButton = document.getElementById("next-button");
    this.quizContainer = document.getElementById("quiz-container");
    this.resultsContainer = document.getElementById("results-container");
    this.finalScoreText = document.getElementById("final-score-text");
    this.scorePercentage = document.getElementById("score-percentage");
    this.scoreMessage = document.getElementById("score-message");
    this.restartButton = document.getElementById("restart-button");

    // Check if all required elements were found
    const requiredElements = {
      progressFill: this.progressFill,
      questionCounter: this.questionCounter,
      scoreDisplay: this.scoreDisplay,
      questionTitle: this.questionTitle,
      seriesDisplay: this.seriesDisplay,
      optionsContainer: this.optionsContainer,
      nextButton: this.nextButton,
      quizContainer: this.quizContainer,
      resultsContainer: this.resultsContainer,
    };

    const missingElements = Object.entries(requiredElements)
      .filter(([name, element]) => !element)
      .map(([name]) => name);

    if (missingElements.length > 0) {
      console.error("Missing DOM elements:", missingElements);
      return false;
    }

    console.log("All DOM elements found successfully");

    // Add event listeners
    this.nextButton.addEventListener("click", () => this.nextQuestion());
    this.restartButton.addEventListener("click", () => this.restartQuiz());

    return true;
  }

  async loadQuestions() {
    try {
      console.log("Attempting to load questions.json...");
      const response = await fetch("questions.json");
      console.log(
        "Fetch response status:",
        response.status,
        response.statusText,
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Questions data loaded successfully:", data);
      this.questions = data.questions;
      this.totalQuestions = data.totalQuestions;
      this.displayQuestion();
    } catch (error) {
      console.error("Error loading questions:", error);
      this.questionTitle.textContent = `Error loading questions: ${error.message}`;

      // Show a more detailed error message to the user
      this.seriesDisplay.innerHTML = `
        <div style="color: red; text-align: center; padding: 20px;">
          <p>Failed to load quiz questions. This might be due to:</p>
          <ul style="text-align: left; margin: 10px auto; display: inline-block;">
            <li>The questions.json file is missing</li>
            <li>CORS policy restrictions (try running from a local server)</li>
            <li>Network connection issues</li>
          </ul>
          <p>Please refresh the page or check the browser console for more details.</p>
        </div>
      `;
    }
  }

  displayQuestion() {
    if (this.currentQuestionIndex >= this.questions.length) {
      this.showResults();
      return;
    }

    const question = this.questions[this.currentQuestionIndex];
    this.answered = false;
    this.selectedAnswer = null;

    // Update progress
    const progress = (this.currentQuestionIndex / this.totalQuestions) * 100;
    this.progressFill.style.width = `${progress}%`;

    // Update question counter
    this.questionCounter.textContent = `Question ${this.currentQuestionIndex + 1} of ${this.totalQuestions}`;

    // Update score display
    this.scoreDisplay.textContent = `Score: ${this.score}/${this.currentQuestionIndex}`;

    // Display question
    this.questionTitle.textContent = `Question ${question.id}`;

    // Display series
    this.seriesDisplay.innerHTML = `
            <div class="series-numbers">${question.series}</div>
        `;

    // Display options
    this.displayOptions(question.options);

    // Hide feedback and next button
    this.feedbackContainer.style.display = "none";
    this.nextButton.style.display = "none";

    // Add fade-in animation
    this.optionsContainer.classList.add("fade-in");
  }

  displayOptions(options) {
    this.optionsContainer.innerHTML = "";

    Object.entries(options).forEach(([key, value]) => {
      const optionButton = document.createElement("button");
      optionButton.className = "option-button";
      optionButton.innerHTML = `
                <span class="option-label">(${key})</span>
                <span class="option-text">${value}</span>
            `;

      optionButton.addEventListener("click", () =>
        this.selectAnswer(key, optionButton),
      );
      this.optionsContainer.appendChild(optionButton);
    });
  }

  selectAnswer(selectedKey, buttonElement) {
    if (this.answered) return;

    this.answered = true;
    this.selectedAnswer = selectedKey;
    const question = this.questions[this.currentQuestionIndex];
    const isCorrect = selectedKey === question.correctAnswer;

    // Update score
    if (isCorrect) {
      this.score++;
    }

    // Disable all option buttons
    const allButtons = this.optionsContainer.querySelectorAll(".option-button");
    allButtons.forEach((button) => {
      button.classList.add("disabled");
    });

    // Highlight selected answer
    buttonElement.classList.add(isCorrect ? "correct" : "incorrect");

    // Highlight correct answer if user was wrong
    if (!isCorrect) {
      allButtons.forEach((button) => {
        const optionKey = button
          .querySelector(".option-label")
          .textContent.match(/\((\w)\)/)[1];
        if (optionKey === question.correctAnswer) {
          button.classList.add("correct");
        }
      });
    }

    // Show feedback
    this.showFeedback(isCorrect, question.explanation);

    // Show next button
    this.nextButton.style.display = "block";
    this.nextButton.textContent =
      this.currentQuestionIndex < this.totalQuestions - 1
        ? "Next Question →"
        : "View Results →";
  }

  showFeedback(isCorrect, explanation) {
    this.feedbackContainer.style.display = "block";
    this.feedbackContainer.className = `feedback-container ${isCorrect ? "correct" : "incorrect"}`;

    const icon = isCorrect ? "✅" : "❌";
    const message = isCorrect ? "Correct!" : "Incorrect!";

    this.feedbackMessage.innerHTML = `${icon} ${message}`;
    this.explanation.textContent = explanation;

    // Add animation
    this.feedbackContainer.classList.add("fade-in");
  }

  nextQuestion() {
    this.currentQuestionIndex++;

    if (this.currentQuestionIndex < this.totalQuestions) {
      this.displayQuestion();
    } else {
      this.showResults();
    }
  }

  showResults() {
    // Calculate percentage
    const percentage = Math.round((this.score / this.totalQuestions) * 100);

    // Hide quiz container and show results
    this.quizContainer.style.display = "none";
    this.resultsContainer.style.display = "block";

    // Update final score
    this.finalScoreText.textContent = `Your Score: ${this.score}/${this.totalQuestions}`;
    this.scorePercentage.textContent = `${percentage}%`;

    // Set score message based on performance
    let message;
    if (percentage >= 90) {
      message =
        "🌟 Excellent! You have a great understanding of number series patterns!";
    } else if (percentage >= 70) {
      message =
        "👏 Well done! You're getting the hang of these number series questions.";
    } else if (percentage >= 50) {
      message =
        "👍 Good effort! Keep practicing to improve your pattern recognition skills.";
    } else {
      message =
        "💪 Don't worry! Number series can be tricky. Practice more to improve your skills.";
    }

    this.scoreMessage.textContent = message;

    // Add animation
    this.resultsContainer.classList.add("bounce");
  }

  restartQuiz() {
    // Reset quiz state
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.answered = false;
    this.selectedAnswer = null;

    // Reset progress bar
    this.progressFill.style.width = "0%";

    // Show quiz container and hide results
    this.quizContainer.style.display = "block";
    this.resultsContainer.style.display = "none";

    // Remove animation classes
    this.resultsContainer.classList.remove("bounce");
    this.optionsContainer.classList.remove("fade-in");
    this.feedbackContainer.classList.remove("fade-in");

    // Display first question
    this.displayQuestion();
  }
}

// Initialize the quiz when the page loads
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded, creating QuizApp instance...");
  try {
    window.quizApp = new QuizApp();
    console.log("QuizApp created successfully");
  } catch (error) {
    console.error("Error creating QuizApp:", error);
    document.body.innerHTML = `
      <div style="text-align: center; padding: 50px; font-family: Arial, sans-serif; background: white; margin: 50px auto; max-width: 600px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <h1 style="color: #e74c3c;">⚠️ Application Error</h1>
        <p style="margin: 20px 0;">The quiz application failed to start.</p>
        <p style="margin: 20px 0; color: #666;">Error: ${error.message}</p>
        <button onclick="location.reload()" style="background: #3498db; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-size: 16px;">
          🔄 Reload Page
        </button>
      </div>
    `;
  }
});

// Add some utility functions for better user experience
document.addEventListener("keydown", (event) => {
  // Allow keyboard navigation
  const quiz = window.quizApp;

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return;
  }

  if (event.key >= "1" && event.key <= "5" && !quiz.answered) {
    const optionIndex = parseInt(event.key) - 1;
    const optionButtons = document.querySelectorAll(".option-button");
    if (optionButtons[optionIndex]) {
      optionButtons[optionIndex].click();
    }
  }

  // Enter key for next question
  if (event.key === "Enter") {
    const nextButton = document.getElementById("next-button");
    if (nextButton && nextButton.style.display !== "none") {
      nextButton.click();
    }
  }
});

// Prevent context menu on the app
document.addEventListener("contextmenu", (event) => {
  event.preventDefault();
});

// Add some visual feedback for loading
window.addEventListener("load", () => {
  document.body.style.opacity = "0";
  document.body.style.transition = "opacity 0.3s ease";

  setTimeout(() => {
    document.body.style.opacity = "1";
  }, 100);
});
