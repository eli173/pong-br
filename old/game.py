
import websockets
import threading

class GamePlayer(threading.Thread):
    def __init__(self, players):
        threading.Thread.__init__()
        self.players = players
    def run(self):
        print("starting a thread or whatever: " + name)
