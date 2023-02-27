# GET ALL GAMES ON STEAM (INCLUDES TITLE):
# http://api.steampowered.com/ISteamApps/GetAppList/v0002/?key=STEAMKEY&format=json
#
# SEARCH FOR GAME INFO (LIMITED TO 200 REQUESTS PER 5 MIN):
# http://store.steampowered.com/api/appdetails?appids={APP_ID}
#
# *THE STORE API IS NOT INTENDED FOR PUBLIC USE AND THEREFORE HAS NO OFFICIAL DOCUMENTATION*

# THIS IS A TESTING SCRIPT MADE TO DEVELOP A METHOD FOR SEARCHING STEAMS API
# TO USE THIS, MANUALY DOWNLOAD THE ALL APP ID JSON USING ABOVE METHOD AND PLACE IN SAME FOLDER TITLED "steamgames.json"

import json
import urllib.request
import time

#open file
gamesfile = open('steamgames.json')

#parse to dictionary
data = json.load(gamesfile)
data = data['applist']
data = data['apps']

#test it loaded
#print(data)

#count total games
print('There are ' + str(len(data)) + ' games on steam')

# count = 0
# for game in data:
#     if game['metacritic']:
#         count = count + 1
# print('There are ' + str(count) + ' games with metacritic scores')

# # search for factorio ID
# for game in data:
#     if game['name'] == 'Celeste':
#         gID = str(game['appid'])
#         break

# # print g ID
# print('g ID: ' + gID)

# #pull data from the g store page
# gPage = urllib.request.urlopen("http://store.steampowered.com/api/appdetails?appids=" + gID)
# gData = json.loads(gPage.read())

# # print raw g data
# print(gData)

# # print g tags
# gData = gData[gID]
# gData = gData['data']
# gGenres = gData['genres']
# gTags = gData['categories']

# tags = []
# for tag in gTags:
#     tags.append(tag['description'])

# for genre in gGenres:
#     tags.append(genre['description'])

# print('g\'s tags:')
# for tag in tags:
#     print('    ' + tag)

# -------------------------------------------READER-------------------------------------------------------------------
reading = False
count = 0
for game in data:
    count += 1

    if not reading:
        if game['appid'] == 252670:
            reading = True
    else:
        loadedPage = False
        while not loadedPage:
            try:
                gPage = urllib.request.urlopen("http://store.steampowered.com/api/appdetails?appids=" + str(game['appid']))
                loadedPage = True
            except:
                print("Hit request limit.... waiting")  
                time.sleep(310)

        gData = json.loads(gPage.read())
        gData = gData[str(game['appid'])]
        print("Reading appid: " + str(game['appid']) + " This is game " + str(count))
        #print(gData)
        if gData['success']:
            # print("API success")
            try:
                gData = gData['data']
                gGenres = gData['genres']
                gTags = gData['categories']

                score = gData['metacritic']
                score = score['score']

                tags = []
                for tag in gTags:
                    tags.append(tag['description'])

                for genre in gGenres:
                    tags.append(genre['description'])

                date = gData['release_date']
                date = date['date']

                fgame = {'id':game['appid'], 'name':game['name'],'date':date, 'tags':tags, 'score':score}
                
                print("------GAME ADDED TO JSON-------")
                with open("database.json", "a") as outfile:  
                    json.dump(fgame, outfile) 
                    outfile.write('\n')
            
            except:
                #print("Game has no metacritic OR is missing data")
                pass




# Use this to recover if the read crashes 
# count = 0
# for game in data:
#     count += 1
#     if game['appid'] == 252670:
#         #print('Stopped on game: ' + str(count))
#         break
# print('Stopped on game: ' + str(count))