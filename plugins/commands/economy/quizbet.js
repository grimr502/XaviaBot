import axios from "axios";

const config = {
  name: "quizbet",
  aliases: ["qb"],
  description: "Answer a trivia question to win money.",
  usage: "",
  cooldown: 10,
  credits: "TakiUwU && Isai",
};

// Helper function to convert string to title case
String.prototype.toTitleCase = function () {
  return this.toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

async function onCall({ message, args, getLang }) {
  const { Users } = global.controllers;
  let userBet = parseInt(args[0]);

  if (isNaN(userBet) || userBet <= 0) {
    return message.reply("𝙿𝚕𝚎𝚊𝚜𝚎 𝚎𝚗𝚝𝚎𝚛 𝚊 𝚟𝚊𝚕𝚒𝚍 𝚋𝚎𝚝 𝚊𝚖𝚘𝚞𝚗𝚝.");
  }

  // Limit userBet to a maximum of 50000
  userBet = Math.min(userBet, 50000);

  const userBalance = await Users.getMoney(message.senderID);

  if (userBalance < userBet) {
    return message.reply("𝚈𝚘𝚞 𝚍𝚘𝚗'𝚝 𝚑𝚊𝚟𝚎 𝚎𝚗𝚘𝚞𝚐𝚑 𝚖𝚘𝚗𝚎𝚢 𝚝𝚘 𝚙𝚕𝚊𝚌𝚎 𝚝𝚑𝚒𝚜 𝚋𝚎𝚝.");
  }

  await Users.decreaseMoney(message.senderID, userBet);

  // Determine the difficulty level based on the bet amount
  const difficulties = ["easy", "medium", "hard"];
  const randomIndex = Math.floor(Math.random() * difficulties.length);
  const difficulty = difficulties[randomIndex];

  const apiUrl = `https://opentdb.com/api.php?amount=1&difficulty=${difficulty}`;
  const { data } = await axios.get(apiUrl);

  // Replace special characters in the response
  const specialChars = {
    "&quot;": '"',
    "&#039;": "'",
    "&amp;": "'",
  };
  const decodedResults = data.results.map((result) => {
    const decodedQuestion = unescape(
      result.question.replace(/&quot;|&#039;|&amp;/g, (m) => specialChars[m])
    );
    const decodedCorrectAnswer = unescape(
      result.correct_answer.replace(/&quot;|&#039;/g, (m) => specialChars[m])
    );
    const decodedIncorrectAnswers = result.incorrect_answers.map((ans) =>
      unescape(ans.replace(/&quot;|&#039;/g, (m) => specialChars[m]))
    );
    return {
      ...result,
      question: decodedQuestion,
      correct_answer: decodedCorrectAnswer,
      incorrect_answers: decodedIncorrectAnswers,
    };
  });

  const question = decodedResults[0].question;
  const type = decodedResults[0].type;
  const difficultyText = difficulty.toTitleCase();
  const timeLimit = 17; // Time limit in seconds

  if (type === "boolean") {
    const correctAnswer = decodedResults[0].correct_answer.toLowerCase();
    const incorrectAnswer =
      decodedResults[0].incorrect_answers[0].toLowerCase();
    let userMadeChoice = false; // Flag to track if the user made a choice

    message
      .reply(
        `${question}\n━━━━━━━━━━━━━━━\nDifficulty: ${difficultyText}\nTime Limit: ${timeLimit} seconds. ⏱`
      )
      .then((data) => {
        const messageId = data.messageID;

        // Set the timer for the time limit
        const timerId = setTimeout(() => {
          if (!userMadeChoice) {
            message.reply("𝚃𝚒𝚖𝚎'𝚜 𝚞𝚙! 𝚈𝚘𝚞 𝚍𝚒𝚍𝚗'𝚝 𝚖𝚊𝚔𝚎 𝚊 𝚌𝚑𝚘𝚒𝚌𝚎.⏱");
            global.api.unsendMessage(messageId);
          }
        }, timeLimit * 1000);

        data.addReplyEvent({
          callback: getBooleanReply,
          myData: { correctAnswer, userBet, messageId, timerId },
        });
      })
      .catch((err) => console.error(err));

    async function getBooleanReply({ message, eventData }) {
      clearTimeout(eventData.timerId); // Clear the timer since the user has made a choice
      userMadeChoice = true; // Update the flag to indicate that the user made a choice

      const answer = message.body.toLowerCase();
      if (answer === correctAnswer) {
        const winnings = userBet * 2;
        await Users.increaseMoney(message.senderID, winnings);
        message
          .reply(`𝙲𝚘𝚛𝚛𝚎𝚌𝚝 𝚊𝚗𝚜𝚠𝚎𝚛! 𝚈𝚘𝚞 𝚠𝚘𝚗 $${winnings}! 💵`)
          .then(() => global.api.unsendMessage(eventData.messageId));
      } else if (answer === incorrectAnswer) {
        message
          .reply("𝚆𝚛𝚘𝚗𝚐 𝚊𝚗𝚜𝚠𝚎𝚛! 𝙱𝚎𝚝𝚝𝚎𝚛 𝚕𝚞𝚌𝚔 𝚗𝚎𝚡𝚝 𝚝𝚒𝚖𝚎. 💸")
          .then(() => global.api.unsendMessage(eventData.messageId));
      } else {
        message.reply(`𝙸𝚗𝚟𝚊𝚕𝚒𝚍 𝚊𝚗𝚜𝚠𝚎𝚛, 𝚙𝚕𝚎𝚊𝚜𝚎 𝚛𝚎𝚙𝚕𝚢 𝚠𝚒𝚝𝚑 "True" 𝚘𝚛 "False".`);
      }
    }
  } else if (type === "multiple") {
    const correctAnswer = decodedResults[0].correct_answer.toLowerCase();
    const options = [
      ...decodedResults[0].incorrect_answers,
      decodedResults[0].correct_answer,
    ];
    const shuffledOptions = options.sort(() => Math.random() - 0.5);
    let userMadeChoice = false; // Flag to track if the user made a choice

    const optionsText = shuffledOptions
      .map((option, index) => `${index + 1}) ${option}`)
      .join("\n");
    const questionText = `${question}\n\n${optionsText}\n━━━━━━━━━━━━━━━\nDifficulty: ${difficultyText}\nTime Limit: ${timeLimit} seconds. ⏱`;

    message
      .reply(questionText)
      .then((data) => {
        const messageId = data.messageID;

        // Set the timer for the time limit
        const timerId = setTimeout(() => {
          if (!userMadeChoice) {
            message.reply("𝚃𝚒𝚖𝚎'𝚜 𝚞𝚙! 𝚈𝚘𝚞 𝚍𝚒𝚍𝚗'𝚝 𝚖𝚊𝚔𝚎 𝚊 𝚌𝚑𝚘𝚒𝚌𝚎.⏱");
            global.api.unsendMessage(messageId);
          }
        }, timeLimit * 1000);

        data.addReplyEvent({
          callback: getMultipleReply,
          myData: {
            correctAnswer,
            shuffledOptions,
            userBet,
            messageId,
            timerId,
          },
        });
      })
      .catch((err) => console.error(err));

    async function getMultipleReply({ message, eventData }) {
      clearTimeout(eventData.timerId); // Clear the timer since the user has made a choice
      userMadeChoice = true; // Update the flag to indicate that the user made a choice

      const answer = message.body.toLowerCase();

      const index = parseInt(answer) - 1;

      if (isNaN(index) || index < 0 || index >= shuffledOptions.length) {
        // Invalid answer index
        message.reply(
          `𝙸𝚗𝚟𝚊𝚕𝚒𝚍 𝚊𝚗𝚜𝚠𝚎𝚛, 𝚙𝚕𝚎𝚊𝚜𝚎 𝚛𝚎𝚙𝚕𝚢 𝚠𝚒𝚝𝚑 𝚊 𝚟𝚊𝚕𝚒𝚍 𝚘𝚙𝚝𝚒𝚘𝚗 𝚗𝚞𝚖𝚋𝚎𝚛 (1-${shuffledOptions.length}).`
        );
        return;
      }

      const isCorrect = shuffledOptions[index].toLowerCase() === correctAnswer;

      if (isCorrect) {
        const winnings = userBet * 2;
        await Users.increaseMoney(message.senderID, winnings);
        message
          .reply(`𝙲𝚘𝚛𝚛𝚎𝚌𝚝 𝚊𝚗𝚜𝚠𝚎𝚛! 𝚈𝚘𝚞 𝚠𝚘𝚗 $${winnings}! 💵`)
          .then(() => global.api.unsendMessage(eventData.messageId));
      } else {
        message
          .reply(
            `𝚆𝚛𝚘𝚗𝚐 𝚊𝚗𝚜𝚠𝚎𝚛! 𝚃𝚑𝚎 𝚌𝚘𝚛𝚛𝚎𝚌𝚝 𝚊𝚗𝚜𝚠𝚎𝚛 𝚒𝚜 ${decodedResults[0].correct_answer}. 𝙱𝚎𝚝𝚝𝚎𝚛 𝚕𝚞𝚌𝚔 𝚗𝚎𝚡𝚝 𝚝𝚒𝚖𝚎. 💸`
          )
          .then(() => global.api.unsendMessage(eventData.messageId));
      }
    }
  } else {
    message.reply(
      "𝚂𝚘𝚛𝚛𝚢, 𝙸 𝚍𝚘𝚗'𝚝 𝚔𝚗𝚘𝚠 𝚑𝚘𝚠 𝚝𝚘 𝚑𝚊𝚗𝚍𝚕𝚎 𝚝𝚑𝚊𝚝 𝚚𝚞𝚎𝚜𝚝𝚒𝚘𝚗 𝚝𝚢𝚙𝚎. 𝙿𝚕𝚎𝚊𝚜𝚎 𝚝𝚛𝚢 𝚊𝚐𝚊𝚒𝚗."
    );
  }
}

export default {
  config,
  onCall,
};
