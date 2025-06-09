from flask import Flask, jsonify, request
from flask_cors import CORS
from app.services.gemini_service import generate_learning_path

app = Flask(__name__)
CORS(app)  

@app.route('/api/generate', methods=['POST'])
def generate():
    data = request.get_json()
    topic = data.get('topic', '')
    ai_result = generate_learning_path(topic)
    return jsonify({"learning_path": ai_result})
