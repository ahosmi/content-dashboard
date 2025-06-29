const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

exports.generateSuggestions = async (req, res) => {
  const { topic, platform } = req.body;

  const prompt = `Suggest 5 catchy ${platform} content titles/captions for the topic: "${topic}". Be short, creative, and platform-appropriate.`;

  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo"
    });

    const suggestions = completion.choices[0].message.content
      .split('\n')
      .filter(line => line.trim() !== '');

    res.json({ suggestions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate suggestions" });
  }
};
