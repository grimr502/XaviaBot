import google from 'googlethis';

const config = {
  name: "lyrics",
  aliases: ["lyc", "lyric", "liric"],
  version: "1.1.0",
  description: "Find lyrics of a song",
  usage: "[Song Name]",
  cooldown: 3,
  permissions: [0, 1, 2],
  credits: "Isai Ivanov",
  dependencies: ["googlethis"]

}

async function onCall({ message, args }) {
    let songName = args.join(" ");
    const options = {
    page: 0, 
    safe: false, // Safe Search
    parse_ads: false, // If set to true sponsored results will be parsed
    additional_params: { 
      // add additional parameters here, see https://moz.com/blog/the-ultimate-guide-to-the-google-search-parameters and https://www.seoquake.com/blog/google-search-param/
      hl: 'en' 
    }
  }
    const response = await google.search(`${songName} lyrics`, options);
    const sdata = response.knowledge_panel;
    if (!sdata.lyrics) return message.reply("No results found!");
    message.reply(sdata.lyrics); 
}

export default {
  config,
  onCall,
};