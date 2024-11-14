import os
from flask import Flask, render_template, request, jsonify, Response
from utils import validate_api_key
import json

app = Flask(__name__)
app.secret_key = os.environ.get("FLASK_SECRET_KEY") or "a secret key"

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/validate', methods=['POST'])
def validate_keys():
    # Get the keys from the request
    if 'file' in request.files:
        file = request.files['file']
        content = file.read().decode('utf-8')
        keys = [key.strip() for key in content.split('\n') if key.strip()]
    else:
        keys_text = request.form.get('keys', '')
        keys = [key.strip() for key in keys_text.split('\n') if key.strip()]
    
    def generate():
        total_keys = len(keys)
        for index, key in enumerate(keys):
            status = validate_api_key(key)
            result = {
                'key': key,  # Full key for export
                'masked_key': key[:6] + '*' * (len(key) - 12) + key[-6:],
                'status': status,
                'progress': {
                    'current': index + 1,
                    'total': total_keys,
                    'percentage': ((index + 1) / total_keys) * 100
                }
            }
            yield f"data: {json.dumps(result)}\n\n"
    
    return Response(generate(), mimetype='text/event-stream')

@app.route('/export', methods=['POST'])
def export_results():
    results = request.json
    output = ""
    if results:
        for result in results:
            output += f"API Key: {result['key']}\nStatus: {result['status'].upper()}\n\n"
    return jsonify({'txt': output})