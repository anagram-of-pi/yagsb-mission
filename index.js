import "dotenv/config";

import axios from "axios";
import fs from "fs/promises";
import { parseArgs } from 'node:util';
import { App } from "@slack/bolt";

import { box, readJSON, writeJSON, logToFile } from "./utils.js";
import { checkFirstLetters } from "./checkPatterns.js";
import strict from "node:assert/strict";

/**
 * This is an AI generated (!) helper function to extract the ID from escaped name, e.g. #general, @pi. 
 */
function extractSlackId(text) {
    const match = String(text).trim().match(/^<([#@])([A-Z0-9]+)(?:\|[^>]+)?>$/i);
    if (match) {
        return match[2];
    }

    const plainMatch = String(text).trim().match(/^([CUWGD][A-Z0-9]+)$/i);
    if (plainMatch) {
        return plainMatch[1];
    }

    return null;
}

async function disableId(id) {
    console.log(box(`DISABLING FOR "${id}"`));

    let channelSettings = await readJSON("./config/channelSettings.json");
    channelSettings[id] = "disabled";
    writeJSON("./config/channelSettings.json", channelSettings);
}
async function enableId(id) {
    console.log(box(`ENABLING FOR "${id}"`));

    let channelSettings = await readJSON("./config/channelSettings.json");
    channelSettings[id] = "enabled";
    writeJSON("./config/channelSettings.json", channelSettings);
}
async function isEnabled(id, strict=true) {
    let channelSettings = await readJSON("./config/channelSettings.json");

    if (channelSettings[id]) {
        return channelSettings[id] == "enabled";
    } else {
        return !strict;
    }
}

function parseCommandText(command, config) {
    try {
        const args = command.split(/\s+/).filter(item => item !== "");
        const { values, positionals } = parseArgs({ args, ...config });

        return { values, positionals };

    } catch (error) {
        console.error(`Error: ${error.message}`);
        logToFile(
            "pi-bot", 
            `<err>${error}</err>\n`
        )
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





// --- All slash commands ---

app.command("/pi-bot-help", async ({ ack, respond }) => {
    await ack();
    await respond(await readJSON("./responses/helpGeneral.json"));
});

app.command("/pi-bot", async ({ command, ack, respond }) => {
    await ack();
    try {
        const config = await readJSON("./config/pi-bot.json");
        const { values, positionals } = parseCommandText(command.text, config);

        if (values["disable-here"]) {
            const channelId = extractSlackId(command.channel_id);
            await disableId(channelId);
            await respond({ text: `π has been disabled.` });
            await logToFile(
                "pi-bot",
                `<disable>π disabled in ${channelId}</disable>\n`
            )
        }
        if (values["disable-channel"] !== "") {
            const channelId = extractSlackId(values["disable-channel"]);
            await disableId(channelId);
            await respond({ text: `π has been disabled.` });
            await logToFile(
                "pi-bot",
                `<disable>π disabled in ${channelId}</disable>\n`
            )
        }
        if (values["disable-me"]) {
            const userId = extractSlackId(command.user_id);
            await disableId(userId);
            await respond({ text: `π has been disabled.` });
            await logToFile(
                "pi-bot",
                `<disable>π disabled for user ${userId}</disable>\n`
            )
        }
        
        if (values["enable-here"]) {
            const channelId = extractSlackId(command.channel_id);
            await enableId(channelId);
            await respond({ text: `π has been enabled!` });
            await logToFile(
                "pi-bot",
                `<enable>π enabled in ${channelId}</enable>\n`
            )
        }
        if (values["enable-channel"] !== "") {
            const channelId = extractSlackId(values["disable-channel"]);
            await enableId(channelId);
            await respond({ text: `π has been enabled!` });
            await logToFile(
                "pi-bot",
                `<enable>π enabled in ${channelId}</enable>\n`
            )
        }
        if (values["enable-me"]) {
            const userId = extractSlackId(command.user_id);
            await enableId(userId);
            await respond({ text: `π has been enabled!` });
            await logToFile(
                "pi-bot",
                `<enable>π enabled for user ${userId}</enable>\n`
            )
        }
        
        if (values["log"] !== "") {
            await logToFile(
                "report",
                `<user>${values["log"]}</user>\n`
            )
        }
    } catch (error) {
        await respond({ text: `Something has gone wrong. Try again?\n\nIf the issue continues, try \`/pi-bot --log <issue description>\`` });
        await logToFile(
            "pi-bot",
            `<err>${error}</err>\n`
        )
    } 
});

app.command("/pi-chart", async ({ command, ack, respond }) => {
    await ack();
    
    const config = await readJSON("./config/pi-bot.json");
    const { values, positionals } = parseCommandText(command.text, config);
    
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




// --- All events to respond to ---
// app.message('goodbye', async ({ say }) => {
//     const responses = ['Adios', 'Au revoir', 'Farewell'];
//     const parting = responses[Math.floor(Math.random() * responses.length)];
//     await say(`${parting}!`);
// });

app.event("reaction_added", async ({ event, client }) => {
    if (event.item.type !== "message") return;
    console.log(box(event.reaction))
    if (event.reaction !== "upvote4") return;
    if (event.user === "U0BB4TY5X6C") return;
    
    try {
        console.log("\n\tUpvoting!\n\n\n")
        await client.conversations.join({ channel: event.item.channel });
        await client.reactions.add({
            channel: event.item.channel,
            timestamp: event.item.ts,
            name: "upvote"
        });
    } catch (error) {
        console.error(error);
        logToFile(
            "upvote",
            `<err>${error}</err>`
        )
    }
});

app.event("message", async ({ event, client }) => {
    if (!event.text) return;
    if (event.bot_id || event.subtype) return; // Ignore bot/system messages
    
    console.log(event.text)
    let acronymMatches = await checkFirstLetters(event.text);
    
    if (acronymMatches) {
        console.log(box(acronymMatches));
        // if (acronymMatches !== "TESTING") return;

        try {
            const info = await client.conversations.info({
                channel: event.channel
            });

            let shouldFire = await isEnabled(event.channel, strict=true) && await isEnabled(event.user_id, strict=false);

            if (shouldFire) {
                let botResponse = await readJSON("./responses/acronym.json");
                botResponse.blocks[0].text.text = `Hey, that spells ${acronymMatches}!`

                console.log(`Sending "${acronymMatches}" in ${info.channel?.is_im ? "DM" : `#${info.channel?.name}`}...`)
                await client.chat.postMessage({
                    channel: event.channel,
                    thread_ts: event.thread_ts || event.ts,
                    text: `Hey, that spells ${acronymMatches}!\n\n(You can disable π in this channel with \`\`\`/pi-bot --disable\`\`\`)`,
                    blocks: botResponse.blocks
                });
                console.log(`Sent "${acronymMatches}" in ${info.channel?.is_im ? "DM" : `#${info.channel?.name}`}!`)

                await logToFile(
                    "acronyms",
                    `<log>[${acronymMatches}] to ${info.channel?.is_im ? "DM" : `#${info.channel?.name}`} from message ${event.text}</log>\n`
                );
            } else {
                console.log("Not enabled.")
            }

        } catch (err) {
            console.dir(err, { depth: null });

            await logToFile(
                "acronyms",
                `<err>${err} - Message: ${event.text}</err>\n`
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

app.action("disableinchannel", async ({ ack, body, client }) => {
    await ack();
    try {
        const channelId = body.container.channel_id;
        await disableId(channelId);
        
        const response = await fetch(body.response_url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                replace_original: true,
                text: "π has been disabled in this channel."
            })
        });
    } catch (error) {
        
    }
});


(async () => {
    await app.start();
    console.log(box("Bot is running!"));
})();