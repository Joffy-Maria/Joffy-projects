from flask import Flask, jsonify, request
import google.generativeai as genai
from flask_cors import CORS  # Import CORS

# Configure the API key for the Generative AI model
genai.configure(api_key="AIzaSyCg3glcXrZU-38frvMad4fpeeItA_ty8tw")

# Initialize Flask app
app = Flask(__name__)

# Enable CORS for all domains (or specify the allowed origin)
CORS(app)  # This will allow all origins by default

# Route to test the server
@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

# Route to generate AI content based on user input
@app.route("/generate", methods=["POST"])
def generate_ai_content():
    try:
        # Get user input from the form (sent via POST)
        user_input = request.json.get("input", "")
        
        if not user_input:
            return jsonify({"error": "Input is required!"}), 400
        
        # Generate content using the Gemini model
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content("once upon a time a queen")
        
        # Return the generated content as a JSON response
        return jsonify({"response": response.text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)

