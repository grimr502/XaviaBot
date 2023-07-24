// Import the required modules
import axios from 'axios';

// Configuration for the horse racing game
const config = {
  name: "horse-racing",
  aliases: ["hr"],
  description: "Play horse racing with multiplayer.",
  usage: "Use it then you'll know.",
  cooldown: 3,
  permissions: [0, 1, 2],
  isAbsolute: false,
  isHidden: false,
  credits: "Dymyrius",
};

// Access the global API object
const { api } = global;

// Define the horseImages array outside the onCall function
const horseImages = [
  // URLs of horse images
  // Add or modify horse images as needed
  { number: 1, url: "https://i.imgur.com/I7ZElJ0.png" },
  { number: 2, url: "https://i.imgur.com/cRBu7li.png" },
  { number: 3, url: "https://i.imgur.com/SOaK0P6.png" },
  { number: 4, url: "https://i.imgur.com/NjiaX1B.png" },
  { number: 5, url: "https://i.imgur.com/ZY4m1zd.png" },
  { number: 6, url: "https://i.imgur.com/5F6VC3q.png" },
  { number: 7, url: "https://i.imgur.com/Ff5w1Me.png" },
  { number: 8, url: "https://i.imgur.com/DhEzQp9.png" },
  { number: 9, url: "https://i.imgur.com/F29yd5M.png" },
];

async function startRacingGame(threadID, bcl, message) { // Add the message parameter here
  const horseRaceGif = (await axios.get("https://i.imgur.com/mHdw73G.png", {
    responseType: "stream",
  })).data;

  // Get the number of horses available based on the number of players who joined
  const numberOfPlayers = bcl.players.length;
  const horsesAvailable = Array.from({ length: numberOfPlayers }, (_, index) => index + 1).join(", ");

  api.sendMessage({
    body: `〘𝗛𝗢𝗥𝗦𝗘𝗦 𝗚𝗘𝗧𝗧𝗜𝗡𝗚 𝗥𝗘𝗔𝗗𝗜𝗡𝗚〙\n\nPlease pick a horse number from 1 to 9 by typing the command \`!hr <horse_number>\`.\n𝗛𝗼𝗿𝘀𝗲𝘀 𝗔𝘃𝗮𝗶𝗹𝗮𝗯𝗹𝗲: ${horsesAvailable}`,
    attachment: horseRaceGif,
  }, threadID);

  // Unsend the racing animation and message after 8 seconds
  setTimeout(async () => {
    try {
      const messages = await api.getThreadMessages(threadID);
      const racingMessage = messages.find((msg) => msg.body === message);
      if (racingMessage) {
        await api.unsendMessage(racingMessage.messageID);
      }
    } catch (error) {
      console.error("𝙴𝚛𝚛𝚘𝚛 𝚘𝚌𝚌𝚞𝚛𝚛𝚎𝚍 𝚠𝚑𝚒𝚕𝚎 𝚞𝚗𝚜𝚎𝚗𝚍𝚒𝚗𝚐 𝚝𝚑𝚎 𝚛𝚊𝚌𝚒𝚗𝚐 𝚖𝚎𝚜𝚜𝚊𝚐𝚎:", error.message);
    }
  }, 8000); // 8 seconds
}



