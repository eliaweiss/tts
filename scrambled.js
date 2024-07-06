let currentSentencePt = "";
let userBuffer = "";
let numberOfWordClicked = 0;
let words;

async function playSentence() {
  await readAloud_pt(phrases[index].pt);
}
async function startScrambledSentence() {
  currentSentencePt = "";
  userBuffer = "";
  numberOfWordClicked = 0;
  document
    .getElementById("scrambledSentenceContainer")
    .classList.remove("hidden");
  index++;
  playScrambledSentence();
}

function removeDotAtEnd(sentence) {
  if (sentence.endsWith(".")) {
    return sentence.slice(0, -1); // Remove the last character
  }
  return sentence;
}

async function playScrambledSentence() {
  if (index >= phrases.length) {
    index = 0;
    phrases = randomPermutation(phrases);
  }
  document.querySelector("#scrambled-result").classList.add("hidden"); // Toggle hidden class
  document.querySelector("#scrambled-game").classList.remove("hidden"); // Toggle hidden class
  document.getElementById("scrambled-en").textContent =
    index + "/" + phrases.length + " - " + phrases[index].en;
  console.log("index " + index + " phrase " + phrases[index].en);
  await playSentence();

  // Get the current Portuguese sentence
  currentSentencePt = phrases[index].pt; //.replace(/punctuation/g, ""); // Remove punctuation
  currentSentencePt = removeDotAtEnd(currentSentencePt)
    .replace(", ", " ")
    .replace(". ", " ")
    .replace("?", "")
    .replace(/punctuation/g, "");
  words = currentSentencePt.toLocaleLowerCase().split(" "); // Split into words

  // Randomly scramble the words
  const scrambledWords = removeDuplicates(randomPermutation(words));

  // Clear user buffer and display area
  userBuffer = "";
  document.getElementById("userBuffer").textContent = "";

  // Create buttons for each scrambled word
  const scrambledSentenceDiv = document.getElementById("scrambledSentence");
  scrambledSentenceDiv.innerHTML = "";
  scrambledWords.forEach((word) => {
    const button = document.createElement("button");
    button.classList.add("scrambled-word");
    button.textContent = word;

    button.onclick = function () {
      handleClickWord(word);
    };
    scrambledSentenceDiv.appendChild(button);
  });
}

function removeDuplicates(words) {
  // Use a Set to automatically handle duplicates
  let uniqueWords = new Set(words);

  // Convert the Set back to an array
  return Array.from(uniqueWords);
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
  if (numberOfWordClicked <= 0) return;
  numberOfWordClicked--;
  userBuffer = deleteLastWord_helper(userBuffer.trim()) + " ";
  document.getElementById("userBuffer").textContent = userBuffer.trim();
}

///////////////////////////////////

async function rePlaySentence() {
  const lang = "pt-BR";
  const text = phrases[index].pt.toLocaleLowerCase();
  const subSentenceList = splitIntoSubSentences(text);
  for (subSentence of subSentenceList) {
    await readAloud_helper(subSentence, lang);
    if (!getCurrentUserBuffer().includes(subSentence)) {
      break;
    }
  }
}
///////////////////////////////////

async function handleClickWord(word) {
  numberOfWordClicked++;
  userBuffer += word + " ";
  await readAloud_pt(word, 1.25);

  document.getElementById("userBuffer").textContent = userBuffer.trim();

  if (numberOfWordClicked == words.length) {
    // Check if user buffer matches the original sentence (excluding punctuation)
    if (getCurrentUserBuffer() === currentSentencePt.toLocaleLowerCase()) {
      // console.log("Correct! Move to next sentence.");
      document.querySelector("#scrambled-result").classList.remove("hidden"); // Toggle hidden class

      moveToNextSentence();
    } else {
      userBuffer = ""; // Reset user buffer for next sentence
      numberOfWordClicked = 0;
      document.getElementById("scrambled-en").textContent = "";
      document.getElementById("userBuffer").textContent = "";
      document.getElementById("scrambledSentence").innerHTML = "";
      setTimeout(playScrambledSentence, 1000);
    }
  }
}

function getCurrentUserBuffer() {
  return userBuffer
    .trim()
    .replace(/punctuation/g, "")
    .toLocaleLowerCase();
}

function moveToNextSentence() {
  document.querySelector("#scrambled-game").classList.add("hidden"); // Toggle hidden class

  // Play audio or move to next sentence logic here
  userBuffer = ""; // Reset user buffer for next sentence
  document.getElementById("scrambled-en").textContent = "";
  document.getElementById("userBuffer").textContent = "";
  document.getElementById("scrambledSentence").innerHTML = "";
  numberOfWordClicked = 0;
  index++;
  setTimeout(playScrambledSentence, 1000);
}
function skip() {
  moveToNextSentence();
}
