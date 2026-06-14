import "dotenv/config";

import axios from "axios";
import fs from "fs/promises";
import { App } from "@slack/bolt";

import { box } from "./utils.js";
import { checkFirstLetters } from "./checkPatterns.js";

/**
 * This is a (slightly modified) AI generated (!) helper function to read json data from a file. 
 */
async function readJSON(filepath) {
    try {
        // Read the file as a UTF-8 string
        const rawData = await fs.readFile(filepath, 'utf8');

        // Parse string to JavaScript object
        const jsonData = JSON.parse(rawData);

        return jsonData;
    } catch (error) {
        console.error('Error reading or parsing file:', error);
        return;
    }
}


const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    appToken: process.env.SLACK_APP_TOKEN,
    socketMode: true
});

app.error((error) => {
    console.error(error.message);
});

function parseCommandText(command) {
    try {
        return command.text.split(" ");
    } catch (error) {
        console.log(`parseCommandText failed due to ${error}. Command: \n\`\`\`${command}\`\`\``);
        return [];
    }
}




// --- All slash commands ---

app.command("/pi-bot-help", async ({ ack, respond }) => {
    await ack();
    await respond(await readJSON("./responses/helpGeneral.json"));
});

app.command("/pi-bot", async ({ command, ack, respond }) => {
    const start = Date.now();
    await ack();
    const latency = Date.now() - start;
    
    await respond({ text: `Here in ${latency}ms!` });
});

app.command("/pi-chart", async ({ command, ack, respond }) => {
    await ack();
    
    const params = parseCommandText(command);
    
    console.log(params);
    
    const validChartTypes = {"bvg": "Vertical Bar", "lc": "Line", "p": "Pie", "pc": "Concentric Pie", "p3": "3d Pie", "pd": "Donut Pie", "pa": "Polar", "r": "Radar", "bb": "Bubble", "gv": "GraphViz", "qr": "QR Code", "": "", "": ""};
    const validEasing = ["easeInQuad", "easeOutQuad", "easeInOutQuad", "easeInCubic", "easeOutCubic", "easeInOutCubic", "easeInQuart", "easeOutQuart", "easeInOutQuart", "easeInQuint", "easeOutQuint", "easeInOutQuint", "easeInSine", "easeOutSine", "easeInOutSine", "easeInExpo", "easeOutExpo", "easeInOutExpo", "easeInCirc", "easeOutCirc", "easeInOutCirc", "easeInElastic", "easeOutElastic", "easeInOutElastic", "easeInBack", "easeOutBack", "easeInOutBack", "easeInBounce", "easeOutBounce", "easeInOutBounce"];
    
    // Define params for chart API
    let endpoint = "/chart";
    let chartType = ""; // bvg, lc, 
    let animationDuration_ms = 1000; // Between 10 and 1500
    let animationEasing = "easeInQuad"; // 
    let cornerRadius = 0;
    let lineRemoveAxis = false; // :nda option
    
    await respond({ text: "This command is not finished yet! Check back later." })
});




// --- All messages to respond to ---
// app.message('goodbye', async ({ say }) => {
//     const responses = ['Adios', 'Au revoir', 'Farewell'];
//     const parting = responses[Math.floor(Math.random() * responses.length)];
//     await say(`${parting}!`);
// });
app.event("message", async ({ event, client }) => {
    if (!event.text) return;
    if (event.bot_id || event.subtype) return; // Ignore bot/system messages
    
    console.log(event.text)
    let acronymMatches = await checkFirstLetters(event.text);
    
    if (acronymMatches) {
        console.log(box(acronymMatches));

        try {
            const info = await client.conversations.info({
                channel: event.channel
            });

            console.log(`Sending "${acronymMatches}" in ${info.channel?.is_im ? "DM" : `#${info.channel?.name}`}...`)
            await client.chat.postMessage({
                channel: event.channel,
                thread_ts: event.thread_ts || event.ts,
                text: `Hey, that spells ${acronymMatches}!`,
            });
            
            console.log(`Sent "${acronymMatches}" in ${info.channel?.is_im ? "DM" : `#${info.channel?.name}`}!`)

            await fs.appendFile(
                "events.log",
                `<log>[${acronymMatches}] to ${info.channel?.is_im ? "DM" : `#${info.channel?.name}`} from message ${event.text}</log>`
            );

        } catch (err) {
            console.dir(err, { depth: null });

            await fs.appendFile(
                "errors.log",
                `<err>${err} - Message: ${event.text}</err>`
            );
        }
    }
});



// --- All action responses ---
app.action("morehelp_help", async ({ ack, body }) => {
    await ack();
    const response = await fetch(body.response_url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            replace_original: true,
            blocks: (await readJSON("./responses/helpGeneral.json")).blocks
        })
    });
});
app.action("morehelp_pi-bot", async ({ ack, body, client }) => {
    await ack();
    const response = await fetch(body.response_url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            replace_original: true,
            blocks: (await readJSON("./responses/helpGeneral.json")).blocks
        })
    });
});
app.action("morehelp_chart", async ({ ack, body, client }) => {
    await ack();
    const response = await fetch(body.response_url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            replace_original: true,
            blocks: (await readJSON("./responses/helpChart.json")).blocks
        })
    });
});


(async () => {
    await app.start();
    console.log(box("Bot is running!"));
})();
