// Lightweight API scaffold. Install express, multer, openai and cors for production use.
import express from 'express';
import multer from 'multer';
import cors from 'cors';
import OpenAI from 'openai';

const app = express();
const upload = multer({ dest: 'uploads/' });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
app.use(cors()); app.use(express.json());

const recipeSchema = { type: 'object', properties: { recipe_title: { type: 'string' }, description: { type: 'string' }, prep_time: { type: 'string' }, cook_time: { type: 'string' }, servings: { type: 'number' }, ingredients: { type: 'array', items: { type: 'object', properties: { amount: { type: 'string' }, unit: { type: 'string' }, name: { type: 'string' } }, required: ['amount', 'unit', 'name'], additionalProperties: false } }, steps: { type: 'array', items: { type: 'string' } }, key_tips: { type: 'array', items: { type: 'string' } } }, required: ['recipe_title', 'description', 'prep_time', 'cook_time', 'servings', 'ingredients', 'steps'], additionalProperties: false };

app.post('/api/extract', upload.single('video'), async (req, res) => {
  // 1. Download social URL or read req.file. 2. Send audio to Whisper. 3. Parse transcript with GPT.
  // Keep provider credentials on the server; never expose OPENAI_API_KEY in the browser.
  try {
    const transcript = req.body.transcript || 'No transcript supplied in demo mode.';
    const completion = await openai.chat.completions.create({ model: 'gpt-4o-mini', response_format: { type: 'json_schema', json_schema: { name: 'recipe', strict: true, schema: recipeSchema } }, messages: [{ role: 'system', content: 'Turn a cooking-video transcript into a concise, accurate recipe. Never invent quantities when absent; use an empty string.' }, { role: 'user', content: transcript }] });
    res.json(JSON.parse(completion.choices[0].message.content));
  } catch (error) { res.status(500).json({ error: 'Could not extract this recipe. Please try another video.' }); }
});
app.post('/api/cookbooks', (req, res) => res.status(201).json({ id: crypto.randomUUID(), ...req.body }));
app.post('/api/recipes', (req, res) => res.status(201).json({ id: crypto.randomUUID(), ...req.body }));
app.listen(process.env.PORT || 3000, () => console.log('Simmer API listening on port 3000'));
