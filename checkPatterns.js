import { box, readJSON, writeJSON, logToFile } from "./utils.js";

async function checkFirstLetters(message) {
    try {
        const minLengthThreshold = 5;
        const data = await readJSON("./wordfreq.json");

        const words = new Set(data.map(([word]) => word));
        
        const messageWords = message.split(" ");

        let acronym = "";
        messageWords.forEach(w => {
            if (w && "abcdefghijklmnopqrstuvwxyz".includes(w[0].toLowerCase())) {
                acronym += w[0];
            }
        });

        acronym = acronym.replace(/[^a-zA-Z]/g, "");

        if (acronym.length >= minLengthThreshold && words.has(acronym.toLowerCase())) {
            return acronym;
        }

        return false;

    } catch (error) {
        console.error(box(`\x1b[31m!! checkFirstLetter failed due to ${error}.\x1b[0m\nMessage: ${message}`));
    }
}

export { checkFirstLetters };