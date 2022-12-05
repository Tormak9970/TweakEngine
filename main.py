import logging
import json
import os
from genericpath import exists

logging.basicConfig(filename="/tmp/TweakEngine.log", format='[Tweak Engine] %(asctime)s %(levelname)s %(message)s', filemode='w+', force=True)
logger=logging.getLogger()
logger.setLevel(logging.INFO) # can be changed to logging.DEBUG for debugging issues

def log(txt):
    logger.info(txt)

Initialized = False

class Plugin:
    defualts = {
        "Game-Download-Status": {
            "name": "Game-Download-Status",
            "description": "Displays the download status of games when browsing your library.",
            "enabled": True
        }
    }
    settings = {}
    settingsPath = "/home/deck/.config/TweakEngine/settings.json"

    # Normal methods: can be called from JavaScript using call_plugin_function("signature", argument)
    async def getSettings(self):
        self._load(self)
        return self.settings

    async def setSettings(self, settings):
        self._setSettings(self, self.settingsPath, settings)
        return self.settings

    # Asyncio-compatible long-running code, executed in a task when the plugin is loaded
    async def _main(self):
        global Initialized
        if Initialized:
            return
        
        Initialized = True

        log("Initializing Tweak Engine Plugin")

        if not os.path.exists(self.settingsPath):
            if not os.path.exists(os.path.dirname(self.settingsPath)):
                os.mkdir(os.path.dirname(self.settingsPath))

            with open(self.settingsPath, "w") as file:
                json.dump(self.defualts, file, indent=4)

        pass

    def _load(self):
        log("Analyzing Settings JSON")
            
        if (exists(self.settingsPath)):
            try:
                with open(self.settingsPath, "r") as file:
                    settingsDict = json.load(file)

                    for k in settingsDict:
                        self.settings[k] = settingsDict[k]

                    for k in self.defualts:
                        if k not in self.settings:
                            self.settings[k] = self.defualts[k]
                            self.setSettings(self, self.settingsPath, self.setSettings)

            except Exception as e:
                log(f"Exception while parsing settings: {e}") # error reading json
        else:
            exception = Exception("Unabled to locate settings.json: file does not exist")
            raise exception

        pass

    def _setSettings(self, path, settings):
        self.settings = settings

        jDat = json.dumps(self.settings, indent=4)

        with open(path, "w") as outfile:
            outfile.write(jDat)

        pass
