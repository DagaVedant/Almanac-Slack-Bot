# Almanac Bot
![logo](images/logo.png)

A Slack bot I made that drops a daily batch of cool info right into your workspace. Every digest has a word of the day, a fun fact, something that happened on this day in history, and a quote.

![Project Screenshot](images/screenshot.png)

[TRY IT HERE](http://app.slack.com/client/E09V59WQY1E/C0BBD17T3QB)

## Quick Start
Install the Slack app with the link above and run:

`/almanac-today`

That's it.

## Features
* **Daily Digest** - Everything in one command with `/almanac-today`
* **Word of the Day** - A new word with its definition, part of speech, and an example sentence
* **Fact of the Day** - A random fact every day
* **On This Day** - Historical events that happened today
* **Quote of the Day** - A quote from someone notable

## Running Locally
### Prerequisites
* Node.js (v18+)
* npm

### 1. Clone the Repository
```bash
git clone https://github.com/DagaVedant/Almanac-Slack-Bot.git
cd Almanac-Slack-Bot
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the project folder and add your Slack credentials:
```env
SLACK_BOT_TOKEN=xoxb-your-bot-token
SLACK_APP_TOKEN=xapp-your-app-token
```

### 3. Start the Bot
```bash
node index.js
```

## How It Works
Almanac Bot is built with Node.js and Slack Bolt in Socket Mode. This lets it connect straight to Slack without needing a public server or something like ngrok, which makes development a lot easier.

The biggest challenge while building it was getting the bot to respond quickly and reliably. Earlier versions used a bunch of different APIs, which sometimes caused delays or timeouts. To fix that I cut some of the features down and put each API request in its own error-handling block. That way if one API fails, the bot still sends the rest of the digest instead of crashing.

## Tech Stack
* Node.js
* Slack Bolt for JavaScript
* Axios

## APIs Used
* Free Dictionary API
* Useless Facts API
* Wikipedia REST API
* ZenQuotes API

## What I Learned
Building this taught me a lot about working with APIs, handling errors, putting together Slack apps, and making software more reliable. I also got some experience designing a project that pulls data from a few different sources and puts it together into one response.
