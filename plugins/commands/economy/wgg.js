import axios from 'axios';

const config = {
  name: "word-guessing-game",
  aliases: ["wgg"],
  description: "Play a word guessing game with multiplayer.",
  usage: "Use it then you'll know.",
  cooldown: 3,
  permissions: [0, 1, 2],
  isAbsolute: false,
  isHidden: false,
  credits: "Dymyrius",
};

const { api } = global;
async function onCall({ message, getLang, args }) {
  const { Users } = global.controllers;
  global.chanle || (global.chanle = new Map);
  var bcl = global.chanle.get(message.threadID);
  const apiBaseUrl = "https://random-words-api.vercel.app/word";

  const { senderID, threadID, messageID, body, send, reply, react } = message;
  if (!args[0]) {
    return api.sendMessage(
      `==【Word Guessing Game】==\n1. !wgg create <bet amount> => Create a new game room.\n2. !wgg join => Join to enter the game room.\n3. !wgg start => Start the game (host only).\n4. !wgg leave => Leave the game.\n5. !wgg end => End the game (host only).`,
      threadID,
      messageID
    );
  }

  const command = args[0].toLowerCase();
  switch (command) {
    case "create":
    case "new":
    case "-c":
      if (!args[1] || isNaN(args[1])) {
        return api.sendMessage(
          "[Word Guessing Game] » You need to enter a valid bet amount!",
          threadID,
          messageID
        );
      }

      if (parseInt(args[1]) < 500) {
        return api.sendMessage(
          "[Word Guessing Game] » Bet amount must be greater than or equal to 500!",
          threadID,
          messageID
        );
      }

      const userMoney = await Users.getMoney(senderID) || null;
      if (userMoney < parseInt(args[1])) {
        return api.sendMessage(
          `[Word Guessing Game] » You don't have enough money to create a new game room!`,
          threadID,
          messageID
        );
      }

      if (global.chanle.has(threadID)) {
        return api.sendMessage(
          "[Word Guessing Game] » A game room already exists in this group!",
          threadID,
          messageID
        );
      }

      const playerName = (await global.controllers.Users.getInfo(senderID))?.name || senderID;
      global.chanle.set(threadID, {
        box: threadID,
        start: false,
        host: senderID,
        players: [{
          name: playerName,
          userID: senderID,
          bet: parseInt(args[1]),
          won: false
        }],
        word: "",
        definition: "",
      });

      await Users.decreaseMoney(senderID, parseInt(args[1]));

      api.sendMessage(
        "[Word Guessing Game] » Successfully created a new game room with bet amount: " + args[1],
        threadID
      );
      break;

    case "join":
    case "-j":
      if (!global.chanle.has(threadID)) {
        return api.sendMessage(
          "[Word Guessing Game] » There is currently no game room in this group! Please create a new game room to join.",
          threadID,
          messageID
        );
      }

      bcl = global.chanle.get(threadID);
      if (bcl.start) {
        return api.sendMessage(
          "[Word Guessing Game] » The game has already started! You can't join now.",
          threadID,
          messageID
        );
      }

      const playerMoney = await Users.getMoney(senderID) || null;
      if (playerMoney < bcl.players[0].bet) {
        return api.sendMessage(
          `[Word Guessing Game] » You don't have enough money to join this game room! Required: ${bcl.players[0].bet}$`,
          threadID,
          messageID
        );
      }

      const playerNameJoin = (await global.controllers.Users.getInfo(senderID))?.name || senderID;
      if (bcl.players.find((player) => player.userID === senderID)) {
        return api.sendMessage(
          "[Word Guessing Game] » You have already joined this game room!",
          threadID,
          messageID
        );
      }

      bcl.players.push({
        name: playerNameJoin,
        userID: senderID,
        bet: bcl.players[0].bet,
        won: false,
      });
      global.chanle.set(threadID, bcl);

      await Users.decreaseMoney(senderID, bcl.players[0].bet);

      api.sendMessage(
        `[Word Guessing Game] » ${playerNameJoin} has joined the game room! The current number of players is: ${bcl.players.length}`,
        threadID
      );
      break;

    case "start":
    case "-s":
      if (!global.chanle.has(threadID)) {
        return api.sendMessage(
          "[Word Guessing Game] » There is currently no game room in this group! Please create a new game room to start the game.",
          threadID,
          messageID
        );
      }

      bcl = global.chanle.get(threadID);
      if (bcl.host !== senderID) {
        return api.sendMessage(
          "[Word Guessing Game] » You are not the host of this game room, so you cannot start the game!",
          threadID,
          messageID
        );
      }

      if (bcl.players.length <= 1) {
        return api.sendMessage(
          "[Word Guessing Game] » Your game room doesn't have enough players to start the game!",
          threadID,
          messageID
        );
      }

      if (bcl.start) {
        return api.sendMessage(
          "[Word Guessing Game] » The game has already started!",
          threadID,
          messageID
        );
      }

      bcl.start = true;
      global.chanle.set(threadID, bcl);

      api.sendMessage(
        "[Word Guessing Game] » The game has started! The host will provide a hint, and players can guess the word!",
        threadID
      );

      // Fetch word from the API
      const { data } = await axios.get(apiBaseUrl);
      const wordData = data[0];
      const word = wordData.word.trim();
      const definition = wordData.definition.trim();

      bcl.word = word;
      bcl.definition = definition;
      global.chanle.set(threadID, bcl);

      api.sendMessage(
        `[Word Guessing Game] » Hint: ${definition}`,
        threadID
      );
      break;

    case "leave":
    case "-l":
      if (!global.chanle.has(threadID)) {
        return api.sendMessage(
          "[Word Guessing Game] » There is currently no game room for you to leave!",
          threadID,
          messageID
        );
      }

      bcl = global.chanle.get(threadID);
      const playerIndex = bcl.players.findIndex((player) => player.userID === senderID);
      if (playerIndex === -1) {
        return api.sendMessage(
          "[Word Guessing Game] » You are not part of the game room, so you can't leave!",
          threadID,
          messageID
        );
      }

      if (bcl.start) {
        return api.sendMessage(
          "[Word Guessing Game] » You can't leave the game once it has started!",
          threadID,
          messageID
        );
      }

      const playerNameLeave = bcl.players[playerIndex].name;
      bcl.players.splice(playerIndex, 1);
      global.chanle.set(threadID, bcl);

      api.sendMessage(
        `[Word Guessing Game] » ${playerNameLeave} has left the game room. Their bet will be refunded.`,
        threadID
      );

      await Users.increaseMoney(senderID, bcl.players[0].bet);
      break;

    case "end":
    case "-e":
      if (!global.chanle.has(threadID)) {
        return api.sendMessage(
          "[Word Guessing Game] » There is currently no game room to end!",
          threadID,
          messageID
        );
      }

      bcl = global.chanle.get(threadID);
      if (bcl.host !== senderID) {
        return api.sendMessage(
          "[Word Guessing Game] » You are not the host of this game room, so you cannot end the game!",
          threadID,
          messageID
        );
      }

      api.sendMessage(
        "[Word Guessing Game] » The game has been ended by the host.",
        threadID
      );

      // Refund bets to all players
      for (const player of bcl.players) {
        await Users.increaseMoney(player.userID, player.bet);
      }

      // Clear the game room
      global.chanle.delete(threadID);
      break;

    default:
      return api.sendMessage(
        "[Word Guessing Game] » Invalid command! Use `!wgg` for the list of available commands.",
        threadID,
        messageID
      );
  }
}

export default {
  config,
  onCall
};
