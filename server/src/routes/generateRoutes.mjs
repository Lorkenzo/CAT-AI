import express from "express"
import { OpenAI } from "openai"
import dotenv from "dotenv"
import { extractionPrompt, generatePrompt, regenerateElementPrompt, regenerateAllPrompt, generateImagePrompt, cleanJSON } from "../utils.mjs";
import { pipeline } from "stream";
import { promisify } from "util";
import path from "path"
import fs from "fs"

const PORT = 3001

const generateRoutes = express.Router();

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const streamPipeline = promisify(pipeline);

generateRoutes.post('/exercise-info', async (req, res) => {
  const { text } = req.body;

  const prompt = extractionPrompt(text)

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
    });
    
    const result = JSON.parse(cleanJSON(completion.choices[0].message.content));
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Errore durante l\'analisi' });
  }
});

generateRoutes.post('/exercise', async (req, res) => {
  const { data } = req.body;

  try {
    const prompt = generatePrompt(data);
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8,
    });

    const result = JSON.parse(cleanJSON(completion.choices[0].message.content));
    res.json(result);
  } catch (error) {
    console.error('Errore:', error);
    res.status(500).json({ error: 'Errore durante la generazione.' });
  }
});

generateRoutes.post('/exercise-again', async (req, res) => {
  const { textBoxes, text } = req.body;

  try {
    const prompt = regenerateAllPrompt(textBoxes,text);
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.6,
    });

    const result = JSON.parse(cleanJSON(completion.choices[0].message.content));
    res.json(result);
  } catch (error) {
    console.error('Errore:', error);
    res.status(500).json({ error: 'Errore durante la generazione.' });
  }
});

generateRoutes.post('/element-again', async (req, res) => {
  const { textBoxes,  selectedId, text } = req.body;

  try {
    const prompt = regenerateElementPrompt(textBoxes,selectedId,text);
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.6,
      max_tokens: 150, // limite rigido di sicurezza
    });

    const result = JSON.parse(cleanJSON(completion.choices[0].message.content));
    res.json(result);
  } catch (error) {
    console.error('Errore:', error);
    res.status(500).json({ error: 'Errore durante la generazione.' });
  }
});

generateRoutes.post('/image', async (req, res) => {
  const { text, palette } = req.body;

  try {
    const prompt = generateImagePrompt(text, palette);

    const response = await openai.images.generate({
      model: 'dall-e-2',
      prompt: text,
      size: "256x256",
      response_format: "url",
    });

    const imageUrl = response.data[0].url;
    const fetchResponse = await fetch(imageUrl);

    if (!fetchResponse.ok) {
      throw new Error(`Errore durante il download: ${fetchResponse.statusText}`);
    }

    const ext = '.png';
    const fileName = `generated-${Date.now()}${ext}`;
    const savePath = path.join('uploads', fileName);
    const fileUrl = `http://localhost:${PORT}/uploads/${fileName}`;

    await streamPipeline(fetchResponse.body, fs.createWriteStream(savePath));

    res.json({ url: fileUrl });
  } catch (error) {
    console.error('Errore:', error);
    res.status(500).json({ error: 'Errore durante la generazione o il salvataggio dell\'immagine.' });
  }
});


export default generateRoutes;