import axios from "axios";
import google from "googlethis";

const config = {
  name: "eric",
  version: "1.0.0",
  credits: "JOHN RÉ PORAS (converted by DYMYRIUS)",
  description: "ERIC (Education Resources Information Center) Ed Gov is to serve as a comprehensive online resource for education-related research, information, and resources.",
  usage: "[query]",
  permissions: [0, 1, 2],
  cooldowns: 5,
};

const langData = {
  "vi_VN": {
    "eric.error": "Đã xảy ra lỗi trong quá trình tìm kiếm. Vui lòng thử lại sau."
  },
  "en_US": {
    "eric.error": "An error occurred during the search. Please try again later."
  }
};

async function onCall({ message, args, getLang }) {
  try {
    const { send, react } = message;
    const query = args.join(" ");
    react("⌛"); // React with a loading emoji

    const options = {
      page: 0,
      safe: false,
      additional_params: {
        hl: "en",
      },
    };

    google.search(`site:eric.ed.gov ${query}`, options)
      .then((response) => {
        let results = "";
        for (let i = 0; i < 10; i++) {
          let title = response.results[i].title;
          let description = response.results[i].description;
          let url = response.results[i].url;
          results += `📌 ${i + 1}:\n\n𝗧𝗜𝗧𝗟𝗘: ${title}\n\n𝗗𝗘𝗦𝗖𝗥𝗜𝗣𝗧𝗜𝗢𝗡: ${description}\n\n𝗨𝗥𝗟: ${url}\n\n━━━━━━━━━━━━━\n\n`;
        }
        send(`Here are the 10 results for "${query}".\n\n` + results).then(() => {
          message.react("✅"); // React with a success emoji
        });
      })
      .catch((error) => {
        console.error("Error occurred while searching:", error);
        message.react("❌"); // React with an error emoji
        send(getLang("eric.error")); // Send an error message
      });
  } catch (error) {
    console.error("Error occurred while searching:", error);
    message.react("❌"); // React with an error emoji
    send(getLang("eric.error")); // Send an error message
  }
}

export default {
  config,
  langData,
  onCall,
};
