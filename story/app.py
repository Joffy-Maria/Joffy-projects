import google.generativeai as genai
from flask import Flask, jsonify, render_template, request
genai.configure(api_key="")


app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

# # Configure the API with your key

# Initialize the model
model = genai.GenerativeModel("gemini-1.5-flash")


@app.route('/get-ai-story', methods=['POST'])
def generate_story():
    # Get the JSON data from the request body
    data = request.get_json()
    
    # Extract user input from the JSON data
    user_input = data.get('user_input')

    if not user_input:
        return jsonify({'error': 'No user input provided'}), 400

    # Generate the story content based on user input
    ai_response, choices = generate_story(user_input)

    print("AI RESPONSE:: ", ai_response)

    # Return the AI-generated story content along with choices as JSON
    return jsonify({
        'text': ai_response,
        'choices': choices
    })



# Function to generate a story based on user input and choices
def generate_story(user_input, history=None):
    # If there's no history, start a new conversation
    if history is None:
        history = []

    # Add the current user input to the history
    history.append(f"User: {user_input}")

    # Generate story content based on the user's input and history
    prompt = "\n".join(history)  # Combine history to maintain context

    # Call the Gemini model to generate the next part of the story
    response = model.generate_content(prompt)

    # Add the AI's response to the history
    ai_response = response.text
    history.append(f"AI: {ai_response}")

    return ai_response, history

# Main interactive storytelling function
def interactive_story():
    history = []  # This will store the conversation history

    print("Welcome to the interactive story! Type 'exit' to quit.")
    
    while True:
        # Get user input
        user_input = input("\nYou: ")

        # Check if the user wants to exit the story
        if user_input.lower() == 'exit':
            print("Exiting the story. Thanks for playing!")
            break

        # Generate the story based on user input
        ai_response, history = generate_story(user_input, history)

        # Print the AI-generated content (part of the story)
        print("\nAI:", ai_response)

        # Present choices for the user (this can be customized based on the story)
        print("\nWhat will you do next?")
        print("1. Continue down the path")
        print("2. Choose another action")
        print("3. Exit the story")
        
        choice = input("Enter your choice (1, 2, or 3): ")

        # Process the user's choice and update the story
        if choice == '1':
            continue  # Continue the story based on the AI's response
        elif choice == '2':
            user_input = input("What action do you want to take next? ")
            ai_response, history = generate_story(user_input, history)  # Generate new part of the story based on choice
        elif choice == '3':
            print("Exiting the story. Thanks for playing!")
            break
        else:
            print("Invalid choice. Please enter 1, 2, or 3.")

# if __name__ == "__main__":
#     interactive_story()



if __name__ == '__main__':
    app.run(debug=True)