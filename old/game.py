

SPF = 0.5 # half second for testing purposes
# MS_PER_FRAME = 67 # 15 fps?


import threading

# not a (subclass of) thread, all this has to be is a timer that calls itself or whatever, hope it doesn't take too long to run or whatever

import gamestate

class Game():
    def __init__(self, players):
        self.players = players
        self.game_state = gamestate.GameState()
        for player in self.players: # CAUTION HERE, MIGHT NEED TO MODIFY
            player.run()
    def run(self):
        threading.Timer(SPF, self.run).start()
        # okay, things to do here:
        # check all the inputs in the player classes
        # update global game state
        # send data to players
        inputs = []
        for idx, val in enumerate(self.players):
            inputs.append(val.get_status())
        self.game_state.update_state(inputs)
        self.game_state.advance_frame()
        state = self.game_state.get_state()
        for player in self.players:
            player.send_data(state)
        print(state)
