const config = {
  credits: "XaviaTeam",
  cooldown: 8
};

const langData = {
  "en_US": {
    "afkOn": "You are now AFK.",
    "afkOff": "You are no longer AFK.",
    "userNoData": "Your data is not available.",
    "error": "An error occurred.",
    "secureOn": "You are now immune to being robbed.",
    "secureOff": "Your immunity to robbing has been disabled.",
  },
  // Add more language versions if necessary
};

async function onCall({ message, args, getLang }) {
  const { senderID, reply } = message;

  try {
    const userData = await global.controllers.Users.getData(senderID);

    if (userData == null) return reply(getLang("userNoData"));

    const afk = userData.afk || { status: false, reason: null };
    const secure = userData.secure || false;

    if (afk.status) {
      afk.status = false;
      afk.reason = null;
    } else if (secure) {
      secure = false;
    } else {
      afk.status = true;
      afk.reason = args.join(" ") || null;
    }

    await global.controllers.Users.updateData(senderID, { afk, secure });

    if (afk.status) {
      reply(getLang("afkOn"));
    } else if (secure) {
      reply(getLang("secureOn"));
    } else {
      reply(getLang("afkOff"));
    }
  } catch (e) {
    console.error(e);
    reply(getLang("error"));
  }
}

export default {
  config,
  langData,
  onCall,
};
