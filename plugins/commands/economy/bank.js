import { join } from "path";
import { existsSync, writeFileSync, readFileSync } from "fs";
import moment from "moment-timezone";

const interestRate = 150; // Updated interest rate in dollars
const timeInterval = 120000; // Updated time interval to 2 minutes in milliseconds

const config = {
  name: "bank",
  aliases: ["sbv1"],
  description: "A small bank!",
  usage: "Use it and you will know!",
  cooldown: 8,
  permissions: [0, 1, 2],
  isAbsolute: false,
  isHidden: false,
  credits: "Sies",
};

async function onCall({
  message,
  args,
  getLang,
  extra,
  data,
  userPermissions,
  prefix,
}) {
  try {
    const { senderID, threadID, messageID, send, reply, react } = message;
    const PATH = join(global.assetsPath, "bank.json");
    const img = reader(join(global.assetsPath, "bank.jpg"));
    const { Users } = global.controllers;
    const timeNow = moment.tz("Asia/Manila").format("HH:mm:ss");
    console.log(timeNow);
    const seconds = moment.tz("Asia/Manila").format("ss");

    if (!existsSync(PATH)) {
      writeFileSync(PATH, "[]", "utf-8");
    }

    const user = args.slice(1, args.length).join(" ");
    const dataJson = JSON.parse(readFileSync(PATH, "utf-8"));
    const userData = dataJson.find(
      (item) => item.senderID === message.senderID
    ) || { senderID: senderID, money: 0 };
    const moneyInput = parseInt(args[1]);

    if (args[0] === "r" || args[0] === "register") {
      if (!dataJson.some((i) => i.senderID === message.senderID)) {
        dataJson.push(userData);
        writeFileSync(PATH, JSON.stringify(dataJson, null, 4), "utf-8");
        return message.reply(
          "[SIES-NOTI 👨‍💼] » You have successfully registered. Deposit at least $5000 to earn interest! 💰"
        );
      } else {
        return message.reply(
          "[SIES-NOTI 👨‍💼] » You already have an account with Sies Bank!"
        );
      }
    }

    if (args[0] === "check" || args[0] === "c") {
      if (!dataJson.some((i) => i.senderID === senderID)) {
        return message.reply(
          "[SIES-NOTI 👨‍💼] » You don't have an account with Sies Bank. Please register!"
        );
      } else {
        const userMoney = userData.money.toLocaleString();
        return message.reply(
          `[SIES-NOTI 👨‍💼] » Your deposited amount in Sies Bank is: ${userMoney}$. 💵\n━━━━━━━━━━━━━━━\n📈 𝐈𝐧𝐭𝐞𝐫𝐞𝐬𝐭: +${interestRate}$.`
        );
      }
    }

    if (args[0] === "deposit" || args[0] === "d") {
      if (!args[1] || isNaN(args[1]) || parseInt(args[1]) < 5000) {
        return message.reply(
          "[SIES-NOTI 👨‍💼] » Deposit amount must be a number and greater than $5,000! 💰"
        );
      }
      if (!dataJson.some((i) => i.senderID === senderID)) {
        return message.reply(
          "[SIES-NOTI 👨‍💼] » You don't have an account with Sies Bank. Please register!"
        );
      } else {
        console.log(userData);
        console.log(userData.money);
        const money = await Users.getMoney(message.senderID);
        if (parseInt(money) < parseInt(moneyInput)) {
          return message.reply(
            `[SIES-NOTI 👨‍💼] » Insufficient balance. You need at least ${moneyInput.toLocaleString()}$ to deposit into Sies Bank! 💰`
          );
        }
        const currentTime = Date.now();
        const lastDepositTime = userData.lastDepositTime || currentTime;
        const timeDifference = currentTime - lastDepositTime;
        const depositAmount =
          Math.floor(timeDifference / timeInterval) * (interestRate / 2);

        userData.money =
          parseInt(userData.money) + depositAmount + parseInt(moneyInput);
        userData.lastDepositTime = currentTime;
        writeFileSync(PATH, JSON.stringify(dataJson, null, 4), "utf-8");
        await Users.decreaseMoney(message.senderID, parseInt(moneyInput));
        const formattedDepositAmount = depositAmount.toLocaleString(); // Add .toLocaleString() to format the deposited amount
        return message.reply(
          `[SIES-NOTI 👨‍💼] » You have deposited ${moneyInput.toLocaleString()}$ into Sies Bank.\n𝐓𝐨𝐭𝐚𝐥 𝐛𝐚𝐥𝐚𝐧𝐜𝐞: ${userData.money.toLocaleString()}$. 💵\n━━━━━━━━━━━━━━━\n📈 𝐈𝐧𝐭𝐞𝐫𝐞𝐬𝐭: +${interestRate}$.\n Additional deposited amount: ${formattedDepositAmount}$`
        );
      }
    }

    if (args[0] === "withdraw" || args[0] === "w") {
      if (!args[1] || isNaN(args[1]) || parseInt(args[1]) < 5000) {
        return message.reply(
          "[SIES-NOTI 👨‍💼] » Withdrawal amount must be a number and greater than $50!"
        );
      }
      if (!dataJson.some((i) => i.senderID === senderID)) {
        return message.reply(
          '[SIES-NOTI 👨‍💼] » User has not registered for banking. Use "register" to register.'
        );
      } else {
        const money = userData.money;
        if (parseInt(money) < parseInt(moneyInput)) {
          return message.reply(
            "[SIES-NOTI 👨‍💼] » Insufficient balance to perform this transaction!"
          );
        } else {
          await Users.increaseMoney(message.senderID, parseInt(moneyInput));
          userData.money = parseInt(money) - parseInt(moneyInput);
          writeFileSync(PATH, JSON.stringify(dataJson, null, 4), "utf-8");
          const remainingBalance = (
            parseInt(money) - parseInt(moneyInput)
          ).toLocaleString(); // Add .toLocaleString() to format the remaining balance
          return message.reply(
            `[SIES-NOTI 👨‍💼] » Withdrawal successful: ${parseInt(
              moneyInput
            ).toLocaleString()}$.\n━━━━━━━━━━━━━━━\n𝐑𝐞𝐦𝐚𝐢𝐧𝐢𝐧𝐠 𝐛𝐚𝐥𝐚𝐧𝐜𝐞: ${remainingBalance}$. 💵`
          );
        }
      }
    }

    // General information message
    const msg = {
      body: `=❭❯❱『🏦 𝐒𝐢𝐞𝐬 𝐁𝐚𝐧𝐤 🏦』❰❮❬=\n\nWelcome to our Sies Bank system! Here are the services we provide:\n━━━━━━━━━━━━━━━\n=» 1. [r/register] - Register to deposit money at Sies Bank 💹\n=» 2. [c/check] - Check your balance in Sies Bank 💳\n=» 3. [d/deposit] - Deposit money into Sies Bank 💷\n=» 4. [w/withdraw] - Withdraw money from Sies Bank 💰\n━━━━━━━━━━━━━━━\n💲 » Your current interest rate: +${interestRate}$.`,
      attachment: img,
    };
    return message.send(msg);
  } catch (e) {
    message.send("Error:", e);
    console.error(e);
  }
}

export default {
  config,
  onCall,
};
