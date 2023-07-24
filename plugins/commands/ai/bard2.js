import fetch from "node-fetch";

const config = {
  name: "bard2",
  aliases: [],
  description: "Get a response from the Google chatbot",
  usage: "ask {query}",
  cooldown: 5,
  permissions: [0],
  credits: "Cyrus",
  extra: {}
};

const langData = {
  "en_US": {
    "error": "An error occurred while fetching the response. Please try again later.",
    "processing": "⏳ Please wait...",
  }
};

const threadCooldowns = {};

let apikey;

async function fetchApiKey() {
  const response = await fetch("https://pastebin.com/raw/KYc1ZTvx");
  apikey = await response.text();
}

fetchApiKey();

async function onCall({ message, getLang, args }) {
  const threadID = message.threadID;

  if (threadCooldowns[threadID] && threadCooldowns[threadID] > Date.now()) {
    const remainingSeconds = Math.ceil((threadCooldowns[threadID] - Date.now()) / 1000);
    message.reply(`⌛ This command is on cooldown for ${remainingSeconds} more second(s) in this thread.`);
    return;
  }

  threadCooldowns[threadID] = Date.now() + 20 * 1000;
  
  try {
    const query = encodeURIComponent(args.join(' '));
    message.reply(getLang("processing"));
    const response = await fetch(`https://api4free.kenliejugarap.com/cyrusbardapi?question=${query}`);
    const data = await response.json();
    const content = data.response;
    message.reply(`💬 ${content}\n\n🤖 Bot by Cyrus. Do not spam!`);
  } catch (err) {
    console.error(err);
    message.reply(getLang("error"));
  }
}

export default {
  config,
  langData,
  onCall
};