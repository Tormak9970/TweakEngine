import logging
import json
import os
from genericpath import exists

from settings import SettingsManager

logging.basicConfig(filename=os.path.join(os.environ["DECKY_PLUGIN_LOG_DIR"], "TweakEngine.log"), format='[Tweak Engine] %(asctime)s %(levelname)s %(message)s', filemode='w+', force=True)
logger=logging.getLogger()
logger.setLevel(logging.INFO) # can be changed to logging.DEBUG for debugging issues


def log(txt):
    logger.info(txt)

Initialized = False

class Plugin:
  defualts = {
    "Keyboard-QAM-Support": {
      "name": "Keyboard-QAM-Support",
      "description": "Allows you to open the Steam menu and QAM from a keyboard",
      "enabled": True
    }
  }

  pluginUser = os.environ["DECKY_USER"]
  pluginSettingsDir = os.environ["DECKY_PLUGIN_SETTINGS_DIR"]
  
  settingsManager = SettingsManager(name='TweakEngine', settings_directory=pluginSettingsDir)

  # Normal methods: can be called from JavaScript using call_plugin_function("signature", argument)
  async def getSetting(self, key, defaultVal):
    return self.settingsManager.getSetting(key, defaultVal)

  async def setSetting(self, key, newVal):
    self.settingsManager.setSetting(key, newVal)
    log(f"Set setting {key} to {newVal}")

  async def logMessage(self, message):
    log(message)

  # Asyncio-compatible long-running code, executed in a task when the plugin is loaded
  async def _main(self):
    global Initialized
    if Initialized:
      return
    
    Initialized = True

    log("Initializing Tweak Engine Plugin")

    self.settingsManager.read()
    
    if "tweaks" not in self.settingsManager.settings:
      log("No tweaks detected in settings.")
      log("Adding default tweaks.")
      self.settingsManager.setSetting("tweaks", self.defualts)
    else:
      tweaks = self.settingsManager.getSetting('tweaks', {})
      needsSet = False
      
      for key in self.defualts:
        if key not in tweaks:
          tweaks[key] = self.defualts[key]
          needsSet = True

      if needsSet:
        self.settingsManager.setTweakSettings('tweaks', tweaks)
      
      log(f"Shortcuts loaded from settings. Shortcuts: {json.dumps(self.settingsManager.getSetting('tweaks', {}))}")

    pass

  async def _unload(self):
    pass
