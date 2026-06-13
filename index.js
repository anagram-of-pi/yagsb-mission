require("dotenv").config();

const { App } = require("@slack/bolt");
const axios = require("axios");

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    appToken: process.env.SLACK_APP_TOKEN,
    socketMode: true
});

app.command("/pi-bot-help", async ({ ack, respond }) => {
    await ack();
    
    await respond({
    text:
    `Available Commands:
    /pi-bot-help - Show this message
    /pi-bot - Talk to the bot`
    });
});

app.command("/pi-bot", async ({ command, ack, respond }) => {
    const start = Date.now();
    await ack();
    const latency = Date.now() - start;
    
    await respond({ text: `Here in ${latency}ms!` });
});

app.command("/pi-chart", async ({ command, ack, respond }) => {
    await ack();
    
    await respond({ text: "This command is not finished yet! Check back later." })
});


(async () => {
    await app.start();
    console.log("Bot is running!");
})();
