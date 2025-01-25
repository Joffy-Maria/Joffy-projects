const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Configuration, OpenAIApi } = require("openai");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// OpenAI API setup
const openai = new OpenAIApi(
  new Configuration({
    apiKey: "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", // Replace with your OpenAI API key
  })
);

// Sample function to generate the prompt
const generatePrompt = (choice, history) => {
  let prompt = "You are writing a dynamic and interactive story. ";
  if (history.length > 0) {
    prompt += `Previously, the story was:\n${history
      .map((h) => h.story)
      .join("\n")}\n`;
  }
  prompt += `Now, the user chooses: "${choice}". What happens next? Provide the next part of the story and two new choices.`;
  return prompt;
};

// API endpoint
app.post("/api/story", async (req, res) => {
  const { choice, history } = req.body;

  try {
    const prompt = generatePrompt(choice, history);

    const response = await openai.createCompletion({
      model: "gpt-4",
      prompt: prompt,
      max_tokens: 200,
    });

    const text = response.data.choices[0].text.trim();
    const [story, ...choiceLines] = text.split("\n");
    const choices = choiceLines
      .filter((line) => line.startsWith("-"))
      .map((line) => ({
        text: line.replace("-", "").trim(),
        value: line.replace("-", "").trim().toLowerCase(),
      }));

    res.json({ story, choices });
  } catch (error) {
    console.error("Error with OpenAI API:", error);
    res.status(500).json({ error: "Failed to generate story content." });
  }
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
