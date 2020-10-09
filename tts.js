const express = require("express");
const opn = require("opn");
const textToSpeech = require("@google-cloud/text-to-speech");

const client = new textToSpeech.TextToSpeechClient();
const app = express();

process.env.GOOGLE_APPLICATION_CREDENTIALS = __dirname + "/credentials.json";

app.use(express.json());

app.use(express.static("public"));

app.post("/api", async (req, res) => {
  const text = req.body.text;

  const request = {
    input: { text: text },
    voice: { languageCode: "en-US", name: "en-US-Wavenet-D" },
    audioConfig: { audioEncoding: "LINEAR16" },
  };

  const [response] = await client.synthesizeSpeech(request);

  res.send(response);
});

console.log("Daniel starting on http://localhost:8080");
opn("http://localhost:8080");

app.listen(8080);
