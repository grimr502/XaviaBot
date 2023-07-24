const config = {
  name: "rob",
  description: "Steal money from another user",
  usage: "<@user>",
  cooldown: 50,
};

const langData = {
  "en_US": {
    "missingMention": "You need to mention a user to rob their money.",
    "cannotRobBot": "You cannot rob the bot.",
    "success": "You successfully robbed {name}'s ${amount} money! 💵",
    "fail": "You failed to rob {name}'s money as they were protected.",
    "notEnoughMoney": "Do work mf!",
    "error": "An error occurred, please try again later.",
    "targetAFK": "The target user is currently AFK and cannot be robbed.",
    "robEnabled": "The rob feature is now enabled in this group.",
    "robDisabled": "The rob feature is now disabled in this group.",
  },
  // Add more language versions if necessary
};

const groupSettings = {}; // Store group settings (on/off) in memory

async function onCall({ message, args, getLang, userPermissions }) {
  const { mentions, senderID, reply } = message;
  const isGroupAdmin = userPermissions.some((e) => e === 1);

  // If group admin and provided "on" or "off" argument, update the rob status
  if (isGroupAdmin && (args[0]?.toLowerCase() === "on" || args[0]?.toLowerCase() === "off")) {
    const status = args[0].toLowerCase() === "on";
    groupSettings[message.threadID] = status;
    return reply(getLang(status ? "robEnabled" : "robDisabled"));
  }

  if (Object.keys(mentions).length === 0) {
    return reply(getLang("missingMention"));
  }

  // Check if target is the bot itself
  const isBot = Object.keys(mentions).some((mention) => mention === global.config.botID);
  if (isBot) {
    return reply(getLang("cannotRobBot"));
  }

  const targetID = Object.keys(mentions)[0];
  const { Users } = global.controllers;

  const senderMoney = await Users.getMoney(senderID);
  if (senderMoney === null || senderMoney < 100) {
    return reply(getLang("notEnoughMoney"));
  }

  const targetData = await Users.getData(targetID);
  if (targetData && targetData.afk && targetData.afk.status) {
    return reply(getLang("targetAFK"));
  }

  // Check if the rob feature is enabled for this group
  const isRobEnabled = groupSettings[message.threadID] !== false;

  if (isRobEnabled) {
    const targetMoney = await Users.getMoney(targetID);
    if (targetMoney === null) {
      return reply(getLang("error"));
    }

    const rand = Math.random();
    if (rand < 0.6) {
      const amount = Math.floor(targetMoney * 0.45);
      await Users.decreaseMoney(targetID, amount);
      await Users.increaseMoney(senderID, amount);
      return reply(getLang("success", { name: mentions[targetID].replace(/@/g, ""), amount }));
    } else {
      await Users.decreaseMoney(senderID, 100);
      return reply(getLang("fail", { name: mentions[targetID].replace(/@/g, "") }));
    }
  } else {
    return reply("The rob feature is currently disabled in this group.");
  }
}

export default {
  config,
  langData,
  onCall,
};
