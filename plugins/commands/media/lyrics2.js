const config = {
  name: "lyrics2",
  versions: "1.0.0",
  description: "Search lyrics of a song.",
  usage: "[song name]",
  version: "1.0.0",
  cooldown: 5,
  credits: "Dymyrius"
};

const langData = {
  "en_US": {
    "missingInput": "Please enter the name of a song",
    "notFound": "Song not found",
    "results": "𝗧𝗶𝘁𝗹𝗲: {title}\n━━━━━━━━━━━━━━━\n𝗔𝗿𝘁𝗶𝘀𝘁: {artist}\n━━━━━━━━━━━━━━━\n𝗟𝘆𝗿𝗶𝗰𝘀: \n\n{lyrics}", // Modified line
    "error": "An error occurred!"
  },
};

async function onCall({ message, args, getLang }) {
  try {
    let input = args.join(" ");
    if (!input) return message.reply(getLang("missingInput"));  
    const res = await global.GET(`https://api.popcat.xyz/lyrics?song=${input}`);
    const songData = res.data;
    if (!songData) return message.reply(getLang("notFound"));
    let imgStream = await global.getStream(songData.image);
    return message.reply({
        body: getLang("results", {
                title: songData.title,
                artist: songData.artist,
                lyrics: songData.lyrics,
          }),
        attachment: imgStream    
    });
  } catch (e) {
    console.error(e);
    message.reply(getLang("error"));
  }
}

export default {
  config,
  langData,
  onCall
}