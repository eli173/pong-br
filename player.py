

import asyncio
import websockets
import threading


class Player(threading.Thread):
    def __init__(self, socket):
        super().__init__()
        self.game = None
        self.socket = socket
        self.status = 'x'
        self.status_lock = threading.Lock()
    async def run(self):
        print('fired')
        msg = await self.socket.recv()
        print('recv')
        # should be 'u' or 'd', if neither
        with self.status_lock:
            if len(msg) > 0:
                self.status = msg[0]
            else:
                self.status = 'x'
        # needs to be re-ran at this point? probably
    def send_data(self, data):
        # to be used by the game thread thingy
        self.socket.send(data)
    def get_status(self):
        with self.status_lock:
            stat = self.status
            self.status = 'x'
            return stat
