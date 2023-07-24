import * as fs from 'fs';
import * as google from "googlethis";
import cloudscraper from 'cloudscraper';

const config = {
  name: "imagesearch",
  aliases: ["img"],
  version: "1.2.0",
  description: "Search for images",
  usage: "[search query]",
  cooldown: 5,
  permissions: [0, 1, 2],
  credits: "TakiUWU && Isai",
  dependencies: [
    "axios",
    "fs-extra",
    "googlethis",
    "cloudscraper"
  ]
};

const cost = BigInt(100); // add a cost of 1000 XC
const blacklist = ["100044715559991"]; // add blacklist IDs here

async function onCall({ message, args }) {
  const { senderID, reply } = message;

  // Check if sender is blacklisted
  if (blacklist.includes(senderID)) {
    return reply("You are blacklisted from using this command.");
  }

  try {
   
 // here   
    const { Users } = global.controllers;
    const senderMoney = await Users.getMoney(senderID);
    if (senderMoney == null || BigInt(senderMoney) < cost) {
      return reply(`Not enough money, you need ${cost} XC to use the command.`);
    }

    await Users.decreaseMoney(senderID, cost);
 // here

    
    let query = args.join(" ");
    if (!query) return message.reply("Search terms must be entered. 🔍");

    message.reply(`🌐 Trying to find "${query}"...`);

    let result = await google.image(query, { safe: false });
    if (result.length === 0) return message.reply(`No results found for "${query}".`);

    let streams = [];
    let counter = 0;
    let links = [];

    for (let image of result) {
      // Only show 12 images
      if (counter >= 12) break;

      // Ignore urls that does not ends with .jpg or .png
      let url = image.url;
      if (!url.endsWith(".jpg") && !url.endsWith(".png") && !url.endsWith(". webp") && !url.endsWith(".jpeg")) continue;

      if (links.includes(url)) continue;

      let path = `plugins/commands/cache/search-image-${counter}.jpg`;
      let hasError = false;
      await cloudscraper.get({ uri: url, encoding: null })
        .then((buffer) => fs.writeFileSync(path, buffer))
        .catch((error) => {
          console.log(error)
          hasError = true;
        });

      if (hasError) continue;

      streams.push(fs.createReadStream(path).on("end", async () => {
        if (fs.existsSync(path)) fs.unlink(path, (err) => { if (err) console.log(err); });
      }));

      links.push(url);
      counter += 1;
    }

    let msg = {
      body: `Results for "${query}".\n\nReact "👍" to get more results.`,
      attachment: streams
    };

    message.reply(msg)
      .then(async (msg) => {
        let additionalCounter = 0;
        let reactionCallback = async () => {
          // Add more images when the user reacts with a thumbs up
          let additionalImages = await google.image(query, { safe: false, page: additionalCounter + 2 });
          let newStreams = [];
          let newLinks = [];
          for (let image of additionalImages) {
            // Only show 12 additional images
            if (newStreams.length >= 12) break;

            // Ignore urls that does not ends with .jpg or .png
            let url = image.url;
            if (!url.endsWith(".jpg") && !url.endsWith(".png") && !url.endsWith(". webp") && !url.endsWith(".jpeg")) continue;

            if (links.includes(url) || newLinks.includes(url)) continue;

            let path = `plugins/commands/cache/search-image-${counter + additionalCounter}.jpg`;
            let hasError = false;
            await cloudscraper.get({ uri: url, encoding: null })
              .then((buffer) => fs.writeFileSync(path, buffer))
              .catch((error) => {
                console.log(error)
                hasError = true;
              });

            if (hasError) continue;

            newStreams.push(fs.createReadStream(path).on("end", async () => {
              if (fs.existsSync(path)) fs.unlink(path, (err) => { if (err) console.log(err); });
            }));

            newLinks.push(url);
            additionalCounter += 1;
          }

          if (newStreams.length > 0) {
            let msgBody = `Results for "${query}".\n\nReact "👍" to get more results.`;
            let newMsg = { body: msgBody, attachment: newStreams };

            message.reply(newMsg)
              .then(_ => {
                links = links.concat(newLinks);
                if (newStreams.length >= 12) {
                  _.addReactEvent({ reaction: "👍", callback: reactionCallback });
                } else {
                  _.addReactEvent({ reaction: "❌", callback: () => message.reply("No more images to show.") });
                }
              })
              .catch(e => { if (e.message) return message.reply("An error occurred while trying to show more images."); });
          } else {
            message.reply("No more images to show.");
          }
        };

        if (result.length > 12) {
          msg.addReactEvent({ reaction: "👍", callback: reactionCallback });
        }
      })
      .catch(e => { if (e.message) return message.reply("An error occurred while trying to show the images."); });
  } catch (e) {
    console.log(e);
    message.reply("An error occurred while trying to search for images.");
  }
}

export { config, onCall };