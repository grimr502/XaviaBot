import fs from 'fs';
import axios from 'axios';
import { join } from 'path';

const config = {
  name: "chicken",
  aliases: ["chick"],
  description: "Buy and fight chickens",
  usage: "<buy/bet/menu/challenge>",
  cooldown: 6,
  credits: "Dymyrius"
};

const langData = {
  "en_US": {
    "chicken.buySuccess": "𝚈𝚘𝚞 𝚑𝚊𝚟𝚎 𝚜𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢 𝚋𝚘𝚞𝚐𝚑𝚝 𝚊 𝚌𝚑𝚒𝚌𝚔𝚎𝚗! 🐓",
    "chicken.buyFailure": "𝚈𝚘𝚞 𝚊𝚕𝚛𝚎𝚊𝚍𝚢 𝚑𝚊𝚟𝚎 𝚊 🐓.",
    "chicken.noChicken": "𝚈𝚘𝚞 𝚍𝚘𝚗'𝚝 𝚑𝚊𝚟𝚎 𝚊 🐓. 𝚄𝚜𝚎 `𝚌𝚑𝚒𝚌𝚔𝚎𝚗 𝚋𝚞𝚢` 𝚝𝚘 𝚐𝚎𝚝 𝚘𝚗𝚎.",
    "chicken.betAmountInvalid": "𝙸𝚗𝚟𝚊𝚕𝚒𝚍 𝚋𝚎𝚝 𝚊𝚖𝚘𝚞𝚗𝚝. 𝙿𝚕𝚎𝚊𝚜𝚎 𝚙𝚛𝚘𝚟𝚒𝚍𝚎 𝚊 𝚟𝚊𝚕𝚒𝚍 𝚗𝚞𝚖𝚋𝚎𝚛.",
    "chicken.betInsufficientBalance": "𝚈𝚘𝚞 𝚍𝚘𝚗'𝚝 𝚑𝚊𝚟𝚎 𝚎𝚗𝚘𝚞𝚐𝚑 𝚋𝚊𝚕𝚊𝚗𝚌𝚎 𝚝𝚘 𝚙𝚕𝚊𝚌𝚎 𝚝𝚑𝚊𝚝 𝚋𝚎𝚝.",
    "chicken.betResultWin": "『𝙲𝚘𝚗𝚐𝚛𝚊𝚝𝚞𝚕𝚊𝚝𝚒𝚘𝚗𝚜! 𝚈𝚘𝚞𝚛 𝚌𝚑𝚒𝚌𝚔𝚎𝚗 𝚠𝚘𝚗 𝚝𝚑𝚎 𝚏𝚒𝚐𝚑𝚝 𝚊𝚐𝚊𝚒𝚗𝚜𝚝 {opponentName}.』\n― 𝚈𝚘𝚞 𝚠𝚘𝚗 ${amount}. 💵",
    "chicken.betResultLoss": "『𝚈𝚘𝚞𝚛 𝚌𝚑𝚒𝚌𝚔𝚎𝚗 𝚕𝚘𝚜𝚝 𝚝𝚑𝚎 𝚏𝚒𝚐𝚑𝚝 𝚊𝚐𝚊𝚒𝚗𝚜𝚝 {opponentName} 𝚊𝚗𝚍 𝚍𝚒𝚎𝚍. 🪦』\n― 𝚈𝚘𝚞 𝚕𝚘𝚜𝚝 ${amount}. 💸",
    "chicken.menuOptions": "◦❭❯❱【Chicken Game】❰❮❬◦\n\n1. `chicken buy` » Buy a chicken.\n2. `chicken bet <amount>` » Bet on your chicken in a fight.\n3. `chicken challenge @user <amount>` » Challenge another user to a chicken fight."
  },
  // Add translations for other languages if needed
};

let chickenOwners = new Map();
const PATH = join(global.assetsPath, 'chicken_owners.json'); // Specify the path to the chicken_owners.json file

// Load chicken owners from a file
function loadChickenOwners() {
  try {
    const data = fs.readFileSync(PATH, 'utf8');
    chickenOwners = new Map(JSON.parse(data));
  } catch (err) {
    console.error('Failed to load chicken owners:', err);
  }
}

// Save chicken owners to a file
function saveChickenOwners() {
  try {
    const data = JSON.stringify(Array.from(chickenOwners));
    fs.writeFileSync(PATH, data, 'utf8');
  } catch (err) {
    console.error('Failed to save chicken owners:', err);
  }
}

loadChickenOwners();

