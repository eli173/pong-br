

import asyncio
import websockets
import threading

# planning:
# I think I can properly initialise the async websocket stuff in the init method, then the other methods will probably be fine? There may be problems with send_data and asyncio stuff, but get_status is definitely fine as-is
class Player():
    def __init__(self, socket):
        self.socket = socket
        self.status = 'x'
        self.status_lock = threading.Lock()
    def send_data(self, data):
        # to be used by the game thread thingy
        asyncio.run(self.socket.send(data))
    def get_status(self):
        with self.status_lock:
            stat = self.status
            self.status = 'x'
            return stat
