const { api } = global;
import axios from 'axios';
async function onCall({ message, getLang, args }) {
  const { Users } = global.controllers
  global.chanle || (global.chanle = new Map);
  var bcl = global.chanle.get(message.threadID);
  const anhbcl = (await axios.get("https://i.imgur.com/LClPl36.jpg", {
    responseType: "stream"
  })).data;
  const { senderID, threadID, messageID, body, send, reply, react } = message;
  var cl = ["even", "odd"]
  var o = (await Users.getMoney(message.senderID) || null, cl[Math.floor(Math.random() * cl.length)]);
  if (message.body && ("even" == message.body.toLowerCase() || "odd" == message.body.toLowerCase())) {
    const bcl = global.chanle.get(message.threadID) || {};
    if (!bcl) return;
    if (1 != bcl.start) return;
    if (!bcl.player.find((player) => player.userID == message.senderID)) return;
    var i, c = bcl.player.findIndex((player) => player.userID == message.senderID);
    if (1 == (i = bcl.player[c]).choose.status) return global.api.sendMessage("Once you have selected, you cannot choose again!", message.threadID, message.messageID);
    "even" == message.body.toLowerCase() ? (bcl.player.splice(c, 1), bcl.player.push({
      name: i.name,
      userID: message.senderID,
      choose: {
        status: !0,
        msg: "even"
      }
    }), global.api.sendMessage(`${i.name} chose even.`, message.threadID, message.messageID)) : (bcl.player.splice(c, 1), bcl.player.push({
      name: i.name,
      userID: message.senderID,
      choose: {
        status: !0,
        msg: "odd"
      }
    }), global.api.sendMessage(`${i.name} oddly selected.`, message.threadID, message.messageID));
    var m = 0,
      u = bcl.player.length;
    for (var l of bcl.player) 1 == l.choose.status && m++;
    if (m != u) return; {
      const roll = (await axios.get("https://i.imgur.com/P3UEpfF.gif", {
        responseType: "stream"
      })).data;
      global.api.sendMessage({
        body: "Checking results...",
        attachment: roll
      }, message.threadID, async (err, data) => {
        if (err) return global.api.sendMessage(err, message.threadID, message.messageID);
        setTimeout((async function() {
          global.api.unsendMessage(data.messageID);
          var t = o,
            r = [],
            h = [];
          var i = images();
          if (0 == t.indexOf("even"))
            for (var c of bcl.player) "even" == c.choose.msg ? r.push({
              name: c.name,
              userID: c.userID
            }) : h.push({
              name: c.name,
              userID: c.userID
            });
          else
            for (var c of bcl.player) "odd" == c.choose.msg ? r.push({
              name: c.name,
              userID: c.userID
            }) : h.push({
              name: c.name,
              userID: c.userID
            });
          const m = (await axios.get(i[Math.floor(5 * Math.random())], {
            responseType: "stream"
          })).data;
          var u = "💎 𝐓𝐡𝐞 𝐫𝐞𝐬𝐮𝐥𝐭 𝐢𝐬: " + t.toUpperCase() + "\n\n➣ 𝐏𝐥𝐚𝐲𝐞𝐫𝐬 𝐰𝐡𝐨 𝐰𝐨𝐧 𝐭𝐡𝐞 𝐠𝐚𝐦𝐞 💵:\n",
            l = 0,
            p = 0;
          for (var d of r) {
            await Users.getMoney(d.userID);
            await Users.increaseMoney(d.userID, bcl.money), u += ++l + ". " + d.name + "\n------------\n"
          }
          for (var y of h) {
            await Users.getMoney(y.userID);
            await Users.decreaseMoney(y.userID, bcl.money), 0 == p && (u += "\n➣ 𝐏𝐥𝐚𝐲𝐞𝐫𝐬 𝐰𝐡𝐨 𝐥𝐨𝐬𝐭 𝐭𝐡𝐞 𝐠𝐚𝐦𝐞 💸:\n"), u += ++p + ". " + y.name + "\n------------\n"
          }
          return u += "\n• 𝐓𝐨𝐭𝐚𝐥 𝐰𝐨𝐧 𝐭𝐡𝐢𝐬 𝐫𝐨𝐮𝐧𝐝: + " + bcl.money + "$\n", u += "• 𝐓𝐨𝐭𝐚𝐥 𝐥𝐨𝐬𝐭 𝐭𝐡𝐢𝐬 𝐫𝐨𝐮𝐧𝐝: - " + bcl.money + "$\n-----------\n Game created by Sies!", global.chanle.delete(message.threadID), global.api.sendMessage({
            body: u,
            attachment: m
          }, message.threadID, message.messageID)
          function images() {
            if ("even" == t)
              var i = ["https://i.imgur.com/6fIJU1q.jpg", "https://i.imgur.com/XPg6Uvq.jpg", "https://i.imgur.com/IWjB9kN.jpg", "https://i.imgur.com/XVxgPhY.png", "https://i.imgur.com/dRzktqf.png"];
            else if ("odd" == t)
              i = ["https://i.imgur.com/u1DjwX0.png", "https://i.imgur.com/unnBcv9.png", "https://i.imgur.com/181R8Te.jpg", "https://i.imgur.com/y67IGtv.jpg", "https://i.imgur.com/y67IGtv.jpg"];
            return i;
          }
          
        }), global.api.unsendMessage(data.messageID) , 500)

      });
    }
  }
}

export default {
  onCall
}