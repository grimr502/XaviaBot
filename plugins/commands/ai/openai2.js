import { Configuration, OpenAIApi } from "openai";
import axios from "axios";

const config = {
  name: "orph2",
  aliases: ["orphues2"],
  description: "Interact with AI (GPT 3)",
  usage: "[ask]",
  cooldown: 3,
  permissions: [0, 1, 2],
  isAbsolute: false,
  isHidden: false,
  credits: "Sies",
};

const langData = {
  "vi_VN": {
    "ai.error": "Xin lũi, đang có trục chặc tý:((",
  },
  "en_US": {
    "ai.error": "Sorry, there was an error processing your request.",
  }
};

async function onCall({ message, args, getLang, extra, data }) {
  try {
    const { threadID, messageID, send, reply, react } = message;
    const ans = args.join(" ");
    message.react("⌛"); // React with a loading emoji

    const configuration = new Configuration({
      apiKey: "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",
      organization: "org-i420aJyNw3TD7aELnxji9sMI"
    });

    const openai = new OpenAIApi(configuration);
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: `${ans}` }],
      max_tokens: 4000,
    });

    const response = completion.data.choices[0].message.content;
    message.react("✅"); // React with a success emoji
    message.reply(response); // Reply with the generated response
  } catch (e) {
    console.error(e);
    message.react("❌"); // React with an error emoji
    message.reply(getLang("ai.error") + e); // Reply with an error message
  }
}

export default {
  config,
  onCall
};
