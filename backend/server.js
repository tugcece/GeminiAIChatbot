const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

require("dotenv").config();

const { GoogleGenerativeAI } = require("@google/generative-ai");
const PORT = process.env.PORT || 8001;
// Initialize the Google Generative AI with the API key from environment variables
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_KEY);

// POST endpoint
app.post(
  "/",
  async (req, res) => {
    console.log(req.body.history);
    console.log(req.body.message);

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
     // Start a chat session based on history
    const chat = model.startChat({
      history: req.body.history,
    });
    const msg = req.body.message;
    // Send the message and await the response
    const result = await chat.sendMessage(msg);
    const response = await result.response;
    const text = response.text();
    
    //Added to prevent Cors errors.
    //CORS headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Max-Age", "1800");
    res.setHeader("Access-Control-Allow-Headers", "content-type");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "PUT, POST, GET, DELETE, PATCH, OPTIONS"
    ); 
    // send response
    res.send(text);
    console.log(text);
  }
);

app.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor`);
});
