from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from research import APPLICATION_TOKEN, run_flow
from dotenv import load_dotenv

load_dotenv()

if not os.getenv('APPLICATION_TOKEN'):
    raise ValueError('APPLICATION_TOKEN environment variable must be set')

APPLICATION_TOKEN = os.getenv('APPLICATION_TOKEN')
LANGFLOW_ENDPOINT = os.getenv('LANGFLOW_ENDPOINT')

app = Flask(__name__)
CORS(app, resources={
    r"/*": {
        "origins": "*"
    }
})

@app.route('/chat', methods=['POST'])
def research():
    data = request.json
    query = data.get('query', '')
    tweaks = data.get('tweaks', None)
    
    if not query:
        return jsonify({
            'status': 'error',
            'message': 'Research query is required'
        }), 400
    
    try:
        result = run_flow(
            message=query,
            endpoint=LANGFLOW_ENDPOINT,
            output_type='chat',
            input_type='chat',
            tweaks=tweaks,
            application_token=APPLICATION_TOKEN
        )
        
        if isinstance(result, dict) and 'result' in result:
            return jsonify({
                'status': 'success',
                'data': result['result']
            })
        
        return jsonify({
            'status': 'success',
            'data': result
        })
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)