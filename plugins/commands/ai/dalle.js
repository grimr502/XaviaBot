import axios from 'axios';
import fs from 'fs';
import path from 'path';

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

const config = {
  name: 'dalle',
  aliases: [],
  description: 'Generate images using DALL-E model',
  usage: '[images of a duck -3], [a kitten]',
  cooldown: 3,
  permissions: [0, 1, 2],
  credits: 'Yan Maglinte',
  extra: {
    apiKey: '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', // Insert your OpenAI API key here
  },
};

const langData = {
  en_US: {
    missingInput: 'Please provide a prompt to initiate the command❗',
    generating: '⌛ Generating {prompt}, please wait...',
    error: '⚠️ Something went wrong. Please try again.',
    imageError: '⚠️ Failed to generate the image. Please try again.',
  },
};

let memory = {};

async function onLoad({ extra }) {
  global.apiKey = extra.apiKey;
}

async function onCall({ message, args, getLang }) {
  const apiUrl = 'http://main.yanmaglinte.repl.co/api/dalle';
  const prompt = args.join(' ');
  if (!prompt) {
    return message.reply(getLang('missingInput'));
  }

  message.reply(getLang('generating', { prompt }));
  message.react('⌛');

  const requestData = {
    prompt: prompt,
    apiKey: global.apiKey,
  };

  try {
    const response = await axios.post(apiUrl, requestData);
    const imageUrls = response.data.data.map((item) => item.url);

    for (const imageUrl of imageUrls) {
      const imagePath = path.join(__dirname, 'cache', 'dalle', '1.jpg');
      const imageDirectory = path.dirname(imagePath);

      if (!fs.existsSync(imageDirectory)) {
        fs.mkdirSync(imageDirectory, { recursive: true });
      }

      try {
        const { data } = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        fs.writeFileSync(imagePath, Buffer.from(data, 'binary'));

        const imageAttachment = fs.createReadStream(imagePath);
        message.reply({ attachment: imageAttachment });
        message.react('✅');
      } catch (error) {
        console.error('Image Error:', error);
        message.reply(getLang('imageError'));
        message.react('❌');
      }
    }
  } catch (error) {
    console.error('API Error:', error);
    message.reply(getLang('error'));
    message.react('❌');
  }
}

export default {
  config,
  onLoad,
  langData,
  onCall,
};
