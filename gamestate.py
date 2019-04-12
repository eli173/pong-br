

class GameState():
    def __init__(self):
        self.inputs = []
    def update_state(self, inputs):
        self.inputs = inputs
    def get_state(self):
        return ''.join(self.inputs)
    def advance_frame(self):
        pass
    