async function onCall({ message, getLang, args }) {
  const { Users } = global.controllers;
  const chick = (await axios.get("https://i.imgur.com/FXP2nlg.png", {
      responseType: "stream"
    })).data;

  if (!message || !message.body) {
    // Handle the case where the message object or message body is undefined
    console.error('𝙸𝚗𝚟𝚊𝚕𝚒𝚍 𝚖𝚎𝚜𝚜𝚊𝚐𝚎 𝚘𝚋𝚓𝚎𝚌𝚝!');
    return;
  }

  const { senderID, mentions } = message;
  const opponentID = Object.keys(mentions)[0];
  const opponentName = (await global.controllers.Users.getInfo(opponentID))?.name || opponentID;

  if (args.length === 0 || args[0] === "menu") {
    const menuOptions = getLang("chicken.menuOptions");
    return message.reply({
      body: menuOptions,
      attachment: chick});
  }

  if (args[0] === "buy") {
    if (chickenOwners.has(senderID)) {
      return message.reply(getLang("chicken.buyFailure"));
    }

    const chickenPrice = 5000; // Assuming the chicken costs 5000 credits
    const userBalance = await Users.getMoney(senderID);

    if (userBalance < chickenPrice) {
      return message.reply("𝚈𝚘𝚞 𝚍𝚘𝚗'𝚝 𝚑𝚊𝚟𝚎 𝚎𝚗𝚘𝚞𝚐𝚑 𝚋𝚊𝚕𝚊𝚗𝚌𝚎 𝚝𝚘 𝚋𝚞𝚢 𝚊 𝚌𝚑𝚒𝚌𝚔𝚎𝚗.");
    }

    await Users.decreaseMoney(senderID, chickenPrice);
    chickenOwners.set(senderID, { name: message.senderName, isAlive: true });
    saveChickenOwners(); // Save updated chicken owners to the file
    return message.reply(getLang("chicken.buySuccess"));
  }

  if (args[0] === "bet") {
    if (!chickenOwners.has(senderID)) {
      return message.reply(getLang("chicken.noChicken"));
    }

    const betAmount = parseFloat(args.slice(1).join(" "));

    if (isNaN(betAmount)) {
      return message.reply(getLang("chicken.betAmountInvalid"));
    }

    const userBalance = await Users.getMoney(senderID);

    if (betAmount > userBalance) {
      return message.reply(getLang("chicken.betInsufficientBalance"));
    }

    const isWin = Math.random() < 0.4; // Assuming a 40% chance of winning
    const betResult = isWin ? "win" : "loss";
    const betResultMessage = isWin ? getLang("chicken.betResultWin") : getLang("chicken.betResultLoss");
    const winAmount = Math.floor(betAmount); // Assuming the same amount as the bet as winnings

    if (isWin) {
      await Users.increaseMoney(senderID, winAmount);
    } else {
      await Users.decreaseMoney(senderID, betAmount); // Deduct the bet amount on loss
      // Remove chicken ownership if the user loses the game
      chickenOwners.delete(senderID);
      saveChickenOwners(); // Save updated chicken owners to the file
    }

    const roll = (await axios.get("https://i.imgur.com/1KRv1CS.gif", {
      responseType: "stream"
    })).data;

    const checkingMessage = await message.reply(
      {
        body: "𝗖𝗵𝗲𝗰𝗸𝗶𝗻𝗴 𝗿𝗲𝘀𝘂𝗹𝘁𝘀...",
        attachment: roll
      }
    );

    await delay(5000); // Additional delay for suspense (optional)

    await message.reply(betResultMessage.replace("{opponentName}", "the opponent").replace("{amount}", winAmount));

    if (global.api && global.api.unsendMessage) {
      await global.api.unsendMessage(checkingMessage.messageID);
    }

    return; // Prevent displaying the menu after the results
  }

  if (args[0] === "challenge") {
    const opponentChickenOwner = chickenOwners.has(opponentID);

    if (!opponentChickenOwner) {
      return message.reply(`𝚈𝚘𝚞 𝚌𝚊𝚗𝚗𝚘𝚝 𝚌𝚑𝚊𝚕𝚕𝚎𝚗𝚐𝚎 ${opponentName} 𝚠𝚑𝚘 𝚍𝚘𝚎𝚜𝚗'𝚝 𝚑𝚊𝚟𝚎 𝚊 𝚌𝚑𝚒𝚌𝚔𝚎𝚗.`);
    }

    const betAmount = parseInt(args[args.length - 1]);
    if (isNaN(betAmount)) {
      return message.reply(getLang("chicken.betAmountInvalid"));
    }

    const userBalance = await Users.getMoney(senderID);
    const opponentBalance = await Users.getMoney(opponentID);

    if (betAmount > userBalance) {
      return message.reply(getLang("chicken.betInsufficientBalance"));
    }

    if (betAmount > opponentBalance) {
      return message.reply(`${opponentName} 𝚍𝚘𝚎𝚜𝚗'𝚝 𝚑𝚊𝚟𝚎 𝚎𝚗𝚘𝚞𝚐𝚑 𝚋𝚊𝚕𝚊𝚗𝚌𝚎 𝚝𝚘 𝚊𝚌𝚌𝚎𝚙𝚝 𝚢𝚘𝚞𝚛 𝚋𝚎𝚝.`);
    }

    const isWin = Math.random() < 0.4; // Assuming a 40% chance of winning for challenge
    const challengeResult = isWin ? "win" : "loss";
    const challengeResultMessage = isWin ? getLang("chicken.betResultWin") : getLang("chicken.betResultLoss");
    const winAmount = Math.floor(betAmount * 1); // Assuming double the bet amount as winnings

    if (isWin) {
      await Users.increaseMoney(senderID, winAmount);
      await Users.decreaseMoney(opponentID, betAmount);
      chickenOwners.delete(opponentID);
      saveChickenOwners();
    } else {
      await Users.decreaseMoney(senderID, betAmount);
      await Users.increaseMoney(opponentID, winAmount);
      chickenOwners.delete(senderID);
      saveChickenOwners();
    }

    const roll = (await axios.get("https://i.imgur.com/1KRv1CS.gif", {
      responseType: "stream"
    })).data;

    const checkingMessage = await message.reply(
      {
        body: "𝗖𝗵𝗲𝗰𝗸𝗶𝗻𝗴 𝗿𝗲𝘀𝘂𝗹𝘁𝘀...",
        attachment: roll
      }
    );

    await delay(5000); // Additional delay for suspense (optional)

    await message.reply(challengeResultMessage.replace("{opponentName}", `${opponentName}`).replace("{amount}", winAmount));

    if (global.api && global.api.unsendMessage) {
      await global.api.unsendMessage(checkingMessage.messageID);
    }

    return; // Prevent displaying the menu after the challenge
  }

  // If the command is not recognized, show the menu
  const menuOptions = getLang("chicken.menuOptions");
  return message.reply(menuOptions);
}

// Utility function to introduce a delay
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default {
  config,
  langData,
  onCall
};
