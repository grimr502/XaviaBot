import axios from 'axios';

const config = {
  credits: 'Noah & Hussain',
  nsfw: true
};

const onCall = async ({ message }) => {
  try {
    const { data } = await axios.get('https://api.waifu.im/search/', {
      params: {
        included_tags: 'milf',
      },
    });

    const image = data.images[0];

    message.reply({
      body: image.url,
      attachment: (await axios.get(image.url, { responseType: 'stream' })).data,
    });
  } catch (error) {
    console.error(error);
    message.reply('Error!');
  }
};

export default {
  config,
  onCall,
};