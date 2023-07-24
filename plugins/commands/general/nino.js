const config = {
  name: "dev",
  version: "1.1.0",
  description: "Talk with TriBot",
  usage: "[text]",
  cooldown: 3,
  permissions: [0, 1, 2],
  credits: "XaviaTeam"
}

const langData = {
  "en_US": {
    "on": "TriBot is now on",
    "off": "TriBot is now off",
    "alreadyOn": "TriBot is already on",
    "alreadyOff": "TriBot is already off",
    "missingInput": "Please enter the content you want to chat with TriBot",
    "noResult": "TriBot doesn't understand what you're saying :(",
    "error": "An error occurred, please try again later"
  },
  "vi_VN": {
    "on": "TriBot đã được bật",
    "off": "TriBot đã được tắt",
    "alreadyOn": "TriBot đã được bật",
    "alreadyOff": "TriBot đã được tắt",
    "missingInput": "Vui lòng nhập nội dung cần trò chuyện với TriBot",
    "noResult": "TriBot không hiểu bạn đang nói gì :(",
    "error": "Có lỗi xảy ra, vui lòng thử lại sau"
  },
  "ar_SY": {
    "on": "TriBot is now on",
    "off": "TriBot is now off",
    "alreadyOn": "TriBot is already on",
    "alreadyOff": "TriBot is already off",
    "missingInput": "الرجاء إدخال المحتوى الذي تريد الدردشة مع نينو",
    "noResult": "نينو لا تفهم ما تقول :(",
    "error": "لقد حدث خطأ، رجاء أعد المحاولة لاحقا"
  }
}

function onLoad() {
  if (!global.hasOwnProperty("nino")) global.nino = {};
}

async function onCall({ message, args, getLang, userPermissions }) {
  const input = args.join(" ");
  if (!input) return message.reply(getLang("missingInput"));

  if (input == "on" || input == "off")
    if (!userPermissions.includes(1)) return;

  if (input == "on") {
    if (global.nino.hasOwnProperty(message.threadID)) return message.reply(getLang("alreadyOn"));
    global.nino[message.threadID] = true;

    return message.reply(getLang("on"));
  } else if (input == "off") {
    if (!global.nino.hasOwnProperty(message.threadID)) return message.reply(getLang("alreadyOff"));
    delete global.nino[message.threadID];

    return message.reply(getLang("off"));
  }
  if (global.nino.hasOwnProperty(message.threadID)) return;

  global
    .GET(`${global.xva_api.main}/nino/get?key=${encodeURIComponent(input)}`)
    .then((res) => {
      const { data } = res;
      const { status } = data;

      if (status == 1) {
        return message.reply(data.reply);
      } else {
        return message.reply(getLang("noResult"));
      }
    })
    .catch((err) => {
      return message.reply(getLang("error"));
    });
}

export default {
  config,
  onLoad,
  langData,
  onCall
}
