import { ServerAPI } from "decky-frontend-lib";
import { GameStatusTweak } from "./tweaks/GameStatusTweak";


export class TweakEngineManager {
    static initialized = false;

    static tweaks:Map<string, Tweak<ServerAPI>> = new Map<string, Tweak<ServerAPI>>([
        ['Game-Download-Status', new GameStatusTweak()],
    ]);

    private static server:ServerAPI;

    static setServer(server:ServerAPI) {
        this.server = server;
    }

    static async enableSetting(setting:string) {
        const tweak = this.tweaks.get(setting);
        
        if (tweak) {
            await tweak.init(TweakEngineManager.server);
        } else {
            throw new Error("Provided setting does not exist");
        }
    }

    static disableSetting(setting:string) {
        const tweak = this.tweaks.get(setting);
        
        if (tweak) {
            tweak.onDismount();
        } else {
            throw new Error("Provided setting does not exist");
        }
    }

    static async init(settings:Settings) {
        for (const kvp of TweakEngineManager.tweaks) {
            const tweak = kvp[1];
            if (settings[kvp[0]]) {
                await tweak.init(TweakEngineManager.server);
            }
        }
        TweakEngineManager.initialized = true;
    }

    static onDismount() {
        for (const kvp of TweakEngineManager.tweaks) {
            const tweak = kvp[1];
            tweak.onDismount();
        }
    }
}