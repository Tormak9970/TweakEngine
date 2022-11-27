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
    settings = {}
    settingsPath = "/home/deck/.config/TweakEngine/settings.json"

    # Normal methods: can be called from JavaScript using call_plugin_function("signature", argument)
    async def getSettings(self):
        self._load(self)
        return self.serializeShortcuts(self)

    async def setSettings(self, shortcuts):
        self._setShortcuts(self, self.shortcutsPath, shortcuts)
        return self.serializeShortcuts(self)

    # Asyncio-compatible long-running code, executed in a task when the plugin is loaded
    async def _main(self):
        global Initialized
        if Initialized:
            return
        
        Initialized = True

        log("Initializing Tweak Engine Plugin")

        if not os.path.exists(self.shortcutsPath):
            if not os.path.exists(os.path.dirname(self.shortcutsPath)):
                os.mkdir(os.path.dirname(self.shortcutsPath))
            
            data = {
                "libDownloads": True
            }

            with open(self.shortcutsPath, "w") as file:
                json.dump(data, file, indent=4)

        pass

    def _load(self):
        log("Analyzing Settings JSON")
            
        if (exists(self.settingsPath)):
            try:
                with open(self.settingsPath, "r") as file:
                    settingsDict = json.load(file)

                    for k in settingsDict:
                        self.settings[k] = settingsDict[k]

            except Exception as e:
                log(f"Exception while parsing settings: {e}") # error reading json
        else:
            exception = Exception("Unabled to locate settings.json: file does not exist")
            raise exception

        pass

    def _setShortcuts(self, path, settings):
        self.settings = settings

        jDat = json.dumps(self.settings, indent=4)

        with open(path, "w") as outfile:
            outfile.write(jDat)

        pass
