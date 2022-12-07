import { ServerAPI } from "decky-frontend-lib";
import { GameStatusTweak } from "./tweaks/GameStatusTweak";

/**
 * The main manager for all of the plugin's tweaks.
 */
export class TweakEngineManager {
    static initialized = false;

    static tweaks:Map<string, Tweak<ServerAPI>> = new Map<string, Tweak<ServerAPI>>([
        ['Game-Download-Status', new GameStatusTweak()],
    ]);

    private static server:ServerAPI;

    /**
     * Sets the refrence to the app's serverAPI.
     * @param server The app's serverAPI object.
     */
    static setServer(server:ServerAPI) {
        this.server = server;
    }

    /**
     * Enables the desired setting.
     * @param setting The name of the setting to enable.
     */
    static async enableSetting(setting:string) {
        const tweak = this.tweaks.get(setting);

        if (tweak) {
            await tweak.init(TweakEngineManager.server);
        } else {
            throw new Error("Provided setting does not exist");
        }
    }

    /**
     * Disables the desired setting.
     * @param setting The name of the setting to disables.
     */
    static disableSetting(setting:string) {
        const tweak = this.tweaks.get(setting);
        
        if (tweak) {
            tweak.onDismount();
        } else {
            throw new Error("Provided setting does not exist");
        }
    }

    /**
     * Initializes the app's tweaks based on the provided settings.
     * @param settings The app's settings object.
     */
    static async init(settings:Settings) {
        for (const kvp of TweakEngineManager.tweaks) {
            const tweak = kvp[1];
            if (settings[kvp[0]].enabled) {
                await tweak.init(TweakEngineManager.server);
            }
        }
        TweakEngineManager.initialized = true;
    }

    /**
     * Dismounts all tweaks.
     */
    static onDismount() {
        for (const kvp of TweakEngineManager.tweaks) {
            const tweak = kvp[1];
            tweak.onDismount();
        }
    }
}