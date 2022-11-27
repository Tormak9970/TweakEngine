import { ServerAPI } from "decky-frontend-lib";
import { GameStatusTweak } from "./tweaks/GameStatusTweak";


export class TweakEngineManager {
    static tweaks:Tweak<ServerAPI>[] = [
        new GameStatusTweak(),
    ];

    private static server:ServerAPI;

    static setServer(server:ServerAPI) {
        this.server = server;
    }

    static async init() {
        for (let i = 0; i < TweakEngineManager.tweaks.length; i++) {
            const tweak = TweakEngineManager.tweaks[i];
            await tweak.init(TweakEngineManager.server);
        }
    }

    static onDismount() {
        for (let i = 0; i < TweakEngineManager.tweaks.length; i++) {
            const tweak = TweakEngineManager.tweaks[i];
            tweak.onDismount();
        }
    }
}