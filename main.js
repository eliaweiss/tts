let voices = [];

///////////////////////////////////
function loadVoices() {
  voices = window.speechSynthesis.getVoices();
}
window.speechSynthesis.onvoiceschanged = loadVoices;

///////////////////////////////////
function splitIntoSubSentences(text) {
  return text.split(/[,.?] /);
}

///////////////////////////////////
async function readAloud_slow_pt(text) {
  const groups = splitIntoSubSentences(text);
  for (sentence of groups) {
    await readAloud_helper(addCommas(sentence), "pt-BR");
  }
}
///////////////////////////////////

async function readAloud(text, lang, rate = 1) {
  // await readAloud_helper(text, lang, rate);

  const groups = splitIntoSubSentences(text);
  for (sentence of groups) {
    await readAloud_helper(sentence, lang, rate);
  }
}

function resumeInfinity() {
  window.speechSynthesis.resume();
  timeoutResumeInfinity = setTimeout(resumeInfinity, 1000);
}

var myTimeout;
var sleepTime = 2000;
function myTimer() {
  // console.log("ttt");
  window.speechSynthesis.pause();
  window.speechSynthesis.resume();
  clearTimeout(myTimeout);
  myTimeout = setTimeout(myTimer, sleepTime);
}

async function readAloud_helper(text, lang, rate = 1) {
  return new Promise((resolve, reject) => {
    // console.log(">>");
    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate;
      utterance.lang = lang;

      // Select a specific voice for Brazilian Portuguese if available
      const selectedVoice = voices.find(
        (voice) => voice.lang === lang && voice.name.includes("Google")
      );
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      // utterance.onstart = function (event) {};
      myTimeout = setTimeout(myTimer, sleepTime);
      utterance.onend = function (event) {
        // console.log('Speech synthesis finished.');
        // console.log("<< ++");
        clearTimeout(myTimeout);
        resolve(); // Resolve the promise when speech synthesis is finished
      };

      utterance.onerror = function (event) {
        console.log("Speech error: " + event.error);
        clearTimeout(myTimeout);
        reject(event.error); // Reject the promise if there's an error during speech synthesis
      };

      // # https://stackoverflow.com/questions/21947730/chrome-speech-synthesis-with-longer-texts

      // console.log(utterance);
      // setTimeout(() => {
      window.speechSynthesis.speak(utterance);
      // }, 100);
    } catch {
      //   console.log("<< --");

      reject(); // Reject the promise if there's an error during speech synthesis
    }
  });
}

///////////////////////////////////
async function readAloud_pt(text, rate = 1) {
  await readAloud(text, "pt-BR", rate);
}
///////////////////////////////////
async function readAloud_en(text, rate = 1.2) {
  await readAloud(text, "en-US", rate);
}

///////////////////////////////////
// Global variable
let isReading = false;
let isPlaying = false;
waitTime = 4000;
index = 0;
phrases = randomPermutation(phrases);
///////////////////////////////////
async function readAllPhrases() {
  document.getElementById("playAllContainer").classList.remove("hidden");

  if (isReading || isPlaying) {
    isReading = false; // Stop reading if already running
    document.querySelector("#playStatus").classList.add("hidden"); // Toggle hidden class
    return;
  }

  isPlaying = isReading = true; // Set to true at the beginning
  document.querySelector("#playStatus").classList.remove("hidden"); // Toggle hidden class

  while (isReading) {
    try {
      skipFlag = false;
      console.log(
        "index: " + index + "/" + phrases.length + " - " + phrases[index].en
      );

      // Update current phrase display
      document.querySelector("#playAllContainer .pt").textContent =
        phrases[index].pt;
      document.querySelector("#playAllContainer .en").textContent =
        index + "/" + phrases.length + " - "; //+ phrases[index].en;

      await readAloud_pt(phrases[index].pt);
      if (!isReading) break;
      if (skipFlag) continue;
      await waitForSeconds(2);
      if (!isReading) break;
      if (skipFlag) continue;

      await readAloud_slow_pt(phrases[index].pt);
      if (!isReading) break;
      if (skipFlag) continue;

      // await waitForSeconds(2);
      // if (!isReading) break;
      // await readAloud_pt(phrases[index].pt);
      if (!isReading) break;
      if (skipFlag) continue;

      await waitForSeconds(1);
      if (!isReading) break;
      if (skipFlag) continue;

      document.querySelector("#playAllContainer .en").textContent =
        index + "/" + phrases.length + " - " + phrases[index].en;
      if (phrases[index].en) {
        await readAloud_en(phrases[index].en);
        await waitForSeconds(1);
      }
      if (!isReading) break;

      index++;
      if (index >= phrases.length) {
        index = 0;
        phrases = randomPermutation(phrases);
      }
    } catch (e) {
      console.log(e);
    }
  }

  isPlaying = false; // Set to false after reading all phrases
}
///////////////////////////////////

function addCommas(text) {
  // Split the text into a list of words using whitespace as the delimiter
  const words = text.split(/\s+/);

  // Join the words back together with commas as separators
  const commaSeparatedString = words.join(", ");

  return commaSeparatedString;
}
///////////////////////////////////
async function waitForSeconds(ss) {
  await new Promise((resolve) => setTimeout(resolve, ss * 1000));
}

///////////////////////////////////
// Fisher-Yates (or Knuth) shuffle algorithm
function randomPermutation(data) {
  const perm = data.slice(); // Create a copy of the data array
  for (let i = perm.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // Random index from 0 to i
    [perm[i], perm[j]] = [perm[j], perm[i]]; // Swap elements at i and j
  }
  return perm;
}

function cancel() {
  isPlaying = false;
  speechSynthesis.cancel();
}

function skipLoop() {
  speechSynthesis.cancel();
  index++;
  skipFlag = true;
}
