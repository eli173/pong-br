
import asyncio
import websockets
import threading

import pbr_constants

class Matchmaker():
    def __init__(self):
        self.lock = threading.Lock()
        self.players = []
    async def get_game(self,p):
        with self.lock:
            self.players.append(p)
            if len(self.players) ==pbr_constants.num_players:
                self.new_game()
    def new_game(self):
        with self.lock:
            print(self.players)
            
            self.players = []






            
if __name__=="__main__":
    mm = Matchmaker()
