const bird = document.getElementById("bird");
const scoreDisplay = document.getElementById("score");
const gameOverScreen = document.getElementById("game-over");
const retryButton = document.getElementById("retry-button");
const instructions = document.getElementById("instructions");
const startButton = document.getElementById("start-btn");
const pauseButton = document.getElementById("pause-button");

const flapSound = document.getElementById("flap-sound");
const dieSound = document.getElementById("die-sound");
const hitSound = document.getElementById("hit-sound");
const pointSound = document.getElementById("point-sound");
const swooshSound = document.getElementById("swoosh-sound");

const finalScore = document.getElementById("final-score");

let birdTop = 250;
let birdLeft = 50;
let gravity = 1.5;
let gameSpeed = 5;
let isGameOver = false;
let isPaused = false; // Pause state
let score = 0;
let pipePassed = false;

let gameLoopId;

const pipes = document.querySelectorAll(".pipe");

// Initialize The Game
function initializeGame() {
  instructions.style.display = "none";
  swooshSound.play();
  isGameOver = false;
  isPaused = false; // Ensure the game is not paused when starting
  birdTop = 250;
  score = 0;
  scoreDisplay.innerText = `Score : ${score}`;
  pipes.forEach((pipe) => {
    pipe.style.left = `${parseInt(pipe.style.left) + 500}px`;
  });

  // Hide resume container initially
  document.getElementById("resume-container").style.display = "none";

  // Reset the pause button visibility
  pauseButton.style.display = "block"; // Show the pause button again

  gameLoop();
  toggleBackgroundEffect(); // Start background toggling
}

// Jump the bird
function jump() {
  if (!isGameOver && !isPaused) {
    birdTop -= 50;
    flapSound.play();
  }
}

function resetGame() {
  gameOverScreen.style.display = "none";
  initializeGame();
}

// Game Over
function gameOver() {
  isGameOver = true;
  gameOverScreen.style.display = "block";
  finalScore.innerText = `Your score is: ${score}`; // Display final score
  dieSound.play();
  pauseButton.style.display = "none"; // Hide the pause button
  clearInterval(backgroundInterval); // Stop background toggle on game over
}

// Rest Pipes
function resetPipes() {
  const pipes = document.querySelectorAll(".pipe");
  pipes.forEach((pipe) => {
    pipe.style.left = "400px";
  });
}

// Game Loop
function gameLoop() {
  if (isGameOver || isPaused) {
    return; // Stop the game loop if paused or game over
  }

  birdTop += gravity;
  bird.style.top = birdTop + "px";

  if (birdTop <= 0 || birdTop >= 560) {
    gameOver();
  }

  pipes.forEach((pipe) => {
    let pipeLeft = parseInt(pipe.style.left);

    if (pipeLeft > -60) {
      pipe.style.left = pipeLeft - gameSpeed + "px";

      // Detect Collisions
      if (
        birdLeft + 40 > pipeLeft &&
        birdLeft < pipeLeft + 60 &&
        birdTop + 40 > parseInt(pipe.style.top) &&
        birdTop < parseInt(pipe.style.top) + parseInt(pipe.style.height)
      ) {
        hitSound.play();
        gameOver();
      }

      // Bird would keep moving
      if (!pipePassed && pipeLeft + 60 < birdLeft) {
        score++;
        pointSound.play();
        scoreDisplay.innerText = `Score: ${score}`;
        pipePassed = true;
      }
    } else {
      pipe.style.left = "800px";
      pipePassed = false;
    }
  });
  gameLoopId = requestAnimationFrame(gameLoop); // Store the ID
}

// Toggle pause functionality
function togglePause() {
  isPaused = !isPaused; // Toggle the pause state
  pauseButton.innerText = isPaused ? "Resume" : "Pause"; // Change button text

  if (isPaused) {
    // Show resume button when paused
    document.getElementById("resume-container").style.display = "block";
  } else {
    // Hide resume container when unpaused
    document.getElementById("resume-container").style.display = "none";
  }
}

// Resume button click event
document.getElementById("resume-button").addEventListener("click", function () {
  countdown();
});

// Countdown function
function countdown() {
  let count = 3; // Start from 3
  const countdownDisplay = document.getElementById("countdown");
  const resumeButton = document.getElementById("resume-button");

  resumeButton.style.display = "none"; // Hide the resume button
  countdownDisplay.style.display = "block"; // Show countdown display
  countdownDisplay.innerText = count; // Start countdown at 3

  const countdownInterval = setInterval(() => {
    count--;
    countdownDisplay.innerText = count; // Update countdown display

    if (count === 0) {
      clearInterval(countdownInterval); // Clear the interval when countdown is done
      countdownDisplay.style.display = "none"; // Hide the countdown
      togglePause(); // Resume the game
      gameLoop(); // Start the game loop
    }
  }, 1000); // Countdown every second
}

// Toggle background effect
let isDark = false;
let backgroundInterval;

function toggleBackgroundEffect() {
  backgroundInterval = setInterval(() => {
    const gameContainer = document.getElementById("game-container");
    isDark = !isDark;
    if (isDark) {
      gameContainer.style.filter = "brightness(50%)"; // Darken the background
    } else {
      gameContainer.style.filter = "brightness(100%)"; // Lighten the background
    }
  }, 10000); // Change every 10 seconds (adjust as necessary)
}

document.addEventListener("keydown", jump);
retryButton.addEventListener("click", resetGame);
startButton.addEventListener("click", initializeGame);
pauseButton.addEventListener("click", togglePause);
