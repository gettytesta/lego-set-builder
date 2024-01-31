from pymongo import MongoClient
import rebrick
import os
import json


REBRICK_KEY = os.getenv('REBRICK_KEY')
REBRICK_KEY = "1eece07086fadf00e97b797f1289bd34"
MONGO_CONNECTION_STRING = os.getenv('MONGO_CONNECTION_STRING')
MONGO_CONNECTION_STRING = "mongodb+srv://GTestaMoney:NvoW1dGD9BdxUE14@legosets.8lnejno.mongodb.net/?retryWrites=true&w=majority"

def get_database():
   client = MongoClient(MONGO_CONNECTION_STRING)
   return client['LegoSets']

LegoSets = get_database()
rebrick.init(REBRICK_KEY)

setList = LegoSets["setlist"]

sets = [4774,8061,8075,9461,9462,9463,2258,2260,2505,2516,2519,9441,8960,8961,
4980,4701,4702,4706,4707,4708,4709,4711,4712,4714,4721,4722,4723,4726,4727,
4730,4731,3817,7595,5978,7306,3409,7739,6584,6462,6441,5982,8154,8496]


# Get all pieces in a set by the set ID
def get_set_elements(set_num):
    parts = rebrick.lego.get_set_elements(set_num)
    parsedParts = json.loads(parts.read())['results']
    return parsedParts

# Search through the user's list of sets, and determine if a given piece is needed.
def search_piece(part_num, color):
    for set in sets:
        currentSet = LegoSets[str(set)]
        for piece in currentSet.find():
            if part_num == piece['part_num'] and color == piece['color']:
                if piece['quantity'] != piece['obtained_pieces']:
                    res = input(f"Place in {set} pile, press 'Enter' to continue or 'x' to cancel... ")
                    if res != 'x':
                        found_piece(piece['_id'], set)
                        return 1
                    return 0

# Add piece to db if found
def found_piece(id, set):
    currentSet = LegoSets[str(set)]
    for piece in currentSet.find():
        if id == piece['_id']:
            currentSet.update_one({'_id': id}, {'$inc': {'obtained_pieces': 1}})

# Add a set into the db
def add_set(set):
    setCluster = LegoSets[str(set)]
    parts = rebrick.lego.get_set_elements(set)
    parsedParts = json.loads(parts.read())['results']
    for part in parsedParts:
        #setCluster.update_one({'_id': part['id']}, {'$set': {'_id': part['part']['part_num']}})
        setCluster.insert_one({'_id': part['id'], 'part_num': part['part']['part_num'], 'name': part['part']['name'],'color': part['color']['name']
                                , 'quantity': part['quantity'], 'obtained_pieces': 0})
        
# Remove a set in the db
def remove_set(set):
    setCluster = LegoSets[str(set)]
    setCluster.drop()

# Make the setlist from a defined list of user sets
def make_setlist():
    setlist = LegoSets["setlist"]
    for set in sets:
        setinfo = rebrick.lego.get_set(set)
        parsedSet = json.loads(setinfo.read())
        setlist.insert_one({'_id': set, 'num_parts': parsedSet['num_parts'], 'collected_pieces': 0})
        #setlist.update_one({'_id': set}, {'$set': {'set_name': parsedSet['name']}})

# Return the list of sets in the db
def get_setlist():
    newSetList = LegoSets["setlist"].find({})
    retSetList = []
    for set in newSetList:
        retSetList.append({'_id': set['_id'], 'num_parts': set['num_parts'], 'collected_pieces': set['collected_pieces']})
    return retSetList
