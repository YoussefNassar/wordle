const WORD_OF_THE_DAY_URL = "https://words.dev-apis.com/word-of-the-day";
const CHECK_IF_VALID_WORD_URL = "https://words.dev-apis.com/validate-word";
let word = "";
const loadingArea = document.querySelector(".loading");
let lastElementInRow;

async function checkWord() {
    const promise = await fetch(WORD_OF_THE_DAY_URL);
    const processedResponse = await promise.json();
    word = processedResponse.word;
}

async function checkIfValidWord() {
    const letters = getLetters();
    const promise = await fetch(CHECK_IF_VALID_WORD_URL, {
        method: 'POST',
        headers: { 
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ word: letters })
    });
    const processedResponse = await promise.json();
    if (processedResponse.validWord === true) {
        return true;
    } else {
        return false;
    }
}

checkWord();

const theGame = document.querySelector(".wordl");
const boxes = document.querySelectorAll(".box");

let index = 1;
theGame.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        loadingArea.style.removeProperty = 'visibility';
        handleEnter();
        // loadingArea.style.visibility = "hidden";
    }
    else if (event.key === "Backspace") {
        handleBackspace();
    }
    if (isLetter(event.key)) {
        handleLetter(event);
    }
});

function handleLetter(event) {
    if (index % 5 === 0) {
        boxes[index - 1].textContent = event.key;
    }

    while (index % 5 !== 0) {
        boxes[index - 1].textContent = event.key;
        index++;
        break;
    }
}

async function handleEnter() {
    if (index % 5 === 0) {
        let valid;
        valid = await checkIfValidWord();
        if (valid) {
            handleValidWord();
        } else {
            window.alert("not a word")
        }
    }
}

function handleValidWord() {
    window.alert("a word");
    const letters = getLetters();
    if (letters === word) {
        for (let i = index; i > index - 5; i--) {
            boxes[i - 1].style.backgroundColor = "green";
        }
    } else {
        for (let i = 0; i < word.length; i++) {
            if (word[i] === letters[i]) {
                boxes[(index - 1) - i].style.backgroundColor = "green";
            } else if (word.includes(letters[i])) {
                boxes[(index - 1) - i].style.backgroundColor = "yellow";
            } else {
                boxes[(index - 1) - i].style.backgroundColor = "grey";
            }
            // if (word[i] === boxes[index - (word.length - i)].textContent) {
            //     boxes[index - (word.length - i)].style.backgroundColor = "green";
            // }
        }
        index++;
    }
}

function handleBackspace() {
    if((index-1) % 5 === 0 && index % 5 === 0) {
        boxes[index - 1].textContent = "";
    } else {
        index--;
        boxes[index - 1].textContent = "";
    }
    // if (index !== 1) {
    //     boxes[index - 1].textContent = "";
    //     index--;
    // } else if (index === 1) {
    //     boxes[index - 1].textContent = "";
    // }
}

function getLetters() {
    let word = "";
    for (let i = (index - 5); i < index; i++) {
        word += boxes[i].textContent;
    }
    return word;
}

function isLetter(letter) {
    return /^[a-zA-Z]$/.test(letter);
}