const canvas = document.getElementById("posterCanvas");
const ctx = canvas.getContext("2d");
const guess = document.getElementById("guess");
const nxtbtn = document.getElementById("next");
const buttonArray = [];
const btn1 = document.getElementById("1");
const btn2 = document.getElementById("2");
const btn3 = document.getElementById("3");
const btn4 = document.getElementById("4");
const btn5 = document.getElementById("5");
const movies = new Map();
let storedString = "";
let guessCount = 1;
let pixelationScale = 3;

const img = new Image();
img.crossOrigin = "anonymous";
let correctTitle;

async function generateMovieForTheDay() {
    try {
        const response = await fetch('./movies.json');
        if(!response.ok) throw new Error("Network Response Error");
        const data = await response.json();
        console.log(data);

        const randomMovie = pickRandomMovieFromJson(data.movies);

        img.src = randomMovie.src;
        correctTitle = randomMovie.title;
    } catch (error) {
        console.error(error);
    }
}

function pickRandomMovieFromJson(array) {
    const randIdx = Math.floor(Math.random() * array.length);
    return array[randIdx];
}

img.onload = () => {
    pixelate(img, pixelationScale);
};

function pixelate(img, factor) {
    const w = canvas.width;
    const h = canvas.height;

    const size = factor / 120;

    const scaledW = w * size;
    const scaledH = h * size;

    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(img, 0, 0, scaledW, scaledH);
    ctx.imageSmoothingEnabled = false;

    ctx.drawImage(canvas, 0, 0, scaledW, scaledH, 0, 0, w, h);
}

guess.addEventListener('keydown', (event) => {
    if(event.key === 'Enter') {
        if(guessCount > 5) {
            pixelate(img, 120);
            return;
        }
        event.preventDefault();
        storedString = guess.value;
        storedString = storedString.toLowerCase().trim(); // normalize user input
        if(storedString === correctTitle) {
            pixelate(img, 120);
            buttonArray[guessCount].style.cssText = "background-color: green;";

        } else if(storedString !== correctTitle && guessCount <= 5){
            pixelationScale += 2;
            pixelate(img, pixelationScale);
            buttonArray[guessCount].style.cssText = "background-color: red;";
            guessCount++;
        }
        guess.value = "";
    }
});

nxtbtn.addEventListener('click', () => {
    location.reload();
})

function populateButtonArray() {
    for(let i = 1; i <= 5; i++) {
        buttonArray[i] = document.getElementById(i.toString());
    }
}

populateButtonArray();
generateMovieForTheDay();