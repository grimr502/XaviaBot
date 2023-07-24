import fs from 'fs-extra';
import axios from 'axios';
import { resolve } from 'path';
const config = {
  name: "screenshot",
  aliases: ["ss"],
  version: "1.1.0",
  description: "Take screenshot of a website",
  usage: "[url]",
  cooldown: 3,
  permissions: [0, 1, 2],
  credits: "Isai Ivanov",
  dependencies: [
    "fs-extra",
    "path",
    "url"
  ]
};

const blockedKeywords = /\b(porn|sex|xxx|xvideos|redtube|pornhub|youporn|xnxx|brazzers|naughtyamerica|hentai|camgirl|livejasmin|chaturbate|bongacams|myfreecams|playboy|bangbros|spankbang|tube8|empflix|beeg|fetlife|xhamster|ashemaletube|clips4sale|dmm.co.jp|dmm.com|evilangel|fakku|hardsextube|hclips|hustler|javhd|jizzhut|keezmovies|lustcinema|mofos|newgrounds|perfectgirls|porndig|realitykings|shooshtime|stufferdb|tnaflix|twistys|upornia|vrporn|wankzvr|x-art|x-cafe|xerotica|xmoviesforyou|xxxdan|yespornplease|yumyumlutube|zbporn|3movs|4tube|8muses|8tube|alohatube|apetube|bestialitysextaboo|bobs-tube|bravotube|cuckporn|dirtyporn|drtuber|empornium|eporner|extremetube|freeones|gayboystube|gayforit|grannyflash|h2porn|hotmovs|justporno|katestube|kindgirls|madthumbs|mangago|maturetube|mylust|nudevista|perfectgirls|pornhd|pornmaki|pornpics|pornrox|pornwhite|qorno|realgfporn|redtube|sextube|spankwire|sunporno|tblop|thisav|thumbzilla|tubepleasure|vporn|watchmygf|wetpussygames|worldsex|xnxx|xvideos|youjizz|youporn|yuvutu|zbporn|xvideo)\b/i;

async function onCall({ message, args }) {
  await message.react("⏳");
  let query = args.join(" ")
  if (blockedKeywords.test(args[0]) || blockedKeywords.test(args[0].toLowerCase())) {
  return message.reply("This URL is blocked.");
}
  const { senderID, threadID } = message;
  let url = "";
  if (query.startsWith("https://")) {
    url = `https://image.thum.io/get/width/1920/crop/400/fullpage/noanimate/${args[0]}`;
  }
  else { url = `https://image.thum.io/get/width/1920/crop/400/fullpage/noanimate/https://${args[0]}` }
  const response = await global.getStream(url);
  const filePath = `./plugins/commands/cache/${senderID}.png`;
  const fileStream = fs.createWriteStream(filePath);
  response.pipe(fileStream);
  await new Promise((resolve) => {
    fileStream.on('finish', resolve);
  });
  try {
    if (blockedKeywords.test(args[0])) {
  return;
}
    const attachment = fs.createReadStream(filePath);
    await message.reply({ body: "", attachment });
    await message.react("✅");
  } catch (e) {
    console.log(e);
    message.react("❌").then(() => message.reply("An error occurred, please try again later!"));
  }
  //   }
  //  catch {
  //      return message.reply("This url is not found, the format is not correct ?");

  //    }
}


export default {
  config,
  onCall,

};