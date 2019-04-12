

import asyncio
import websockets
import threading


class Matcher():
    def __init__(self):
        self.lock = threading.Lock()
        self.players = []
    def add_player(self,ws):
        with self.lock:
            self.players.append(ws)
            if len(self.players) == 4:
                self.new_game()
    def new_game(self):
        print(self.players)
        self.players = []
        
async def hello(ws, path, matcher):
    txt = await ws.recv()

    matcher.add_player(ws)
    
    print(txt)
    rep = "hey you"

    await ws.send(rep)


if __name__ == "__main__":
    matcher = Matcher()
    async def hi(ws,path):
        await hello(ws,path,matcher)
    start_server = websockets.serve(hi, 'localhost', 6789)

    asyncio.get_event_loop().run_until_complete(start_server)
    asyncio.get_event_loop().run_forever()
