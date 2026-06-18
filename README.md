# Almanac Bot

A Slack bot I made that sends a daily collection of cool information right into your workspace. Every digest includes a word of the day, a fun fact, something that happened on this day in history, and a quote.

> ![Project Screenshot](images/screenshot.png)

![TRY IT HERE](http://app.slack.com/client/E09V59WQY1E/C0BBD17T3QB)

## Quick Start

To try it out, install the Slack app using the link above and run:

`/almanac-today`

That's all

## Features

* **Daily Digest** - Get everything in one command with `/almanac-today`
* **Word of the Day** - Learn a new word, its definition, part of speech, and an example sentence
* **Fact of the Day** - Get a random fact every day
* **On This Day** - See historical events that happened today
* **Quote of the Day** - Read a quote from a notable person

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

Almanac Bot is built using Node.js and Slack Bolt in Socket Mode. This lets the bot connect directly to Slack without needing a public server or tools like ngrok, which makes development much easier.

While building the project, one of the biggest challenges was making sure the bot responded quickly and reliably. Earlier versions used several different APIs, which sometimes caused delays or timeouts. To fix this, I simplified some features and separated each API request into its own error-handling block. If one API fails, the bot still sends the rest of the digest instead of crashing.

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

This project helped me learn more about working with APIs, handling errors, building Slack applications, and making software more reliable. It also gave me experience designing a project that combines data from multiple sources into a single response.
