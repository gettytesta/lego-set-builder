from pymongo import MongoClient
from urllib.error import HTTPError
import rebrick
import os
import json


REBRICK_KEY = os.getenv('REBRICK_KEY')
MONGO_CONNECTION_STRING = os.getenv('MONGO_CONNECTION_STRING')

def get_database():
   client = MongoClient(MONGO_CONNECTION_STRING)
   return client['LegoSets']

LegoSets = get_database()
rebrick.init(REBRICK_KEY)

collection_names = LegoSets.list_collection_names()

setList = LegoSets["setlist"]

sets = [4774,8061,8075,9461,9462,9463,2258,2260,2505,2516,2519,9441,8960,8961,
4980,4701,4702,4706,4707,4708,4709,4711,4712,4714,4721,4722,4723,4726,4727,
4730,4731,3817,7595,5978,7306,3409,7739,6584,6462,6441,5982,8154,8496]


# Get all pieces in a set by the set ID
def get_set_elements(set_num):
    parts = rebrick.lego.get_set_elements(set_num)
    parsedParts = json.loads(parts.read())['results']
    return parsedParts

# Search through users sets to see if a piece is needed.
# Returns a list of sets where the piece is needed.
def search_sets_for_piece(part_num, color_num):
    retSets = []
    if color_num == -1:
        for col_name in collection_names:
            if col_name == "setlist":
                continue
            currentSet = LegoSets[col_name]
            for piece in currentSet.find():
                if part_num == piece['part_num']:
                    if piece['quantity'] > piece['obtained_pieces']:
                        setData = setList.find_one({'_id': int(col_name)})
                        setData['quantity'] = piece['quantity']
                        setData['obtained_pieces'] = piece['obtained_pieces']
                        setData['color'] = piece['color']
                        retSets.append(setData)
    else:
        color = rebrick.lego.get_color(color_num)
        parsedColor = json.loads(color.read())['name']
        for col_name in collection_names:
            if col_name == "setlist":
                continue
            currentSet = LegoSets[col_name]
            for piece in currentSet.find():
                if part_num == piece['part_num'] and parsedColor == piece['color']:
                    if piece['quantity'] > piece['obtained_pieces']:
                        setData = setList.find_one({'_id': int(col_name)})
                        setData['quantity'] = piece['quantity']
                        setData['obtained_pieces'] = piece['obtained_pieces']
                        setData['color'] = piece['color']
                        retSets.append(setData)
    return retSets

# Check to see if part is unique to a set
def search_potentialsets(part_num, color_num):
    try:
        sets = rebrick.lego.get_part_color_sets(part_num, color_num)
        parsedSets = json.loads(sets.read())
        if parsedSets['count'] == 1:
            print(parsedSets)
            set = setList.find_one({'set_name': parsedSets['results'][0]['name']})
            if set == None:
                return parsedSets['results'][0]
        return []
    except HTTPError as err:
        if err.code == 404:
            return []
    

# Add piece to db if found
def found_piece(id, set, color):
    currentSet = LegoSets[str(set)]
    pieces = currentSet.find({'part_num': id})
    for piece in pieces:
        if piece['color'] == color:
            currentSet.find_one_and_update({'_id': piece['_id']}, {'$inc': {'obtained_pieces': 1}})
    setList.find_one_and_update({'_id': set}, {'$inc': {'collected_pieces': 1}})
    return

# Get the user's set data
def set_lookup(set):
    currentSet = LegoSets[str(set)]
    retPieces = []
    pieces = currentSet.find()
    for piece in pieces:
        retPieces.append(piece)
    return retPieces
        
# Get the user's potential set list
def get_potentialsets():
    potentialSets = LegoSets['potential_setlist']
    retSetlist = []
    for pset in potentialSets.find():
        retSetlist.append(pset)
    return retSetlist

# Add a set into the db
def add_set(set):
    set = set.split("-")[0]
    setCluster = LegoSets[str(set)]
    parts = rebrick.lego.get_set_elements(set)
    parsedParts = json.loads(parts.read())['results']
    for part in parsedParts:
        #setCluster.update_one({'_id': part['id']}, {'$set': {'_id': part['part']['part_num']}})
        setCluster.insert_one({'_id': part['id'], 'part_num': part['part']['part_num'], 'name': part['part']['name'],'color': part['color']['name']
                                , 'quantity': part['quantity'], 'obtained_pieces': 0})
    setData = rebrick.lego.get_set(set)
    parsedSet = json.loads(setData.read())
    setList.insert_one({'_id': int(parsedSet['set_num'].split("-")[0]), 'set_name': parsedSet['name'], 'collected_pieces': 0,
                        'num_parts': parsedSet['num_parts']})
    return "Set added."
        
# Remove a set in the db
def remove_set(set):
    setCluster = LegoSets[str(set)]
    setCluster.drop()
    setList = LegoSets["setlist"]
    setList.find_one_and_delete({'_id': set})

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
        retSetList.append({'_id': set['_id'], 'num_parts': set['num_parts'], 'collected_pieces': set['collected_pieces'], 'set_name':set['set_name']})
    return retSetList

# Check if a set exists, and return it if so
def checkIfSetExists(set):
    try:
        setdata = rebrick.lego.get_set(set)
        parsedSet = json.loads(setdata.read())
        return parsedSet
    except HTTPError as err:
        if err.code == 404:
            return {}
    

