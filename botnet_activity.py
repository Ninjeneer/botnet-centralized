import time

class BotnetActivity:
    def __init__(self, uuid: str):
        self.uuid = uuid
        self.count = 1
        self.last_seen = time.time_ns() // 1_000_000

    def heartbeat(self):
        self.count = self.count + 1
        self.last_seen = time.time_ns() // 1_000_000