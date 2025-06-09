from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  

@app.route('/api/generate', methods=['POST'])
def generate():
    data = request.get_json()
    topic = data.get('topic', '')
    # For now, just echo back the topic (mock AI)
    return jsonify({
        "learning_path": f"(Pretend) Here's a custom learning path for: {topic}"
    })
