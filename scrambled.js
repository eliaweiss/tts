let currentSentencePt = "";
let userBuffer = "";
let numberOfWordClicked = 0
let words

async function playSentence() {
    await readAloud_pt(phrases[index].pt);
}
async function startScrambledSentence() {
    currentSentencePt = "";
    userBuffer = "";
    numberOfWordClicked = 0    
    document.getElementById('scrambledSentenceContainer').classList.remove('hidden')
    index++
    playScrambledSentence()
}
async function playScrambledSentence() {
    if (index >= phrases.length) {
        index = 0
        phrases = randomPermutation(phrases)
    }    
    document.querySelector('#scrambled-result').classList.add('hidden');  // Toggle hidden class
    document.querySelector('#scrambled-game').classList.remove('hidden');  // Toggle hidden class
    document.getElementById('scrambled-en').textContent= phrases[index].en
    console.log("index "+index+" phrase "+phrases[index].en);
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
        button.textContent = word.toLowerCase().replace(",", "").replace(".", "").replace("?", "").replace(/punctuation/g, "");
        button.onclick = function () {
            handleClickWord(word);
        };
        scrambledSentenceDiv.appendChild(button);
    });
}

function deleteLastWord_helper(str) {
    const lastSpaceIndex = str.lastIndexOf(" ");
    if (lastSpaceIndex !== -1) {
      return str.slice(0, lastSpaceIndex);
    } else {
      // Handle case where there's no space (single word sentence)
      return "";
    }
  }
function deleteWord() {
    if (numberOfWordClicked<=0) return
    numberOfWordClicked--;
    userBuffer = deleteLastWord_helper(userBuffer.trim())+" ";
    document.getElementById("userBuffer").textContent = userBuffer.trim();
}
async function handleClickWord(word) {
    numberOfWordClicked++
    userBuffer += word + " ";
    await readAloud_pt(word);

    document.getElementById("userBuffer").textContent = userBuffer.trim();

    if (numberOfWordClicked == words.length) {
        // Check if user buffer matches the original sentence (excluding punctuation)
        if (userBuffer.trim().replace(/punctuation/g, "") === currentSentencePt) {
            // console.log("Correct! Move to next sentence.");
            document.querySelector('#scrambled-game').classList.add('hidden');  // Toggle hidden class
            document.querySelector('#scrambled-result').classList.remove('hidden');  // Toggle hidden class
            // Play audio or move to next sentence logic here
            userBuffer = ""; // Reset user buffer for next sentence
            document.getElementById('scrambled-en').textContent=""
            document.getElementById("userBuffer").textContent = ""
            document.getElementById("scrambledSentence").innerHTML = "";
            numberOfWordClicked=0
            index++
            setTimeout(playScrambledSentence,1000)
        } else {
            userBuffer = ""; // Reset user buffer for next sentence
            numberOfWordClicked=0
            document.getElementById('scrambled-en').textContent=""
            document.getElementById("userBuffer").textContent = ""
            document.getElementById("scrambledSentence").innerHTML = ""; 
            setTimeout(playScrambledSentence,1000)
        
        }
    }
}