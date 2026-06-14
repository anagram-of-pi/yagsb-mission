const wordListPath = require("word-list").default;
const fs = require("fs/promises");
const { box } = require('./utils');

async function checkFirstLetters(message) {
    try {
        const minLengthThreshold = 4;
        const words = new Set(
            (await fs.readFile(wordListPath, 'utf8')).split("\n")
        );
        
        const messageWords = message.split(" ");

        let acronym = "";
        messageWords.forEach(w => {
            acronym += w[0];
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

module.exports = { checkFirstLetters };
