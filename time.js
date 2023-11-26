/** ---- Kiểm Tra Thời Gian Kèm Ảnh ( Ảnh Đéo Gửi Được :> ) -----**/

// Tạo 1 thư mục photo trước nha!

import axios from 'axios';
import fs from 'fs';

const config = {
  name: "time",
  aliases: ["Bây giờ là mấy giờ?", "Thời gian hiện tại", "time", "Việt nam", "vn"],
  version: "1.0.0",
  description: "Kiểm tra thời gian hiện tại ở Việt Nam",
  usage: "[]",
  cooldown: 3,
  permissions: [2],
  credits: "XIE"
}

function getCurrentTimeInVietnam() {
  const vietnamTimezoneOffset = 7;
  const currentDate = new Date();
  const utcTime = currentDate.getTime() + (currentDate.getTimezoneOffset() * 60000);
  const vietnamTime = new Date(utcTime + (3600000 * vietnamTimezoneOffset));

  const daysOfWeek = ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"];
  const day = daysOfWeek[vietnamTime.getDay()];
  const dateString = `${day} - ${vietnamTime.toLocaleDateString('vi-VN')}`;
  const timeString = vietnamTime.toLocaleTimeString('vi-VN');

  return `${dateString} - ${timeString}`;
}

const clean = (path) => {
  try {
    if (fs.existsSync(path)) {
      fs.unlinkSync(path);
    }
  } catch (error) {
    console.error("Error while deleting file:", error);
  }
};

async function downloadImageAndReply({ message, imageUrl }) {
  try {
    const response = await axios({
      method: 'GET',
      url: imageUrl,
      responseType: 'arraybuffer',
    });

    const imageData = Buffer.from(response.data, 'binary');

    const imagePath = 'photo/image.jpg';
    fs.writeFileSync(imagePath, imageData);

    await message.reply(`✎ ONLINE 𓆙\n◘ Thời gian hiện tại\n╰┈➤ ${getCurrentTimeInVietnam()}`, {
      files: [{ attachment: imageData, name: 'image.jpg' }],
    });

    clean(imagePath);

  } catch (error) {
    console.error("Error while replying:", error);
  }
}

async function onCall({ message }) {
  const uptimeInSeconds = process.uptime();
  const hours = Math.floor(uptimeInSeconds / 3600);
  const minutes = Math.floor((uptimeInSeconds % 3600) / 60);
  const seconds = Math.floor(uptimeInSeconds % 60);

  try {
    const apiResponse = await axios.get('https://api.samirthakuri.repl.co/api/anime');
    const imageUrl = apiResponse.data.imageUrl;

    await downloadImageAndReply({ message, imageUrl });
  } catch (error) {
    console.error("Error while fetching image:", error);
  }
}

export default {
  config,
  onCall,
};


/***=============================================================== 
====== Lười fix vcac, ai fix được cho t xin với t.me/ktvcau ======= 
================================================================***/

// Vẫn tải ảnh xuống nhưng nó đéo gửi ảnh được, t thử bao nhiều lần rồi - ai giỏi thì giúp i
