const config = {
  name: "sponge",
  aliases: ["sponge"],
  description: "Create spongebob meme",
  usage: "[text] | [text]",
  cooldown: 3,
  permissions: [0, 1, 2],
  credits: "Dymyrius"
}

const langData = {
  "vi_VN": {
    "missingInput": "Bạn chưa nhập dữ liệu",
    "missingInput2": "Bạn chưa nhập dữ liệu thứ 2",
    "error": "Có lỗi xảy ra, vui lòng thử lại sau"
  },
  "en_US": {
    "missingInput": "You haven't entered any text",
    "missingInput2": "Missing second input",
    "error": "An error occurred, please try again later"
  },
  "ar_SY": {
    "missingInput": "لم تدخل أي نص",
    "missingInput2": "الإدخال الثاني مفقود",
    "error": "لقد حدث خطأ، رجاء أعد المحاولة لاحقا"
  }
}

const onCall = ({ message, args, getLang }) => {
  const input = args.join(" ");
  if (input.length == 0) return message.reply(getLang("missingInput"));

  let url = input == "https://apimeme.com/create/Imagination-Spongebob/";

  let text1 = input.split("|")[0];
  let text2 = input.split("|")[1];

  if (!text2) return message.reply(getLang("missingInput2"));

  url = (text1 && text2 != null) ? `https://apimeme.com/meme?meme=Imagination-Spongebob&top=${text1}&bottom=${text2}` : url

  global.getStream(url)
    .then(stream => message.reply({ attachment: stream }).catch(e => console.error(e)))
    .catch(e => console.error(e));

}

export default {
  config,
  langData,
  onCall
}