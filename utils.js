import stringWidth from "string-width";
import fs from "fs/promises";

function box(text) {
    const maxLength = 100;

    const wrappedLines = [];

    for (const line of String(text).split("\n")) {
        let remaining = line;

        while (stringWidth(remaining) > maxLength) {
            wrappedLines.push(remaining.slice(0, maxLength));
            remaining = remaining.slice(maxLength);
        }

        wrappedLines.push(remaining);
    }

const lines = wrappedLines;

    const widths = lines.map(stringWidth);
    const boxLength = Math.max(...widths, 0) + 2;

    const topString = "╭" + "─".repeat(boxLength) + "╮";

    const textString = lines
        .map((line, i) => {
            const padding = boxLength - widths[i] - 2;
            return `│ ${line}${" ".repeat(Math.max(0, padding))} │`;
        })
        .join("\n");

    const bottomString = "╰" + "─".repeat(boxLength) + "╯";

    return `${topString}\n${textString}\n${bottomString}`;
}

/**
 * This is a (slightly modified) AI generated (!) helper function to read json data from a file. 
 */
async function readJSON(filepath) {
    try {
        // Read the file as a UTF-8 string
        const rawData = await fs.readFile(filepath, 'utf8');

        // Parse string to JavaScript object
        const jsonData = JSON.parse(rawData);


        if (jsonData) {
            return jsonData;
        }
        return {};

    } catch (error) {
        console.error('Error reading or parsing file:', error);
        return {};
    }
}
async function writeJSON(filepath, object) {
    try {
        await fs.writeFile(filepath, JSON.stringify(object, null, 4));
    } catch (error) {
        console.error('Error writing to file:', error);
        return;
    }
}

async function logToFile(logName, message) {
    await fs.appendFile(
        `logs/${logName}.log`,
        message
    );
}

export { box, readJSON, writeJSON, logToFile };