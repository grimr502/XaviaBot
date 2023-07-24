import axios from 'axios';

const config = {
  name: "img2txt",
  description: "Collect texts from an image.",
  usage: "[reply]",
  cooldown: 3,
  permissions: [0, 1, 2],
  credits: "Isai Ivanov"
};

const langData = {
  "vi_VN": {
    "replyMessage": "Vui lòng reply tin nhắn",
    "noAttachment": "Không có tệp đính kèm",
    "noSupportedAttachment": "Không có tệp đính kèm hỗ trợ, chỉ hỗ trợ ảnh và ảnh động",
    "uploadFailed": "Lấy link thất bại",
    "error": "Đã xảy ra lỗi"
  },
  "en_US": {
    "replyMessage": "Please reply a message",
    "noAttachment": "No attachment",
    "noSupportedAttachment": "No supported attachment, only support photo and animated image",
    "uploadFailed": "Upload failed",
    "error": "An error occured"
  },
  "ar_SY": {
    "replyMessage": "الرجاء الرد على الرسالة",
    "noAttachment": "لا يوجد مرفق",
    "noSupportedAttachment": "لا يوجد مرفق مدعوم ، يدعم فقط الصور والصورة المتحركة",
    "uploadFailed": "فشل الرفع",
    "error": "حدث خطأ"
  }
};

const supportedType = ["photo", "animated_image"];
const apiUrl = 'https://ocr.fake-chat.repl.co/ocr';

async function onCall({ message, getLang }) {
  try {
    const { type, messageReply } = message;

    if (type != "message_reply") return message.reply(getLang("replyMessage"));

    let { attachments } = messageReply;

    if (!attachments || !attachments.length) return message.reply(getLang("noAttachment"));

    let filteredAttachments = attachments.filter(attachment => supportedType.includes(attachment.type));

    if (!filteredAttachments.length) return message.reply(getLang("noSupportedAttachment"));

    let urls = [];
    for (let attachment of filteredAttachments) {
      urls.push(attachment.url);
    }

    const requestData = {
      url: urls[0],
    };

    axios
      .post(apiUrl, requestData)
      .then((response) => {
        console.log('Response:', response.data);
        // Handle the extracted text from response.data.text
        const text = response.data.text.replace(/\r/g, ''); // Remove \r from the text
        const formattedText = text.replace(/(\r\n|\r|\n)/g, ' - '); // Replace line breaks with a space
        message.reply(response.data.text);
      })
      .catch((error) => {
        console.error('Error:', error.response.data);
        // Handle the error response
        message.reply("Error collecting text from the image.");
      });
  } catch (err) {
    console.error(err);
    message.reply(getLang("error"));
  }
}

export default {
  config,
  langData,
  onCall
}
