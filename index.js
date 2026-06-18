const axios = require("axios");

require("dotenv").config();

const { App } = require("@slack/bolt");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true
});

const WORDS = [
  "serendipity", "ephemeral", "eloquent", "resilient", "luminous", "ubiquitous",
  "gregarious", "tenacious", "candor", "lucid", "astute", "nuance", "intricate",
  "meticulous", "pragmatic", "benevolent", "diligent", "empathy", "fortitude",
  "gratitude", "humility", "ingenious", "jubilant", "labyrinth", "mellow",
  "nostalgia", "oblivion", "panacea", "quaint", "radiant", "serene", "tranquil",
  "upheaval", "venerate", "whimsical", "zeal", "aesthetic", "brevity", "cathartic",
  "dexterity", "enigma", "fervent", "gusto", "harmony", "idyllic", "juxtapose",
  "keen", "lavish", "myriad", "novel"
];

const COUNTRIES = [
  "Japan", "Brazil", "Iceland", "Kenya", "Norway", "Peru", "Vietnam", "Morocco",
  "Greece", "Nepal", "Chile", "Finland", "Egypt", "Portugal", "Thailand", "Mexico",
  "Sweden", "India", "Argentina", "Indonesia", "Canada", "Ireland", "Croatia",
  "Austria", "Switzerland", "Colombia", "Philippines", "Poland", "Denmark",
  "Hungary", "Ecuador", "Tanzania", "Jordan", "Malaysia", "Sri Lanka", "Ghana",
  "Bolivia", "Estonia", "Uruguay", "Mongolia"
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
    if (def.example) {
      text += `\nExample: ${def.example}`;
    }

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
    for (const event of events) {
      text += `\n${event.year} - ${event.text}`;
    }

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

app.command("/almanac-numfact", async ({ command, ack, respond }) => {
  await ack();

  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();

  try {
    const response = await axios.get(`http://numbersapi.com/${month}/${day}/date?json`);
    await respond({ text: `Number Fact:\n${response.data.text}` });
  } catch (err) {
    await respond({ text: "Couldn't load a number fact right now." });
  }
});

app.command("/almanac-country", async ({ command, ack, respond }) => {
  await ack();

  const day = Math.floor(Date.now() / 86400000);
  const name = COUNTRIES[day % COUNTRIES.length];

  try {
    const response = await axios.get(`https://restcountries.com/v3.1/name/${encodeURIComponent(name)}?fullText=true`);
    const country = response.data[0];

    const capital = country.capital ? country.capital[0] : "Unknown";
    const region = country.subregion || country.region || "Unknown";
    const population = country.population.toLocaleString("en-US");
    const languages = Object.values(country.languages).join(", ");

    await respond({ text: `Country of the Day: ${country.flag} ${country.name.common}\nCapital: ${capital}\nRegion: ${region}\nPopulation: ${population}\nLanguages: ${languages}` });
  } catch (err) {
    await respond({ text: "Couldn't load today's country, try again later." });
  }
});

app.command("/almanac-today", async ({ command, ack, respond }) => {
  await ack();

  const now = new Date();
  const day = Math.floor(Date.now() / 86400000);

  let word;
  try {
    const w = WORDS[day % WORDS.length];
    const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${w}`);
    const entry = response.data[0];
    const meaning = entry.meanings[0];
    const def = meaning.definitions[0];
    word = `Word of the Day: ${entry.word}\n(${meaning.partOfSpeech}) ${def.definition}`;
    if (def.example) {
      word += `\nExample: ${def.example}`;
    }
  } catch (err) {
    word = "Couldn't grab today's word, try again in a bit.";
  }

  let fact;
  try {
    const response = await axios.get("https://uselessfacts.jsph.pl/api/v2/facts/today?language=en");
    fact = `Fact of the Day:\n${response.data.text}`;
  } catch (err) {
    fact = "Couldn't load a fact right now, oh well.";
  }

  let history;
  try {
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const date = String(now.getDate()).padStart(2, "0");
    const response = await axios.get(`https://en.wikipedia.org/api/rest_v1/feed/onthisday/selected/${month}/${date}`, {
      headers: { "User-Agent": "almanac-bot" }
    });
    const events = response.data.selected.slice(0, 3);
    history = "On This Day:";
    for (const event of events) {
      history += `\n${event.year} - ${event.text}`;
    }
  } catch (err) {
    history = "Couldn't load today's history, try again later.";
  }

  let quote;
  try {
    const response = await axios.get("https://zenquotes.io/api/today");
    const q = response.data[0];
    quote = `Quote of the Day:\n"${q.q}"\n- ${q.a}`;
  } catch (err) {
    quote = "Couldn't load a quote right now.";
  }

  let numberFact;
  try {
    const month = now.getMonth() + 1;
    const date = now.getDate();
    const response = await axios.get(`http://numbersapi.com/${month}/${date}/date?json`);
    numberFact = `Number Fact:\n${response.data.text}`;
  } catch (err) {
    numberFact = "Couldn't load a number fact right now.";
  }

  let country;
  try {
    const name = COUNTRIES[day % COUNTRIES.length];
    const response = await axios.get(`https://restcountries.com/v3.1/name/${encodeURIComponent(name)}?fullText=true`);
    const c = response.data[0];
    const capital = c.capital ? c.capital[0] : "Unknown";
    const region = c.subregion || c.region || "Unknown";
    const population = c.population.toLocaleString("en-US");
    const languages = Object.values(c.languages).join(", ");
    country = `Country of the Day: ${c.flag} ${c.name.common}\nCapital: ${capital}\nRegion: ${region}\nPopulation: ${population}\nLanguages: ${languages}`;
  } catch (err) {
    country = "Couldn't load today's country, try again later.";
  }

  await respond({
    text:
`${word}

${fact}

${history}

${quote}

${numberFact}

${country}`
  });
});

app.command("/almanac-help", async ({ command, ack, respond }) => {
  await ack();

  await respond({
    text:
`Available Commands:
/almanac-today - The full daily digest
/almanac-wotd - Word of the day
/almanac-fotd - Fact of the day
/almanac-otd - On this day in history
/almanac-qotd - Quote of the day
/almanac-numfact - A fact about today's date
/almanac-country - Country of the day
/almanac-help - This list`
  });
});

(async () => {
  await app.start();
  console.log("Almanac is up and running!");
})();