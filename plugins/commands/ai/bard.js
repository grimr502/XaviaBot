import axios from "axios";
import fs from "fs";

const config = {
  name: "bard",
  version: "1",
  credits: "Dymyrius",
  description: "Ask question",
  permissions: [0, 1, 2],
  usage: "[ask]",
  cooldowns: 5,
};

const onLoad = async () => {
  // No specific initialization needed for this code snippet
};

const onCall = async ({ message, args }) => {
  const { threadID, messageID, type, messageReply, body } = message;

  let question = "";

  if (type === "message_reply" && messageReply.attachments[0]?.type === "photo") {
    const attachment = messageReply.attachments[0];
    const imageURL = attachment.url;
    question = await convertImageToText(imageURL);

    if (!question) {
      message.reply("❌ Failed to convert the photo to text. Please try again with a clearer photo.");
      return;
    }
  } else {
    question = body.slice(5).trim();

    if (!question) {
      message.reply("Please provide a question or query");
      return;
    }
  }

  message.react("⏱️");

  try {
    const res = await axios.get(`https://api.heckerman06.repl.co/api/other/bard-ai69?response=${encodeURIComponent(question)}`);
    const respond = res.data.content;
    const respond2 = res.data.content2;

    if (Array.isArray(respond) && respond.length > 0) {
      const photoUrls = respond.map(item => item[0][0]);
      const attachments = [];

      if (!fs.existsSync("cache")) {
        fs.mkdirSync("cache");
      }

      for (let i = 0; i < photoUrls.length; i++) {
        const url = photoUrls[i];
        const photoPath = `cache/cat${i + 1}.png`;

        try {
          const imageResponse = await axios.get(url, { responseType: "arraybuffer" });
          fs.writeFileSync(photoPath, imageResponse.data);

          attachments.push(fs.createReadStream(photoPath));
        } catch (error) {
          console.error("Error occurred while downloading and saving the photo:", error);
        }
      }

      message.react("✅");
      message.reply({
        attachment: attachments,
        body: respond2,
      });
    } else {
      message.reply(respond2);
    }
  } catch (error) {
    console.error("Error occurred while fetching data from the Bard API:", error);
    message.react("❌");
    message.reply("An error occurred while fetching data. Please try again later.");
  }
};

async function convertImageToText(imageURL) {
  const response = await axios.get(`https://api.heckerman06.repl.co/api/other/img2text?input=${encodeURIComponent(imageURL)}`);
  return response.data.extractedText;
}

export default {
  config,
  onLoad,
  onCall,
};