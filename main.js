

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

///////////////////////////////////
function readAloud_pt(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';

    // Select a specific voice for Brazilian Portuguese if available
    const selectedVoice = voices.find(voice => voice.lang === 'pt-BR' && voice.name.includes('Google'));
    if (selectedVoice) {
        utterance.voice = selectedVoice;
    }

    window.speechSynthesis.speak(utterance);
}

///////////////////////////////////
function readAloud_en(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';

    // Select a specific voice for Brazilian Portuguese if available
    const selectedVoice = voices.find(voice => voice.lang === 'en-US' && voice.name.includes('Google'));
    if (selectedVoice) {
        utterance.voice = selectedVoice;
    }

    window.speechSynthesis.speak(utterance);
}

window.speechSynthesis.onvoiceschanged = loadVoices;

///////////////////////////////////
// New function to read all pt phrases with a pause
let isReading = false; // Global boolean variable
let isPlaying = false
waitTime = 4000
///////////////////////////////////
async function readAllPhrases() {
    if (isReading || isPlaying) {
        isReading = false; // Stop reading if already running
        document.querySelector('#playStatus').classList.add('hidden');  // Toggle hidden class
        return;
    }

    isPlaying = isReading = true; // Set to true at the beginning
    document.querySelector('#playStatus').classList.remove('hidden');  // Toggle hidden class

    index = 0
    while (isReading) {
        // Update current phrase display
        document.querySelector('#currentPhrase .pt').textContent = phrases[index].pt;
        document.querySelector('#currentPhrase .en').textContent = phrases[index].en;


        readAloud_en(phrases[index].en);
        await waitForSeconds(3);
        if (!isReading) break
        readAloud_pt(phrases[index].pt);
        if (!isReading) break
        await waitForSeconds(3);
        if (!isReading) break
        readAloud_pt(addCommas(phrases[index].pt));
        if (!isReading) break
        await waitForSeconds(3);
        if (!isReading) break
        readAloud_pt(phrases[index].pt);
        if (!isReading) break
        await waitForSeconds(6);
        if (!isReading) break


        index++;
        if (index >= phrases.length) {
            index = 0
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

