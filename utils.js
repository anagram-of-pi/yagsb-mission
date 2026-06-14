import stringWidth from "string-width";

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

export { box };