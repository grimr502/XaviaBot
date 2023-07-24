import axios from "axios";
import google from "googlethis";

const config = {
  name: "citizendium",
  version: "1.0.0",
  hasPermission: 0,
  credits: "JOHN RÉ PORAS",
  description: "This serves as a free, open, and collaborative online encyclopedia that provides information on a wide range of topics. It aims to compile knowledge from various sources and contributors around the world and make it accessible to anyone with an internet connection.",
  usage: "[query]",
  permissions: [0, 1, 2],
  cooldowns: 5,
};

const langData = {
  "vi_VN": {
    "citizendium.error": "Đã xảy ra lỗi trong quá trình tìm kiếm. Vui lòng thử lại sau."
  },
  "en_US": {
    "citizendium.error": "An error occurred during the search. Please try again later."
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

    google.search(`site:en.citizendium.org ${query}`, options)
      .then(async (response) => {
        if (response.results.length > 0) {
          let title = response.results[0].title;
          let description = response.results[0].description;
          let url = response.results[0].url;

          let result = `𝗧𝗜𝗧𝗟𝗘: ${title}\n\n𝗗𝗘𝗦𝗖𝗥𝗜𝗣𝗧𝗜𝗢𝗡: ${description}\n\n𝗨𝗥𝗟: ${url}\n\n`;

          try {
            const apiResponse = await axios.get(`https://en.citizendium.org/api.php?format=json&action=query&prop=extracts&exintro&explaintext&titles=${encodeURIComponent(title)}`);
            const pages = apiResponse.data.query.pages;
            const pageId = Object.keys(pages)[0];
            const pageData = pages[pageId];
            const extract = pageData.extract || "";

            if (extract) {
              result += `SUMMARY: ${extract}\n\n`;
            }

            result += `HISTORY: ${url}/History\n`;
            result += `REFERENCES: ${url}/References\n`;
            result += `PUBLISHED: ${url}\n\n`;
            result += `All written content is available under the Creative Commons-Attribution-ShareAlike 3.0 Unported license or any later. Written content that originated in part from Wikipedia is also available under Creative Commons Attribution-NonCommercial-ShareAlike.\n\n`;
          } catch (error) {
            console.error("🚫 ERROR!\n\nError fetching API:", error);
          }

          send(result).then(() => {
            message.react("✅"); // React with a success emoji
          });
        } else {
          send("🚫 INVALID!\n\nNo results found for the given query.").then(() => {
            message.react("❌"); // React with an error emoji
          });
        }
      })
      .catch((error) => {
        console.error("Error occurred while searching:", error);
        message.react("❌"); // React with an error emoji
        send(getLang("citizendium.error")); // Send an error message
      });
  } catch (error) {
    console.error("Error occurred while searching:", error);
    message.react("❌"); // React with an error emoji
    send(getLang("citizendium.error")); // Send an error message
  }
}

export default {
  config,
  langData,
  onCall,
};
