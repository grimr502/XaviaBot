import { Configuration, OpenAIApi } from "openai"

const apiKey = "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"

const config = {
  name: "gpt",
  aliases: ["openai"],
  description: "Talk with GPT",
  usage: "text",
  cooldown: 5,
  permissions: [1, 2, 3],
  credits: "ǺᎩᎧᏬᏰ",
  extra: {}
}

const langData = {
  "vi_VN": {
    "openai.needmsg": "bạn cần nhập điều muốn hỏi bot",
    "openai.error": "đã xảy ra lỗi"
  },
  "en_US": {
    "openai.needmsg": "Please provide a message!",
    "openai.error": "Error..."
  }
}

const configuration = new Configuration({ apiKey })
const openai = new OpenAIApi(configuration)

async function onCall({ message, args, getLang, extra, data, userPermissions, prefix }) {

  await message.react("⏳");
  if (!args[0]) return message.reply(getLang("openai.needmsg"))
  try {
    const isImage = args[0].toLowerCase() == "image";
    const prompt = args.join(" ");

    if (isImage) {
      const response = await openai.createImage({
        prompt: prompt.slice(1),
        n: 1,
        size: '512x512',
        response_format: "url"
      })
      if (response.data.data?.[0]?.url) return message.reply({ attachment: await global.getStream(response.data.data[0].url) });
    } else {
      const res = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
      });
      if (res?.data?.choices) {
        await message.react("✅");
        message.reply(res.data.choices[0].message.content);
      }
    }

  } catch (e) {
    message.react("❌").then(message.reply(getLang("openai.error")));
    console.log(e)
  }

}


export default {
  config,
  langData,
  onCall
}