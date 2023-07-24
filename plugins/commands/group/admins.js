const config = {
  name: "admins",
  aliases: ["ads"],
  version: "1.0.1",
  description: "List, Add or remove group Admins",
  permissions: [0, 1, 2],
  cooldown: 5,
  credits: "Isai Ivanov"
}

async function onCall({ message, args, data, userPermissions }) {
  const { type, messageReply, mentions, senderID, threadID, reply } = message;
    const { Users, Threads } = global.controllers;
  const threadInfo = await Threads.getInfoAPI(threadID);
    const { adminIDs } = threadInfo;
  try {

    //const { id } = adminIDs;
    const isGroupAdmin = userPermissions.some(p => p == 1);

    let query = args[0]?.toLowerCase();
    switch (query) {
      case "add":
        {
          if (!adminIDs.some(e => e.id == global.botID)) return reply("Bot needed to be an admin!");
          if (!isGroupAdmin) return reply("You dont have enough permission use this command");

          let success = [];
          if (type == "message_reply") {
            let userID = messageReply.senderID;
            if (adminIDs.some(e => e.id == userID)) return reply('This user is already an admin');
            global.api.changeAdminStatus(threadID, userID, true);
            success.push({
              id: userID,
              name: (await global.controllers.Users.getInfo(userID))?.name || userID
            });
          } else if (Object.keys(mentions).length > 0) {
            for (const userID in mentions) {
              global.api.changeAdminStatus(threadID, userID, true);
              if (adminIDs.some(e => e.id == userID)) reply(`${(await global.controllers.Users.getInfo(userID))?.name} is already an admin`);
              success.push({
                id: userID,
                name: (await global.controllers.Users.getInfo(userID))?.name || userID
              });
            }
          } else return reply("Please mention or reply to someone");


          reply({
            body: `Added ${success.map(user => user.name).join(", ")} as Admin`,
            mentions: success.map(user => ({ tag: user.name, id: user.id }))
          });;

          break;
        }
      case "remove":
      case "rm":
      case "delete":
      case "del":
        {
          if (!adminIDs.some(e => e.id == global.botID)) return reply("Bot needed to be an admin!");
          if (!isGroupAdmin) return reply("You don't have enough permission to use this command");

          let success = [];
          if (type == "message_reply") {
            let userID = messageReply.senderID;
            if (!adminIDs.some(e => e.id == userID)) return reply("This user is not an admin");
            global.api.changeAdminStatus(threadID, userID, false);
            success.push({
              id: userID,
              name: (await global.controllers.Users.getInfo(userID))?.name || userID
            });
          } else if (Object.keys(mentions).length > 0) {
            for (const userID in mentions) {
              global.api.changeAdminStatus(threadID, userID, false);
              if (adminIDs.some(e => e.id !== userID)) reply(`${(await global.controllers.Users.getInfo(userID))?.name} is not an admin`);
              success.push({
                id: userID,
                name: (await global.controllers.Users.getInfo(userID))?.name || userID
              });
            }
          } else return reply("Please mention or reply to someone");


          reply({
            body: `Removed ${success.map(user => user.name).join(", ")} from Admin`,
            mentions: success.map(user => ({ tag: user.name, id: user.id }))
          });;

          break;
        }
      default:
        {
          const adminlist = adminIDs.map(e => e.id);
          let msg = "Group Admins:\n";
          let arraytag = []
          for (let i = 0; i < adminlist.length; i++) {
            let Name = (await global.controllers.Users.getName(adminlist[i])) || "Facebook user";
            msg += `• ${Name} - ${adminlist[i]}\n`;
            //		mtn += `[{ tag: ${Name}, id: ${adminlist[i]} }]`;
           let tagss = { id: adminlist[i], tag: Name };
           arraytag.push(tagss);

          }
          console.log(arraytag)
          reply({
            body: msg,
            mentions: arraytag
          });
          break;
        }
    }
  } catch (error) {
    reply(`${error}`);
    console.log(error);
  }

  return;
}

export default {
  config,
  onCall
}