from flask import Flask, request, jsonify
from flask_cors import CORS
import builder

# Start the Flask App
app = Flask(__name__)
cors = CORS(app)

@app.route('/')
def index():
    return "backend"

@app.route('/api/piecelist', methods=['GET'])
def get_piecelist():
    pieces = builder.get_set_elements(2505)
    return pieces

@app.route('/api/user/setlist', methods=['GET'])
def get_setlist():
    setlist = builder.get_setlist()
    return setlist


if __name__ == "__main__":
    app.run(debug=True)