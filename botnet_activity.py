import time

class BotnetActivity:
    def __init__(self, uuid: str, running: bool):
        self.uuid = uuid
        self.count = 1
        self.last_seen = time.time_ns() // 1_000_000
        self.running = running

    def heartbeat(self, running: bool):
        self.count = self.count + 1
        self.last_seen = time.time_ns() // 1_000_000
        self.running = running