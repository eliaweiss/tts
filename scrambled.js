let currentSentencePt = "";
let userBuffer = "";
let numberOfWordClicked = 0
let words

async function playSentence() {
    await readAloud_pt(phrases[index].pt);
}
async function playScrambledSentence() {
    await playSentence();

    // Get the current Portuguese sentence
    currentSentencePt = phrases[index].pt.replace(/punctuation/g, ""); // Remove punctuation
    words = currentSentencePt.split(" "); // Split into words

    // Randomly scramble the words
    const scrambledWords = randomPermutation(words);

    // Clear user buffer and display area
    userBuffer = "";
    document.getElementById("userBuffer").textContent = "";

    // Create buttons for each scrambled word
    const scrambledSentenceDiv = document.getElementById("scrambledSentence");
    scrambledSentenceDiv.innerHTML = "";
    scrambledWords.forEach(word => {
        const button = document.createElement("button");
        button.classList.add("scrambled-word");
        button.textContent = word;
        button.onclick = function () {
            handleClickWord(word);
        };
        scrambledSentenceDiv.appendChild(button);
    });
}

function handleClickWord(word) {
    numberOfWordClicked++
    userBuffer += word + " ";
    document.getElementById("userBuffer").textContent = userBuffer.trim();

    if (numberOfWordClicked == words.length) {
        // Check if user buffer matches the original sentence (excluding punctuation)
        if (userBuffer.trim().replace(/punctuation/g, "") === currentSentencePt) {
            console.log("Correct! Move to next sentence.");
            // Play audio or move to next sentence logic here
            userBuffer = ""; // Reset user buffer for next sentence
            numberOfWordClicked=0
            index++
            playScrambledSentence()
        } else {
            userBuffer = ""; // Reset user buffer for next sentence
            numberOfWordClicked=0

            playScrambledSentence()            
        }
    }
}