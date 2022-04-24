import { Client, middleware } from "@line/bot-sdk";
import express from "express";

// congig 物件 (middleware 及 create Client instance 時會用到)
const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

const app = express();

//實作 webhook handler
//middleware 用來解析 req.body 及 驗證 signature
app.post("/webhook", middleware(config), (req, res) => {
  Promise.all(req.body.events.map(eventHandler))
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

//client instance 用來傳送訊息，或用來取得使用者或內容的資訊
const client = new Client(config);

//實作 eventHandler，處理不同類型的 event
function eventHandler(event) {
  const msgTemplate = {
    type: "template",
    altText: "林哲漳的Line Bot",
    template: {
      type: "buttons",
      thumbnailImageUrl:
        "https://i.imgur.com/QuNIImS_d.webp?maxwidth=760&fidelity=grand.jpeg",
      title: "想了解我什麼事？",
      text: "林哲漳 Jerry Lin",
      actions: [
        {
          label: "個人特質",
          type: "message",
          text: "個人特質",
        },
        {
          label: "工作經歷",
          type: "message",
          text: "工作經歷",
        },
        {
          label: "我的興趣",
          type: "message",
          text: "我的興趣",
        },
        {
          label: "喜歡聽的音樂",
          type: "message",
          text: "喜歡聽的音樂",
        },
      ],
    },
  };

  switch (event.type) {
    case "follow":
      return client.replyMessage(event.replyToken, msgTemplate);

    case "message":
      if (event.message.type === "text") {
        switch (event.message.text) {
          case "工作經歷":
            return client.replyMessage(event.replyToken, {
              type: "text",
              text: "$\nOurSong, KKCompany\n前端實習工程師\nMar 2022 - Present\n\n我使用 React 框架開發 NFT D-App，除了導入 web3.js 連接 Metamsk 錢包外，也實作與 ERC 合約互動的功能",
              emojis: [
                {
                  index: 0,
                  productId: "5ac22b23040ab15980c9b44d",
                  emojiId: "002",
                },
              ],
            });

          case "個人特質":
            return client.replyMessage(event.replyToken, {
              type: "text",
              text: "$\n三個形容詞來代表自己：\n$專注細節\n$樂於溝通\n$抗壓性強\n\n我喜歡與人溝通，分享及聆聽彼此的想法，也熱愛學習不同的思考方式，從各種角度來思考問題",
              emojis: [
                {
                  index: 0,
                  productId: "5ac22b23040ab15980c9b44d",
                  emojiId: "022",
                },
                {
                  index: 14,
                  productId: "5ac21a18040ab15980c9b43e",
                  emojiId: "085",
                },
                {
                  index: 20,
                  productId: "5ac21a18040ab15980c9b43e",
                  emojiId: "085",
                },
                {
                  index: 26,
                  productId: "5ac21a18040ab15980c9b43e",
                  emojiId: "085",
                },
              ],
            });

          case "喜歡聽的音樂":
            return client.replyMessage(event.replyToken, {
              type: "text",
              text: "$\nhttps://www.kkbox.com/tw/tc/playlist/HZvGqbjTzAH64-EQwS",
              emojis: [
                {
                  index: 0,
                  productId: "5ac2216f040ab15980c9b448",
                  emojiId: "027",
                },
              ],
            });

          case "我的興趣":
            return client.replyMessage(event.replyToken, {
              type: "text",
              text: "$ 美食探索\n$ 戶外運動\n$ 異國旅遊",
              emojis: [
                {
                  index: 0,
                  productId: "5ac1de17040ab15980c9b438",
                  emojiId: "035",
                },
                {
                  index: 7,
                  productId: "5ac1de17040ab15980c9b438",
                  emojiId: "125",
                },
                {
                  index: 14,
                  productId: "5ac1de17040ab15980c9b438",
                  emojiId: "109",
                },
              ],
            });

          default:
            return client.replyMessage(event.replyToken, msgTemplate);
        }
      }
  }
}

//監聽
app.listen(process.env.PORT || 3000);
