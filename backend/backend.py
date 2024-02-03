from flask import Flask, request, jsonify
from flask_cors import CORS
import builder

# Start the Flask App
app = Flask(__name__)
cors = CORS(app)

@app.route('/')
def index():
    return "backend"

# Gets the piecelist for a set
@app.route('/api/piecelist', methods=['GET'])
def get_piecelist():
    pieces = builder.get_set_elements(2505)
    return pieces

# Gets the user's setlist
@app.route('/api/user/setlist', methods=['GET'])
def get_setlist():
    setlist = builder.get_setlist()
    return setlist

# Find if a set exists and returns info if it does
@app.route('/api/find_set', methods=['POST'])
def find_set():
    set_num = request.json['set_num']
    setdata = builder.checkIfSetExists(set_num)
    return setdata

# Get info about a user's set
@app.route('/api/user/set', methods=['POST'])
def get_setdata():
    set = request.json['set']
    setData = builder.set_lookup(set)
    return setData

# Get the user's potential sets 
@app.route('/api/user/potentialsets', methods=['GET'])
def get_potsets():
    potsetlist = builder.get_potentialsets()
    return potsetlist

# Checks if a piece is needed in any of the users's sets.
@app.route('/api/check_piece', methods=['POST'])
def check_piece():
    part_num = request.json['part_num']
    color_num = request.json['color']
    setList = builder.search_sets_for_piece(part_num, color_num)
    if len(setList) == 0 and color_num != -1:
        builder.search_potentialsets(part_num, color_num)
    return setList

# Adds a part to a users set
@app.route('/api/found_piece', methods=['POST'])
def found_piece():
    part_num = request.json['part_num']
    set_num = request.json['set_num']
    builder.found_piece(part_num, set_num)
    return "Piece added"

if __name__ == "__main__":
    app.run(debug=True)