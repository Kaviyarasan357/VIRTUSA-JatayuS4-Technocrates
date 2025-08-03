const axios = require("axios");

async function analyzeSentiment(text) {
  try {
    const response = await axios.post('http://localhost:11434/api/generate', {
      model: "llama3",
      prompt: `You are a helpful assistant that classifies sentiment.\nClassify the sentiment of the following text as Positive, Negative, or Neutral.\nRespond with ONLY ONE WORD: Positive, Negative, or Neutral.\n\n"${text}"`,
      stream: false
    });

    const reply = response.data.response.toLowerCase().trim();

    let sentiment = 'neutral';
    let score = 0;

    if (reply === 'negative') {
      sentiment = 'negative';
      score = -1;
    } else if (reply === 'positive') {
      sentiment = 'positive';
      score = 1;
    } else if (reply === 'neutral') {
      sentiment = 'neutral';
      score = 0;
    } else {
      console.warn("⚠️ Unexpected LLM response:", reply);
    }

    return { sentiment, score };

  } catch (err) {
    console.error("❌ Ollama llama3 sentiment analysis failed:", err.message);
    throw new Error("Sentiment analysis failed");
  }
}

module.exports = { analyzeSentiment };
