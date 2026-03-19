require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname)));

const client = new Anthropic();

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: process.env.SYSTEM_PROMPT,
      messages,
    });

    res.json({ text: response.content[0].text });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ text: 'Error al conectar con el modelo.' });
  }
});

const PORT = process.env.PORT || 3457;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