// Main function to handle commands
async function onCall({ message, args }) {
  const { Users } = global.controllers;
  global.chanle || (global.chanle = new Map);
  var bcl = global.chanle.get(message.threadID);
  const horseImg = (await axios.get("https://i.imgur.com/lDiULBt.jpg", {
    responseType: "stream"
  })).data;
  const horseCrush = (await axios.get("https://i.imgur.com/thQbSER.gif", {
    responseType: "stream"
  })).data;
  const { senderID, threadID, messageID, body } = message;

  // ... (previous code remains the same)

  // Function to display the horse racing GIF and results
  async function displayRaceResults(threadID, bcl, winningHorseNumber, winner) {
    const horseRaceGif = (await axios.get("https://i.imgur.com/zIKiq8B.gif", {
      responseType: "stream",
    })).data;

    api.sendMessage({
      body: "𝗥𝗮𝗰𝗶𝗻𝗴...",
      attachment: horseRaceGif,
    }, threadID, async (err, racingMessage) => {
      if (err) {
        console.error("𝙴𝚛𝚛𝚘𝚛 𝚘𝚌𝚌𝚞𝚛𝚛𝚎𝚍 𝚠𝚑𝚒𝚕𝚎 𝚜𝚎𝚗𝚍𝚒𝚗𝚐 𝚝𝚑𝚎 𝚛𝚊𝚌𝚒𝚗𝚐 𝚖𝚎𝚜𝚜𝚊𝚐𝚎:", err);
      } else {
        setTimeout(async () => {
          if (racingMessage) {
            await api.unsendMessage(racingMessage.messageID);
          }

          const horseNumber = (await axios.get(horseImages.find(horse => horse.number === winningHorseNumber).url, {
            responseType: "stream",
          })).data;

          const raceResult = `[🐴] » 𝚃𝚑𝚎 𝚑𝚘𝚛𝚜𝚎 𝚛𝚊𝚌𝚒𝚗𝚐 𝚐𝚊𝚖𝚎 𝚑𝚊𝚜 𝚎𝚗𝚍𝚎𝚍!\n\n𝚃𝚑𝚎 𝚠𝚒𝚗𝚗𝚒𝚗𝚐 𝚑𝚘𝚛𝚜𝚎 𝚒𝚜 𝚗𝚞𝚖𝚋𝚎𝚛 ⎾${winningHorseNumber}⏌!\n\n𝚃𝚑𝚎 𝚠𝚒𝚗𝚗𝚎𝚛 𝚒𝚜 ${winner.name}!\n\n𝐂𝐨𝐧𝐠𝐫𝐚𝐭𝐮𝐥𝐚𝐭𝐢𝐨𝐧𝐬! 🎉🏆`;

          api.sendMessage({
            body: raceResult,
            attachment: horseNumber,
          }, threadID);
        }, 8000); // 8 seconds delay before unsending the racing message
      }
    });
  }

  // Function to handle horse selection
  async function handleHorseSelection(threadID, bcl, senderID, horseNumber) {
    const player = bcl.players.find((p) => p.userID === senderID);
    if (!player) {
      return api.sendMessage("[🐴 ⚠] » 𝚈𝚘𝚞 𝚑𝚊𝚟𝚎𝚗'𝚝 𝚓𝚘𝚒𝚗𝚎𝚍 𝚝𝚑𝚒𝚜 𝚑𝚘𝚛𝚜𝚎 𝚛𝚊𝚌𝚒𝚗𝚐 𝚐𝚊𝚖𝚎!", threadID, messageID);
    }
    if (player.horse !== null) {
      return api.sendMessage(`[🐴 ⚠] » ${player.name}, 𝚢𝚘𝚞 𝚑𝚊𝚟𝚎 𝚊𝚕𝚛𝚎𝚊𝚍𝚢 𝚙𝚒𝚌𝚔𝚎𝚍 𝚑𝚘𝚛𝚜𝚎 𝚗𝚞𝚖𝚋𝚎𝚛 ${player.horse}!`, threadID, messageID);
    }
    if (isNaN(horseNumber) || horseNumber < 1 || horseNumber > bcl.horses.length) {
      return api.sendMessage("[🐴 ⚠] » 𝙿𝚕𝚎𝚊𝚜𝚎 𝚌𝚑𝚘𝚘𝚜𝚎 𝚊 𝚟𝚊𝚕𝚒𝚍 𝚑𝚘𝚛𝚜𝚎 𝚗𝚞𝚖𝚋𝚎𝚛.", threadID, messageID);
    }
    if (bcl.players.some((p) => p.horse === horseNumber)) {
      return api.sendMessage("[🐴 ⚠] » 𝙰𝚗𝚘𝚝𝚑𝚎𝚛 𝚙𝚕𝚊𝚢𝚎𝚛 𝚑𝚊𝚜 𝚊𝚕𝚛𝚎𝚊𝚍𝚢 𝚙𝚒𝚌𝚔𝚎𝚍 𝚝𝚑𝚒𝚜 𝚑𝚘𝚛𝚜𝚎 𝚗𝚞𝚖𝚋𝚎𝚛! 𝙿𝚕𝚎𝚊𝚜𝚎 𝚌𝚑𝚘𝚘𝚜𝚎 𝚊𝚗𝚘𝚝𝚑𝚎𝚛 𝚘𝚗𝚎.", threadID, messageID);
    }
    player.horse = horseNumber;
    global.chanle.set(threadID, bcl);
    const playerName = player.name || senderID;
    api.sendMessage(`[🐴] » ${playerName} 𝚙𝚒𝚌𝚔𝚎𝚍 𝚑𝚘𝚛𝚜𝚎 𝚗𝚞𝚖𝚋𝚎𝚛 ${player.horse}.`, threadID, messageID);

    // Check if all players have made their choices
    const allPlayersChosen = bcl.players.every((p) => p.horse !== null);
    if (allPlayersChosen) {
      // All players have made their choices, start the race!
      const winningHorseNumber = Math.floor(Math.random() * bcl.horses.length) + 1; // Generate a random horse number between 1 and number of horses
      const winner = bcl.players.find((p) => p.horse === winningHorseNumber);
      if (winner) {
        const playerName = winner.name || senderID;
        const betAmount = bcl.reservationAmount;
        const totalPlayers = bcl.players.length;

        // Calculate the payout for each winner
        const payout = betAmount * (totalPlayers - 1);

        // Increase the money for the winner(s)
        await Users.increaseMoney(winner.userID, payout);

        // Decrease the money for the losers
        for (const player of bcl.players) {
          if (player.userID !== winner.userID) {
            await Users.decreaseMoney(player.userID, betAmount);
          }
        }

        displayRaceResults(threadID, bcl, winningHorseNumber, winner);
      } else {
        api.sendMessage("[SIES-NOTI] » The horse racing game has ended!\n\nUnfortunately, there is no winner this time. Better luck next time!", threadID);
      }

      // Reset the game state
      global.chanle.delete(threadID);
    }
  }

  if (args[0] === "create" || args[0] === "new" || args[0] === "-c") {
    // Create a new horse racing game
    if (!args[1] || isNaN(args[1])) {
      return api.sendMessage("[🐴 ⚠] » 𝚈𝚘𝚞 𝚗𝚎𝚎𝚍 𝚝𝚘 𝚎𝚗𝚝𝚎𝚛 𝚊 𝚛𝚎𝚜𝚎𝚛𝚟𝚊𝚝𝚒𝚘𝚗 𝚊𝚖𝚘𝚞𝚗𝚝!", threadID, messageID);
    }
    const reservationAmount = parseInt(args[1]);
    if (reservationAmount < 500) {
      return api.sendMessage("[🐴 ⚠] » 𝙰𝚖𝚘𝚞𝚗𝚝 𝚖𝚞𝚜𝚝 𝚋𝚎 𝚐𝚛𝚎𝚊𝚝𝚎𝚛 𝚝𝚑𝚊𝚗 𝚘𝚛 𝚎𝚚𝚞𝚊𝚕 𝚝𝚘 𝟻𝟶𝟶!", threadID, messageID);
    }
    const userMoney = await Users.getMoney(senderID) || null;
    if (userMoney < reservationAmount) {
      return api.sendMessage(`[🐴 ⚠] » 𝚈𝚘𝚞 𝚍𝚘𝚗'𝚝 𝚑𝚊𝚟𝚎 𝚎𝚗𝚘𝚞𝚐𝚑 ${reservationAmount}$ 𝚝𝚘 𝚌𝚛𝚎𝚊𝚝𝚎 𝚊 𝚗𝚎𝚠 𝚐𝚊𝚖𝚎!`, threadID, messageID);
    }
    if (global.chanle.has(threadID)) {
      return api.sendMessage("[🐴 ⚠] » 𝚃𝚑𝚒𝚜 𝚐𝚛𝚘𝚞𝚙 𝚑𝚊𝚜 𝚊𝚕𝚛𝚎𝚊𝚍𝚢 𝚘𝚙𝚎𝚗𝚎𝚍 𝚊 𝚐𝚊𝚖𝚎 𝚝𝚊𝚋𝚕𝚎!", threadID, messageID);
    }

    const playerName = (await global.controllers.Users.getInfo(senderID))?.name || senderID;
    global.chanle.set(threadID, {
      box: threadID,
      start: false,
      author: senderID,
      players: [{
        name: playerName,
        userID: senderID,
        horse: null,
      }],
      reservationAmount: reservationAmount,
    });
    return api.sendMessage(`[🐴] » 𝚂𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢 𝚌𝚛𝚎𝚊𝚝𝚎𝚍 𝚊 𝚑𝚘𝚛𝚜𝚎 𝚛𝚊𝚌𝚒𝚗𝚐 𝚐𝚊𝚖𝚎 𝚠𝚒𝚝𝚑 𝚊 𝚛𝚎𝚜𝚎𝚛𝚟𝚊𝚝𝚒𝚘𝚗 𝚊𝚖𝚘𝚞𝚗𝚝 𝚘𝚏 ${reservationAmount}$.`, threadID);

  } else if (args[0] === "join" || args[0] === "-j") {
    // Join the horse racing game
    if (!global.chanle.has(threadID)) {
      return api.sendMessage("[🐴 ⚠] » 𝚃𝚑𝚎𝚛𝚎 𝚒𝚜 𝚌𝚞𝚛𝚛𝚎𝚗𝚝𝚕𝚢 𝚗𝚘 𝚑𝚘𝚛𝚜𝚎 𝚛𝚊𝚌𝚒𝚗𝚐 𝚐𝚊𝚖𝚎 𝚒𝚗 𝚝𝚑𝚒𝚜 𝚐𝚛𝚘𝚞𝚙!\n=> 𝙿𝚕𝚎𝚊𝚜𝚎 𝚌𝚛𝚎𝚊𝚝𝚎 𝚊 𝚗𝚎𝚠 𝚐𝚊𝚖𝚎 𝚝𝚘 𝚓𝚘𝚒𝚗!", threadID, messageID);
    }
    bcl = global.chanle.get(threadID);
    if (bcl.start) {
      return api.sendMessage("[🐴 ⚠] » 𝚃𝚑𝚒𝚜 𝚑𝚘𝚛𝚜𝚎 𝚛𝚊𝚌𝚒𝚗𝚐 𝚐𝚊𝚖𝚎 𝚑𝚊𝚜 𝚊𝚕𝚛𝚎𝚊𝚍𝚢 𝚜𝚝𝚊𝚛𝚝𝚎𝚍!", threadID, messageID);
    }
    const reservationAmount = bcl.reservationAmount;
    const playerMoney = await Users.getMoney(senderID) || null;
    if (playerMoney < reservationAmount) {
      return api.sendMessage(`[🐴 ⚠] » 𝚈𝚘𝚞 𝚍𝚘𝚗'𝚝 𝚑𝚊𝚟𝚎 𝚎𝚗𝚘𝚞𝚐𝚑 ${reservationAmount}$ 𝚝𝚘 𝚓𝚘𝚒𝚗 𝚝𝚑𝚒𝚜 𝚑𝚘𝚛𝚜𝚎 𝚛𝚊𝚌𝚒𝚗𝚐 𝚐𝚊𝚖𝚎!`, threadID, messageID);
    }
    const playerName = (await global.controllers.Users.getInfo(senderID))?.name || senderID;
    if (bcl.players.find((player) => player.userID === senderID)) {
      return api.sendMessage("𝚈𝚘𝚞 𝚑𝚊𝚟𝚎 𝚊𝚕𝚛𝚎𝚊𝚍𝚢 𝚓𝚘𝚒𝚗𝚎𝚍 𝚝𝚑𝚒𝚜 𝚑𝚘𝚛𝚜𝚎 𝚛𝚊𝚌𝚒𝚗𝚐 𝚐𝚊𝚖𝚎!", threadID, messageID);
    }
    bcl.players.push({
      name: playerName,
      userID: senderID,
      horse: null,
    });
    global.chanle.set(threadID, bcl);
    return api.sendMessage(`[🐴] » 𝚈𝚘𝚞 𝚑𝚊𝚟𝚎 𝚓𝚘𝚒𝚗𝚎𝚍 𝚝𝚑𝚎 𝚑𝚘𝚛𝚜𝚎 𝚛𝚊𝚌𝚒𝚗𝚐 𝚐𝚊𝚖𝚎!\n=> 𝚃𝚑𝚎 𝚌𝚞𝚛𝚛𝚎𝚗𝚝 𝚗𝚞𝚖𝚋𝚎𝚛 𝚘𝚏 𝚙𝚕𝚊𝚢𝚎𝚛𝚜 𝚒𝚜: ${bcl.players.length}`, threadID, messageID);

  } else if (args[0] === "start" || args[0] === "-s") {
    // Start the horse racing game
    bcl = global.chanle.get(threadID);
    if (!bcl) {
      return api.sendMessage("[🐴 ⚠] » 𝚃𝚑𝚎𝚛𝚎 𝚒𝚜 𝚌𝚞𝚛𝚛𝚎𝚗𝚝𝚕𝚢 𝚗𝚘 𝚑𝚘𝚛𝚜𝚎 𝚛𝚊𝚌𝚒𝚗𝚐 𝚐𝚊𝚖𝚎 𝚒𝚗 𝚝𝚑𝚒𝚜 𝚐𝚛𝚘𝚞𝚙!\n=> 𝙿𝚕𝚎𝚊𝚜𝚎 𝚌𝚛𝚎𝚊𝚝𝚎 𝚊 𝚗𝚎𝚠 𝚐𝚊𝚖𝚎 𝚝𝚘 𝚓𝚘𝚒𝚗!", threadID, messageID);
    }
    if (bcl.author !== senderID) {
      return api.sendMessage("[🐴 ⚠] » 𝚈𝚘𝚞 𝚊𝚛𝚎 𝚗𝚘𝚝 𝚝𝚑𝚎 𝚌𝚛𝚎𝚊𝚝𝚘𝚛 𝚘𝚏 𝚝𝚑𝚒𝚜 𝚑𝚘𝚛𝚜𝚎 𝚛𝚊𝚌𝚒𝚗𝚐 𝚐𝚊𝚖𝚎, 𝚜𝚘 𝚢𝚘𝚞 𝚌𝚊𝚗𝚗𝚘𝚝 𝚜𝚝𝚊𝚛𝚝 𝚝𝚑𝚎 𝚐𝚊𝚖𝚎.", threadID, messageID);
    }
    if (bcl.players.length < 2) {
      return api.sendMessage("[🐴 ⚠] » 𝚈𝚘𝚞𝚛 𝚑𝚘𝚛𝚜𝚎 𝚛𝚊𝚌𝚒𝚗𝚐 𝚐𝚊𝚖𝚎 𝚍𝚘𝚎𝚜𝚗'𝚝 𝚑𝚊𝚟𝚎 𝚎𝚗𝚘𝚞𝚐𝚑 𝚙𝚕𝚊𝚢𝚎𝚛𝚜 𝚝𝚘 𝚜𝚝𝚊𝚛𝚝!", threadID, messageID);
    }
    if (bcl.start) {
      return api.sendMessage("[🐴 ⚠] » 𝚃𝚑𝚒𝚜 𝚑𝚘𝚛𝚜𝚎 𝚛𝚊𝚌𝚒𝚗𝚐 𝚐𝚊𝚖𝚎 𝚑𝚊𝚜 𝚊𝚕𝚛𝚎𝚊𝚍𝚢 𝚜𝚝𝚊𝚛𝚝𝚎𝚍!", threadID, messageID);
    }

    bcl.start = true;
    // Set the number of horses based on the number of players
    const numberOfPlayers = bcl.players.length;
    bcl.horses = Array.from({ length: numberOfPlayers }, (_, index) => index + 1);
    // Shuffle the horses randomly
    bcl.horses.sort(() => Math.random() - 0.5);
    global.chanle.set(threadID, bcl);

    // Start the race with the new number of horses
    startRacingGame(threadID, bcl, message);

  } else if (!isNaN(args[0])) {
    // Player picks a horse number
    bcl = global.chanle.get(threadID);
    if (!bcl) {
      return api.sendMessage("[🐴 ⚠] » 𝚃𝚑𝚎𝚛𝚎 𝚒𝚜 𝚌𝚞𝚛𝚛𝚎𝚗𝚝𝚕𝚢 𝚗𝚘 𝚑𝚘𝚛𝚜𝚎 𝚛𝚊𝚌𝚒𝚗𝚐 𝚐𝚊𝚖𝚎 𝚒𝚗 𝚝𝚑𝚒𝚜 𝚐𝚛𝚘𝚞𝚙!\n=> 𝙿𝚕𝚎𝚊𝚜𝚎 𝚌𝚛𝚎𝚊𝚝𝚎 𝚊 𝚗𝚎𝚠 𝚐𝚊𝚖𝚎 𝚝𝚘 𝚓𝚘𝚒𝚗!", threadID, messageID);
    }
    if (!bcl.start) {
      return api.sendMessage("[🐴 ⚠] » 𝚃𝚑𝚎 𝚑𝚘𝚛𝚜𝚎 𝚛𝚊𝚌𝚒𝚗𝚐 𝚐𝚊𝚖𝚎 𝚑𝚊𝚜 𝚗𝚘𝚝 𝚜𝚝𝚊𝚛𝚝𝚎𝚍 𝚢𝚎𝚝!", threadID, messageID);
    }

    const horseNumber = parseInt(args[0]);
    handleHorseSelection(threadID, bcl, senderID, horseNumber);
  } else if (args[0] === "end" || args[0] === "-e") {
    // End the horse racing game and delete it if the creator uses this command
    bcl = global.chanle.get(threadID);
    if (!bcl) {
      return api.sendMessage("[🐴 ⚠] » 𝚃𝚑𝚎𝚛𝚎 𝚒𝚜 𝚌𝚞𝚛𝚛𝚎𝚗𝚝𝚕𝚢 𝚗𝚘 𝚑𝚘𝚛𝚜𝚎 𝚛𝚊𝚌𝚒𝚗𝚐 𝚐𝚊𝚖𝚎 𝚒𝚗 𝚝𝚑𝚒𝚜 𝚐𝚛𝚘𝚞𝚙!\n=> 𝙿𝚕𝚎𝚊𝚜𝚎 𝚌𝚛𝚎𝚊𝚝𝚎 𝚊 𝚗𝚎𝚠 𝚐𝚊𝚖𝚎 𝚝𝚘 𝚓𝚘𝚒𝚗!", threadID, messageID);
    }

    const isCreator = bcl.author === senderID;
    if (isCreator) {
      // The game creator uses the command, delete the game
      global.chanle.delete(threadID);
      return api.sendMessage("[🐴] » 𝚃𝚑𝚎 𝚑𝚘𝚛𝚜𝚎 𝚛𝚊𝚌𝚒𝚗𝚐 𝚐𝚊𝚖𝚎 𝚑𝚊𝚜 𝚋𝚎𝚎𝚗 𝚍𝚎𝚕𝚎𝚝𝚎𝚍 𝚋𝚢 𝚝𝚑𝚎 𝚌𝚛𝚎𝚊𝚝𝚘𝚛.", threadID, messageID);
    } else {
      // Another player uses the command, determine the winner and show the results
      if (!bcl.start) {
        return api.sendMessage("[🐴 ⚠] » 𝚃𝚑𝚎 𝚑𝚘𝚛𝚜𝚎 𝚛𝚊𝚌𝚒𝚗𝚐 𝚐𝚊𝚖𝚎 𝚑𝚊𝚜 𝚗𝚘𝚝 𝚜𝚝𝚊𝚛𝚝𝚎𝚍 𝚢𝚎𝚝!", threadID, messageID);
      }

      const numberOfPlayers = bcl.players.length;
      let winner = null;
      const winningHorseNumber = Math.floor(Math.random() * bcl.horses.length) + 1; // Generate a random horse number between 1 and number of horses
      for (let i = 0; i < numberOfPlayers; i++) {
        const player = bcl.players[i];
        if (player.horse === winningHorseNumber) {
          winner = player;
          break;
        }
      }
      if (winner) {
        const playerName = winner.name || senderID;
        displayRaceResults(threadID, bcl, winningHorseNumber, winner);
      } else {
        api.sendMessage({
          body: "[🐴] » 𝚃𝚑𝚎 𝚑𝚘𝚛𝚜𝚎 𝚛𝚊𝚌𝚒𝚗𝚐 𝚐𝚊𝚖𝚎 𝚑𝚊𝚜 𝚎𝚗𝚍𝚎𝚍!\n\n𝚄𝚗𝚏𝚘𝚛𝚝𝚞𝚗𝚊𝚝𝚎𝚕𝚢, 𝚝𝚑𝚎𝚛𝚎 𝚒𝚜 𝚗𝚘 𝚠𝚒𝚗𝚗𝚎𝚛 𝚝𝚑𝚒𝚜 𝚝𝚒𝚖𝚎. 𝙱𝚎𝚝𝚝𝚎𝚛 𝚕𝚞𝚌𝚔 𝚗𝚎𝚡𝚝 𝚝𝚒𝚖𝚎!",
          attachment: horseCrush
        }, threadID);
      }

      // Reset the game state
      global.chanle.delete(threadID);
    }
  } else {
    // Display help information if the command is not recognized
    return api.sendMessage({
      body: "=【𝐌𝐮𝐥𝐭𝐢𝐩𝐥𝐚𝐲𝐞𝐫 𝐇𝐨𝐫𝐬𝐞 𝐑𝐚𝐜𝐢𝐧𝐠 𝐆𝐚𝐦𝐞】=\n1. !hr -c/create <price> => Create a new horse racing game.\n2. !hr -j/join => Join to enter the game.\n3. !hr -s/start => Start the game.\n4. !hr <horse_number> => Pick a horse number (1 to 9).\n5. !hr -e/end => End the game (for players) or delete the game (for the creator).",
      attachment: horseImg,
    }, threadID, messageID);
  }
}

// Export the configuration and the main function
export default {
  config,
  onCall,
};