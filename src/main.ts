import "./style.css";
const timerDOMTag = document.getElementById("time");
const startBtn = document.getElementById("startBtn") as HTMLButtonElement;
const resetBtn = document.getElementById("resetBtn") as HTMLButtonElement;
const date = document.getElementById("date") as HTMLSpanElement;
date.innerText = `${new Date().getFullYear()}`;

import startBeepAudio from "./start-sound.wav";
import stopBeepAudio from "./stop-sound.wav";
import confettiAudio from "./confetti.mp3";

// audio
const startBeep = new Audio(startBeepAudio);
const stopBeep = new Audio(stopBeepAudio);
const confetti = new Audio(confettiAudio);

// Buttons
const increaseMinutesBtn = document.querySelector<HTMLButtonElement>(
  ".minutes-increase-btn"
);
const decreaseMinutesBtn = document.querySelector(
  ".minutes-decrease-btn"
) as HTMLButtonElement;
const increaseSecondsBtn = document.querySelector(
  ".seconds-increase-btn"
) as HTMLButtonElement;
const decreaseSecondsBtn = document.querySelector(
  ".seconds-decrease-btn"
) as HTMLButtonElement;

let minutesInput = document.getElementById("minutes") as HTMLInputElement; // .valueAsNumber;
let secondsInput = document.getElementById("seconds") as HTMLInputElement; // .valueAsNumber;

let minutes = 15;
let seconds = 0;
let timerIsRunning = false;

//? Parsed String that is shown to the user
function parseTime() {
  return minutes < 10 && seconds < 10
    ? `0${minutes}m:0${seconds}s`
    : minutes >= 10 && seconds < 10
    ? `${minutes}m:0${seconds}s`
    : minutes >= 10 && seconds >= 10
    ? `${minutes}m:${seconds}s`
    : minutes < 10 && seconds >= 10
    ? `0${minutes}m:${seconds}s`
    : "";
}

function setTimer() {
  // if (seconds.value >= 60) {
  //   seconds.value = 59;
  // }

  if (!timerIsRunning) {
    minutes = +minutesInput.value;
    seconds = +secondsInput.value;
    if (isNaN(minutes) || isNaN(seconds) || minutes < 0 || seconds < 0) return;

    if (seconds > 59) {
      seconds = 59;
      secondsInput.value = "59";
    }

    if (seconds < 0) {
      seconds = 0;
      secondsInput.value = "0";
    }
    timerDOMTag!.innerText = parseTime();
  }
  return;
}

increaseMinutesBtn!.addEventListener("click", () => {
  (minutesInput as any).value++;
  setTimer();
});

decreaseMinutesBtn.addEventListener("click", () => {
  if (+minutesInput.value - 1 < 0) return;
  (minutesInput as any).value--;
  setTimer();
});

increaseSecondsBtn.addEventListener("click", () => {
  if (+secondsInput.value + 1 >= 60) return;
  (secondsInput as any).value++;
  setTimer();
});

decreaseSecondsBtn.addEventListener("click", () => {
  if (+secondsInput.value - 1 < 0) return;
  (secondsInput as any).value--;
  setTimer();
});

function setBtnToStart() {
  timerIsRunning = false;
  startBtn.classList.toggle("stop");
  startBtn.innerText = "START";
}

function setBtnToStop() {
  timerIsRunning = true;
  startBtn.classList.toggle("stop");
  startBtn.innerText = "STOP";
}

const timerLogic = () => {
  let intervalId = setInterval(() => {
    if (timerIsRunning) {
      // Make set btn appear only when timer is running
      resetBtn.style.display = "block";
      if (seconds <= 0 && minutes <= 0) {
        setBtnToStart();
        confetti.play();
        (window as any).confetti({
          particleCount: 150,
          spread: 180,
        });
        // Make set btn disappear after timer ends
        resetBtn.style.display = "none";
        return clearInterval(intervalId);
      }
      if (seconds === 0) {
        minutes--;
        seconds = 59;
      } else {
        seconds--;
      }
      timerDOMTag!.innerText = parseTime();
    } else {
      clearInterval(intervalId);
    }
  }, 1000);
};

// prevent double clicking on button
let processing = false;
startBtn.addEventListener("click", () => {
  if (!minutes && !seconds) {
    return;
  }

  startBtn.innerText === "START" ? startBeep.play() : stopBeep.play();

  if (!processing) {
    processing = true;
    setTimeout(() => {
      if (
        seconds < 0 ||
        seconds > 59 ||
        minutes < 0 ||
        (minutes === 0 && seconds === 0)
      ) {
        return;
      }
      if (timerIsRunning) {
        setBtnToStart();
      } else {
        resetBtn.style.display = "block";
        setBtnToStop();
        timerLogic();
      }
      processing = false;
    }, 300);
  }
});

resetBtn.addEventListener("click", () => {
  minutes = +minutesInput.value;
  seconds = +secondsInput.value;

  startBeep.play();
});

timerDOMTag!.innerText = parseTime();
