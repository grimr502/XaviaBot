import { join } from "path";
import { loadImage, createCanvas } from "canvas";

export const config = {
    name: "batslap",
    version: "0.0.1-xaviabot-port-refactor",
    credits: "Isai Ivanov",
    description: "",
    usage: "[mention/reply]",
    cooldown: 5
};

const batPath = join(global.assetsPath, "batslap.png");
export async function onLoad() {
    global.downloadFile(batPath, "https://s10.gifyu.com/images/images-3.jpg");
}

export async function makeImage({ one, two }) {
    const template = await loadImage(batPath);

    let avatarPathOne = join(global.cachePath, `avt_${one}.png`);
    let avatarPathTwo = join(global.cachePath, `avt_${two}.png`);

    await global.downloadFile(avatarPathOne, global.getAvatarURL(one));
    await global.downloadFile(avatarPathTwo, global.getAvatarURL(two));

    const avatarOne = await loadImage(avatarPathOne);
    const avatarTwo = await loadImage(avatarPathTwo);

    const avatarOneCircle = await global.circle(avatarOne, avatarOne.width / 2, avatarOne.height / 2, avatarOne.width / 2);
    const avatarTwoCircle = await global.circle(avatarTwo, avatarTwo.width / 2, avatarTwo.height / 2, avatarTwo.width / 2);

    const canvas = createCanvas(template.width, template.height);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(template, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(avatarOneCircle, 340, 80, 120, 120);
    ctx.drawImage(avatarTwoCircle, 135, 150, 140, 140);

    const pathImg = join(global.cachePath, `bat_${one}_${two}.png`);
    const imageBuffer = canvas.toBuffer();

    global.deleteFile(avatarPathOne);
    global.deleteFile(avatarPathTwo);

    global.writeFile(pathImg, imageBuffer);
    return pathImg;
}

export async function onCall({ message }) {
    const { type, senderID, mentions, messageReply } = message;
     let none = "";
    let targetID = type == 'message_reply' ? messageReply.senderID : Object.keys(mentions).length > 0 ? Object.keys(mentions)[0] : none ;
    if (!targetID) return message.reply("please tag or reply to a person.");
    else {
        const one = senderID, two = targetID;
        return makeImage({ one, two })
            .then(async path => {
                await message.reply({
                    attachment: global.reader(path)
                }).catch(e => {
                    message.reply("An error occurred, please try again.");
                    console.error(e);
                });

                global.deleteFile(path);
            })
            .catch(e => {
                message.reply("An error occurred, please try again.");
                console.error(e);
            });
    }
}