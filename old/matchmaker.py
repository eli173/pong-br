
WS_HOST = 'localhost'
WS_PORT = 6789
NUM_PLAYERS = 4

import asyncio
import websockets
import threading

import logging

logger = logging.getLogger('websockets')
logger.setLevel(logging.INFO)
logger.addHandler(logging.StreamHandler())

import player
import game

class Matchmaker():
    def manage_incoming(self,websocket, path):
        # init a player, etc etc
        new_player = player.Player(websocket)
        self.players.append(new_player)
        if len(self.players) > (NUM_PLAYERS - 1): # shenanigans to fix potential problem of stranding some (n+1)th player
            with self.lock:
                new_game = game.Game(self.players[:NUM_PLAYERS])
                new_game.run()
                self.players = self.players[NUM_PLAYERS:]
                print("did it")
    def __init__(self):
        # todo: this is where I initialise the listening stuff for websockets, where I pass manage_incoming (or whatev) to the thing
        self.players = []
        self.lock = threading.Lock()
        async def manager(ws,p):
            self.manage_incoming(ws,p)
        start_server = websockets.serve(manager,WS_HOST,WS_PORT)
        asyncio.get_event_loop().run_until_complete(start_server)
        asyncio.get_event_loop().run_forever()
