// Function to simulate AI-driven content generation using Flask API
async function generateAIContent(userInput) {

    Console.log("generateAIContent called with userInput: ", userInput);

    // Send the user input to the Flask API to generate AI-driven content
    const response = await fetch('/get-ai-story', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userInput: userInput })
    });
    const data = await response.json();

    if (data.text) {
        // Add the AI-generated content to the storyData object
        storyData.ai_scene = { text: data.text, choices: data.choices };
        updateStory();  // Update the story with the new AI-generated content
    } else {
        console.error("Error generating story:", data.error);
    }
}
