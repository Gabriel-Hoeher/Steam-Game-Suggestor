import json
import urllib.request

# gamesfile = open('out4.json')
# games = json.load(gamesfile)
# games = games['games']

newtags = [{"tag":"Single-player", "alias":['Single-player']}, 
{"tag":"Multi-player", "alias":['Multi-player']},
{"tag":"PvP", "alias":['Online PvP', 'Shared/Split Screen PvP', 'LAN PvP']},
{"tag":"Co-op", "alias":['Co-op', 'Shared/Split Screen Co-op', 'Shared/Split Screen', 'Remote Play Together', 'Online Co-op', 'LAN Co-op']},
{"tag":"Action", "alias":['Action']},
{"tag":"Casual", "alias":['Casual']},
{"tag":"Indie", "alias":['Indie']},
{"tag":"Simulation", "alias":['Simulation']},
{"tag":"Sports", "alias":['Sports']},
{"tag":"RPG", "alias":['RPG']},
{"tag":"Strategy", "alias":['Strategy']},
{"tag":"Game demo", "alias":['Game demo']},
{"tag":"Adventure", "alias":['Adventure']},
{"tag":"Free to Play", "alias":['Free to Play']},
{"tag":"Massively Multiplayer", "alias":['Massively Multiplayer, MMO']},
{"tag":"DLC", "alias":['Downloadable Content']},
{"tag":"Cross-Play", "alias":['Cross-Platform Multiplayer']},
{"tag":"VR Support", "alias":['VR Support']},
{"tag":"Racing", "alias":['Racing']},
{"tag":"In-App Purchases", "alias":['In-App Purchases']},
{"tag":"Nudity", "alias":['Nudity']},
{"tag":"Violent", "alias":['Violent']},
{"tag":"Gore", "alias":['Gore']},
{"tag":"Early Access", "alias":['Early Access']}]

#-------------------------------TAG CLEANER-------------------------------------
# def contains(set1, set2):
#     for tag in set1:
#         if tag in set2:
#             return True
#     return False

# for game in games:
#     gntags = []
#     for tag in newtags:
#         gtags = game['tags']
#         alias = tag['alias']
#         if contains(gtags, alias):
#             gntags.append(tag['tag'])
#     game['tags'] = gntags
#     with open("out4.json", "a") as outfile:  
#         json.dump(game, outfile) 
#         outfile.write('\n')




# ---------------------------- ENGLISH CHECKER ----------------------------------
# alpha = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
#         'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

# badtags = ['Un jugador', 'Logros de Steam', 'Compat. total con mando', 'Cromos de Steam', 'Remote Play en TV', 'Aventura', 'Rol', 'Tek Oyunculu', 'Çok Oyunculu', 'Steam Koleksiyon Kartları', 'Aksiyon', 'Um jogador', 'Proezas do Steam', 'Compatibilidade c/ comando', 'Cartas Colecionáveis', 'Remote Play na TV', 'Çevrimiçi PvP', 'Eşli Oyun', 'Ortak/Bölünmüş Ekran Eşli Oyun', 'Ortak/Ayrık Ekran', 'Steam Başarımları', 'Oyun Kumandası Desteği', 'Steam Atölyesi', 'İstatistikler', 'Televizyonda Remote Play', 'Macera', 'Bağımsız Yapımcı']

# def contains(str):
#     for c in badtags:
#         if c in str:
#             return True
#     return False

# wfile = open('out2.txt', 'w')
# lines = []

# for game in games:
#     if contains(game['tags'][0]):
#         lines.append(str(game['id']) + " " + game['name'] + '\n')
# wfile.writelines(lines)
# wfile.close()

# --------------------- TAG PRINTER ---------------------------
# gamesfile = open('out4.json')
# games = json.load(gamesfile)
# games = games['games']
# tags = []
# for game in games:
#     # print(game['name'])
#     gametags = game['tags']
#     for tag in gametags:
#         if tag not in tags:
#             tags.append(tag)

# print('All steam tags:')
# print(tags)

# ------------------------ JSON FORMATER -----------------------------------
# file1 = open('out4.json', 'r')
# lines = file1.readlines()
# file1.close()

# newlines = []
# for line in lines:
#     newlines.append(line + ',')

# file1 = open('out4.json', 'w')
# file1.writelines(newlines)
# file1.close()

#  ------------------------- ID GRABBER ----------------------
# ids = [570, 1097150, 440880]
# for id in ids:
#     gPage = urllib.request.urlopen("http://store.steampowered.com/api/appdetails?appids=" + str(id))
#     gData = json.loads(gPage.read())
#     gData = gData[str(id)]
#     print("Reading appid: " + str(id))
#     #print(gData)
#     if gData['success']:
#         # print("API success")
#         try:
#             gData = gData['data']
#             gGenres = gData['genres']
#             gTags = gData['categories']

#             score = gData['metacritic']
#             score = score['score']

#             tags = []
#             for tag in gTags:
#                 tags.append(tag['description'])

#             for genre in gGenres:
#                 tags.append(genre['description'])

#             date = gData['release_date']
#             date = date['date']

#             fgame = {'id':id, 'name':gData['name'],'date':date, 'tags':tags, 'score':score}
            
#             print("------GAME ADDED TO JSON-------")
#             with open("out3.json", "a") as outfile:  
#                 json.dump(fgame, outfile) 
#                 outfile.write('\n')
#         except:
#             print("ERROR")
#             pass
