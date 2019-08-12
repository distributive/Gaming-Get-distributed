import os
import json
import re
#import tempfile
import webbrowser

# Store all tags specified by games
tags = set

# Load templates
with open ("templates/index.tmpl", 'r') as file:
    htmlTemplate = file.read ()
with open ("templates/game.tmpl", 'r') as file:
    gameTemplate = file.read ()
with open ("templates/tag.tmpl", 'r') as file:
    tagTemplate = file.read ()

# Load game data
games = []
for gameDirectory in os.listdir ("assets/games"):
    with open ("assets/games/" + gameDirectory + "/data.json", 'r') as file:
        gameData = json.load (file)
    games.append ((gameDirectory, gameData))
games.sort (key=lambda game : game[1]["name"])

# Insert game data into
gameHTML = ""
for game in games:
    tags = ""
    for tag in game[1]["tags"]:
        tags += re.sub ("@tag", tag, tagTemplate)
    gameString = re.sub ("@file", game[0], gameTemplate)
    gameString = re.sub ("@name", game[1]["name"], gameString)
    gameString = re.sub ("@description", game[1]["description"], gameString)
    gameString = re.sub ("@tags", tags, gameString)
    gameHTML += gameString
html = re.sub ("@games", gameHTML, htmlTemplate)

# Open page
with open ("temp.html", "w") as file:
    url = "file://" + os.getcwd () + "/temp.html"
    file.write (html)
chrome_path = "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
webbrowser.register ("chrome", None, webbrowser.BackgroundBrowser (chrome_path))
webbrowser.get ("chrome").open (url)
