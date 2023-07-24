import axios from "axios";

const config = {
  name: "ai",
  version: "1",
  credits: "Dymyrius",
  description: "ai",
  usage: "[ask]",
  cooldowns: 5,
};

const onCall = async ({ message, args }) => {
  let { threadID, messageID, type, messageReply } = message;

  if (type === "message_reply" && messageReply.attachments[0]?.type === "photo") {
    const attachment = messageReply.attachments[0];
    const imageURL = attachment.url;
    try {
      message.react("⌛");
      const res = await axios.get(`https://api.heckerman06.repl.co/api/other/img2text?input=${encodeURIComponent(imageURL)}`);
      const response = res.data.extractedText;
      const resAI = await axios.get(`https://api.heckerman06.repl.co/api/other/openai-chat?newprompt=${response}`);
      const respondAI = resAI.data.content;
      message.react("✅");
      message.reply(respondAI);
    } catch (error) {
      message.react("❌");
      message.reply("Error occurred while fetching data from the API.");
    }
  } else {
    const response = args.join(" ");
    if (!response) {
      message.reply("Hi! What can I do for you?");
      return;
    }
  
    try {
      message.react("⌛");
      const res = await axios.get(`https://api.heckerman06.repl.co/api/other/openai-chat?newprompt=${response}`);
      const respond = res.data.content;
      message.react("✅");
      message.reply(respond);
    } catch (error) {
      message.react("❌");
      message.reply("Error occurred while fetching data from the Chatgpt API.");
    }
  }
};

export default {
  config,
  onCall,
};