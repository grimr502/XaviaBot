import axios from 'axios';

const config = {
  name: "wccard",
  aliases: ["welcomecard", "notify"],
  permissions: [1, 2],
  description: "Turn on/off welcome card",
  usage: "[on/off]",
  cooldown: 5,
  credits: "XaviaTeam"
};

const langData = {
  "en_US": {
    "welcome_card.on": "Welcome card has been turned on.",
    "welcome_card.off": "Welcome card has been turned off.",
    "welcome_card.alreadyOn": "Welcome card is already turned on.",
    "welcome_card.alreadyOff": "Welcome card is already turned off.",
    "error": "An error occurred, please try again later."
  },
  "vi_VN": {
    "welcome_card.on": "Welcome card đã được bật.",
    "welcome_card.off": "Welcome card đã được tắt.",
    "welcome_card.alreadyOn": "Welcome card đã được bật trước đó.",
    "welcome_card.alreadyOff": "Welcome card đã được tắt trước đó.",
    "error": "Đã xảy ra lỗi, vui lòng thử lại sau."
  },
  "ar_SY": {
    "welcome_card.on": "تم تشغيل بطاقة الترحيب.",
    "welcome_card.off": "تم إيقاف بطاقة الترحيب.",
    "welcome_card.alreadyOn": "بطاقة الترحيب قيد التشغيل بالفعل.",
    "welcome_card.alreadyOff": "تم إيقاف بطاقة الترحيب بالفعل.",
    "error": "لقد حدث خطأ، رجاء أعد المحاولة لاحقا."
  }
};

function onLoad() {
  if (!global.hasOwnProperty("welcome_card")) global.welcome_card = {};
}

async function onCall({ message, args }) {
  const prompt = await args.join(' ');
  const threadID = message.threadID;
  const { reply } = message;
  if (prompt == "on") {
    if (global.welcome_card.hasOwnProperty(message.threadID)) return message.reply("Welcome card and other events is already on.");
    global.welcome_card[message.threadID] = true;
    return message.reply("Welcome card and other events is now on.");
  }
  if (prompt == "off") {
    if (!global.welcome_card.hasOwnProperty(message.threadID)) return message.reply("Welcome card and other events is already off.");
    delete global.welcome_card[message.threadID];
    return message.reply("Welcome card and other events is now off.");
  }
}

export {
  config,
  langData,
  onCall,
  onLoad
};
