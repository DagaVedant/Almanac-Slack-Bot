const axios = require("axios");
require("dotenv").config();
const { App } = require("@slack/bolt");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true
});

const WORDS = [ 
  "serendipity", "ephemeral", "eloquent", "resilient", "luminous", "ubiquitous", "gregarious", "tenacious", "candor", "lucid", "astute", "nuance", "intricate", "meticulous", "pragmatic", "benevolent", "diligent", "empathy", "fortitude", "gratitude", "humility", "ingenious", "jubilant", "labyrinth", "mellow", "nostalgia", "oblivion", "panacea", "quaint", "radiant", "serene", "tranquil", "upheaval", "venerate", "whimsical", "zeal", "aesthetic", "brevity", "cathartic", "dexterity", "enigma", "fervent", "gusto", "harmony", "idyllic", "juxtapose", "keen", "lavish", "myriad", "novel"
];

app.command("/almanac-wotd", async ({ command, ack, respond }) => {
  await ack();
  const day = Math.floor(Date.now() / 86400000);
  const word = WORDS[day % WORDS.length];
  try {
    const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    const entry = response.data[0];
    const meaning = entry.meanings[0];
    const def = meaning.definitions[0];
    let text = `Word of the Day: ${entry.word}\n(${meaning.partOfSpeech}) ${def.definition}`;
    if (def.example) text += `\nExample: ${def.example}`;
    await respond({ text });
  } catch (err) {
    await respond({ text: "Couldn't grab today's word, try again in a bit." });
  }
});

app.command("/almanac-fotd", async ({ command, ack, respond }) => {
  await ack();
  try {
    const response = await axios.get("https://uselessfacts.jsph.pl/api/v2/facts/today?language=en");
    await respond({ text: `Fact of the Day:\n${response.data.text}` });
  } catch (err) {
    await respond({ text: "Couldn't load a fact right now, oh well." });
  }
});

app.command("/almanac-otd", async ({ command, ack, respond }) => {
  await ack();
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  try {
    const response = await axios.get(`https://en.wikipedia.org/api/rest_v1/feed/onthisday/selected/${month}/${day}`, {
      headers: { "User-Agent": "almanac-bot" }
    });
    const events = response.data.selected.slice(0, 3);
    let text = "On This Day:";
    for (const event of events) text += `\n${event.year} - ${event.text}`;
    await respond({ text });
  } catch (err) {
    await respond({ text: "Couldn't load today's history, try again later." });
  }
});

app.command("/almanac-qotd", async ({ command, ack, respond }) => {
  await ack();
  try {
    const response = await axios.get("https://zenquotes.io/api/today");
    const quote = response.data[0];
    await respond({ text: `Quote of the Day:\n"${quote.q}"\n- ${quote.a}` });
  } catch (err) {
    await respond({ text: "Couldn't load a quote right now." });
  }
});

app.command("/almanac-today", async ({ command, ack, respond }) => {
  await ack();

  const now = new Date();
  const dayTimestamp = Math.floor(Date.now() / 86400000);
  
  const currentMonthNum = now.getMonth() + 1;
  const currentDateNum = now.getDate();

  // 1. Word of the Day
  let word;
  try {
    const w = WORDS[dayTimestamp % WORDS.length];
    const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${w}`, { timeout: 5000 });
    const entry = response.data[0];
    const meaning = entry.meanings[0];
    const def = meaning.definitions[0];
    word = `*Word of the Day:* ${entry.word}\n(${meaning.partOfSpeech}) ${def.definition}`;
    if (def.example) word += `\n_Example:_ ${def.example}`;
  } catch (err) {
    word = "*Word of the Day:* Couldn't grab today's word, try again in a bit.";
  }

  // 2. Fact of the Day
  let fact;
  try {
    const response = await axios.get("https://uselessfacts.jsph.pl/api/v2/facts/today?language=en", { timeout: 5000 });
    fact = `*Fact of the Day:*\n${response.data.text}`;
  } catch (err) {
    fact = "*Fact of the Day:* Couldn't load a fact right now, oh well.";
  }

  // 3. History
  let history;
  try {
    const monthStr = String(currentMonthNum).padStart(2, "0");
    const dateStr = String(currentDateNum).padStart(2, "0");
    const response = await axios.get(`https://en.wikipedia.org/api/rest_v1/feed/onthisday/selected/${monthStr}/${dateStr}`, {
      headers: { "User-Agent": "almanac-bot" },
      timeout: 5000
    });
    
    const events = response.data.selected.slice(0, 5);
    const seenEvents = new Set();
    const uniqueLines = [];

    for (const event of events) {
      const line = `${event.year} - ${event.text}`;
      if (!seenEvents.has(line)) {
        seenEvents.add(line);
        uniqueLines.push(line);
      }
      if (uniqueLines.length === 3) break;
    }

    history = `*On This Day:*\n${uniqueLines.join("\n")}`;
  } catch (err) {
    history = "*On This Day:* Couldn't load today's history, try again later.";
  }

  // 4. Quote of the Day
  let quote;
  try {
    const response = await axios.get("https://zenquotes.io/api/today", { timeout: 5000 });
    const q = response.data[0];
    quote = `*Quote of the Day:*\n"${q.q}"\n- ${q.a}`;
  } catch (err) {
    quote = "*Quote of the Day:* Couldn't load a quote right now.";
  }

  // Combine remaining features cleanly
  await respond({
    text: `${word}\n\n${fact}\n\n${history}\n\n${quote}`
  });
});

app.command("/almanac-help", async ({ command, ack, respond }) => {
  await ack();
  await respond({
    text: `Available Commands:
/almanac-today - The full daily digest
/almanac-wotd - Word of the day
/almanac-fotd - Fact of the day
/almanac-otd - On this day in history
/almanac-qotd - Quote of the day
/almanac-help - This list of commands`
  });
});

(async () => {
  await app.start();
  console.log("Almanac is up and running!");
})();