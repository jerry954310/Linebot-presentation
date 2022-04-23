import { Client, middleware } from "@line/bot-sdk";
import express from "express";

// congig 物件 (middleware 及 create Client object 時會用到)
const config = {
  channelAccessToken:
    "zd8cP1SSEkhGFu3FoKC+rCGbHI4b3wPl6/bRd304LQUMEpGPVKBjQ008Y1RPvehWyjtOjavRmuGHRruAExcbIooBQ7WUdupcg/KeXZxD+9quTH2gznoXStbLPTWHQNMhIfkO8BHfzTWtj5Wpydp5JwdB04t89/1O/w1cDnyilFU=",
  channelSecret: "feeae0027ae274090c262a6bff017ba1",
};

const app = express();

//實作 webhook handler，並掛上用來轉譯的 middleware
app.post("/webhook", middleware(config), (req, res) => {
  Promise.all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

//Client 用來傳訊息
const client = new Client(config);

// event handler
function handleEvent(event) {
  switch (event.type) {
    case "follow":
      return client.replyMessage(event.replyToken, {
        type: "text",
        text: "歡迎加入林哲漳的Line Bot!",
      });

    case "unfollow":
      return client.replyMessage(event.replyToken, {
        type: "text",
        text: "歡迎再次使用！",
      });

    case "message":
      if (event.message.type === "text") {
        switch (event.message.text) {
          case "關於我":
            return client.replyMessage(replyToken, {
              type: "text",
              text: "喜歡學習新事物，熱愛與不同領域背景的人互動，學習用不同觀點才思考問題。",
            });
          case "學歷":
            return client.replyMessage(event.replyToken, {
              type: "text",
              text: "國立政治大學資管所\n2021 - 2023\n\n國立中正大學資管系\n2017 - 2021",
            });
          case "工作經歷":
            return client.replyMessage(event.replyToken, {
              type: "text",
              text: "OurSong, KKCompany\n前端實習工程師",
            });

          case "個人特質":
            return client.replyMessage(event.replyToken, {
              type: "text",
              text: `喜歡接觸新事物，熱愛與人互動，學習用不同角度思考問題`,
            });

          default:
            return client.replyMessage(event.replyToken, {
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
                    label: "關於我",
                    type: "message",
                    text: "關於我",
                  },
                  {
                    label: "學歷",
                    type: "message",
                    text: "學歷",
                  },
                  {
                    label: "工作經歷",
                    type: "message",
                    text: "工作經歷",
                  },
                ],
              },
            });
        }
      }
  }

  //replyMessage的第一個參數是 reply_token
  //當使用者傳訊息給此 line bot，會產生一個reply_token
  //bot會拿著這個token回覆傳訊息的使用者，且用完即丟
  //第二個參數：要執行的動作

  // switch (event.message.type) {
  //   case "message":
  //     if (event.message.text === "學歷") {
  //       return client.replyMessage(event.replyToken, {
  //         type: "text",
  //         text: "國立政治大學 資訊管理學系 碩一",
  //       });
  //     } else if (event.message.text === "工作經歷") {
  //       return client.replyMessage(event.replyToken, {
  //         type: "text",
  //         text: "前端實習工程師 OurSong, KKCompany",
  //       });
  //     } else {
  //       return client.replyMessage(
  //         event.replyToken,
  //         "想知道些什麼呢？學歷或是工作經歷"
  //       );
  //     }
  // }
}

// listen on port
app.listen(process.env.PORT || 3000);
