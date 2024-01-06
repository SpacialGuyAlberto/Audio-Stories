const express = require('express');
const router = express.Router();
const app = express();
const path = require("path");
const OpenAI = require("openai");
const fs = require("fs");
const bodyParser = require('body-parser');

const openai = new OpenAI({
    apiKey: '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',
    organization:'org-V1q1pWiIxPdI1WokaKWMHhnI'
});

router.post('/createStory', async (req, res) => {

  console.log('hey brou');
  const { parameter } = req.body;
  console.log(parameter);
  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: 'system', content: `write a short story about a ${parameter}. The short story must have only 2500 characters! no more than that. the story must have a title, divide title and content i want to have the story as an json object. ` }],
      model: 'gpt-3.5-turbo',
    });
    const story = completion.choices[0].message.content;
    console.log(story);
    res.json({ story });
  } catch (error) {
    console.error('Error creating story:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/createStoryPicture', async (req, res) => {
  console.log('hey I am creating your image');
  const { parameter } = req.body;
  console.log(parameter);
  try {
    const image = await openai.images.generate({
      model: "dall-e-3",
      prompt: JSON.stringify(parameter),
    });
     if (image && image.data && image.data.length > 0) {
         image_url = image.data[0];
         res.json({ image_url });
          } else {
          res.status(500).json({ error: 'Invalid OpenAI response' });
      }
    console.log(image_url);
  } catch (error) {
    console.error('Error creating story:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


const speechFile = path.resolve("./speech3.mp3");
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json({ limit: '50mb' }));

router.post('/createStorySpeech', async (req, res) => {
  console.log('hey I am creating your audio');
  const { parameter } = req.body;
  console.log(parameter);
  try {
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "alloy",
      input: parameter,
    });

    console.log(speechFile);
    const buffer = Buffer.from(await mp3.arrayBuffer());
    await fs.promises.writeFile(speechFile, buffer);
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Disposition', 'attachment; filename=speech.mp3');
    res.json({ audioBuffer: Buffer.from(buffer).toString('base64') });
    //return buffer.toJSON();
  } catch (error) {
    console.error('Error creating speech:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;

