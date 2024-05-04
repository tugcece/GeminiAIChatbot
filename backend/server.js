const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

require("dotenv").config();

const { GoogleGenerativeAI } = require("@google/generative-ai");
const PORT = process.env.PORT || 8001;
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_KEY);

app.post("/api/chatbot", async (req, res) => {
  console.log(req.body.history);
  console.log(req.body.message);

  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const chat = model.startChat({
    history: req.body.history,
  });
  const msg = req.body.message;
  const result = await chat.sendMessage(msg);
  const response = await result.response;
  const text = response.text();
  res.send(text);
  console.log(text);
});

app.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor`);
});
