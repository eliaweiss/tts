

///////////////////////////////////
function createPhrases(phrases) {
    const container = document.createElement('div');
    container.classList.add('phrases-container'); // Add a class for styling

    phrases.forEach(phrase => {
        const phraseDiv = document.createElement('div');
        phraseDiv.classList.add('phrase'); // Add a class for styling

        const paragraph = document.createElement('div');
        paragraph.classList.add('pt')
        paragraph.textContent = phrase.pt;

        // Create a span element to hold the English translation
        const translationSpan = document.createElement('div');
        translationSpan.classList.add('en'); // Hide the translation initially
        translationSpan.classList.add('hidden'); // Hide the translation initially
        translationSpan.textContent = phrase.en;


        const buttons = document.createElement('div');
        buttons.classList.add('buttons'); // Hide the translation initially

        const buttonReadAloud = document.createElement('button');
        buttonReadAloud.textContent = 'Ouvir (PT)'; // Portuguese for "Listen (PT)"
        buttonReadAloud.addEventListener('click', () => readAloud_pt(phrase.pt));
        buttons.appendChild(buttonReadAloud)

        const buttonShowTranslation = document.createElement('button');
        buttonShowTranslation.textContent = 'Tradução (EN)'; // Portuguese for "Translation (EN)"
        buttons.appendChild(buttonShowTranslation)
        // Add click event listener to toggle the visibility of the translation
        buttonShowTranslation.addEventListener('click', () => {
            translationSpan.classList.toggle('hidden');  // Toggle hidden class
        });


        phraseDiv.appendChild(paragraph);
        phraseDiv.appendChild(translationSpan);
        phraseDiv.appendChild(buttons);
        container.appendChild(phraseDiv);
    });

    document.body.appendChild(container);
}


let voices = [];

///////////////////////////////////
function loadVoices() {
    voices = window.speechSynthesis.getVoices();
    // Example usage
    createPhrases(phrases);
}

async function readAloud(text, lang) {
    return new Promise((resolve, reject) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;

        // Select a specific voice for Brazilian Portuguese if available
        const selectedVoice = voices.find(voice => voice.lang === lang && voice.name.includes('Google'));
        if (selectedVoice) {
            utterance.voice = selectedVoice;
        }

        utterance.onend = function(event) {
            console.log('Speech synthesis finished.');
            resolve(); // Resolve the promise when speech synthesis is finished
        };

        utterance.onerror = function(event) {
            reject(event.error); // Reject the promise if there's an error during speech synthesis
        };

        window.speechSynthesis.speak(utterance);
    });
}

///////////////////////////////////
async function readAloud_pt(text) {
    await readAloud(text, 'pt-BR')
}
///////////////////////////////////
async function readAloud_en(text) {
    await readAloud(text, 'en-US')
}

window.speechSynthesis.onvoiceschanged = loadVoices;

///////////////////////////////////
// New function to read all pt phrases with a pause
let isReading = false; // Global boolean variable
let isPlaying = false
waitTime = 4000
///////////////////////////////////
index = 0
phrases = randomPermutation(phrases)
async function readAllPhrases() {
    if (isReading || isPlaying) {
        isReading = false; // Stop reading if already running
        document.querySelector('#playStatus').classList.add('hidden');  // Toggle hidden class
        return;
    }

    isPlaying = isReading = true; // Set to true at the beginning
    document.querySelector('#playStatus').classList.remove('hidden');  // Toggle hidden class

    while (isReading) {
        // Update current phrase display
        document.querySelector('#currentPhrase .pt').textContent = phrases[index].pt;
        document.querySelector('#currentPhrase .en').textContent = phrases[index].en;


        if (phrases[index].en) {
            await readAloud_en(phrases[index].en);
            await waitForSeconds(1);
        }
        if (!isReading) break
        await readAloud_pt(phrases[index].pt);
        if (!isReading) break
        await waitForSeconds(1);
        if (!isReading) break
        await readAloud_pt(addCommas(phrases[index].pt));
        if (!isReading) break
        await waitForSeconds(1);
        if (!isReading) break
        await readAloud_pt(phrases[index].pt);
        if (!isReading) break
        await waitForSeconds(2);
        if (!isReading) break


        index++;
        // console.log('index: ' + index);
        if (index >= phrases.length) {
            index = 0
            phrases = randomPermutation(phrases)
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
    await new Promise(resolve => setTimeout(resolve, ss * 1000));
}


///////////////////////////////////

function randomPermutation(data) {
    const perm = data.slice();
  
    // Randomly shuffle the elements of the list
    perm.sort(() => Math.random() - 0.5);
  
    return perm;
  }