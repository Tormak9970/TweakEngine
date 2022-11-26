import { ServerAPI } from "decky-frontend-lib";
import { GameStatusTweak } from "./tweaks/GameStatusTweak";


export class QoLTweaksManager {
    static tweaks:Tweak<ServerAPI>[] = [
        new GameStatusTweak(),
    ];

    private static server:ServerAPI;

    static setServer(server:ServerAPI) {
        this.server = server;
    }

    static async init() {
        for (let i = 0; i < QoLTweaksManager.tweaks.length; i++) {
            const tweak = QoLTweaksManager.tweaks[i];
            await tweak.init(this.server);
        }
    }

    static onDismount() {
        for (let i = 0; i < QoLTweaksManager.tweaks.length; i++) {
            const tweak = QoLTweaksManager.tweaks[i];
            tweak.onDismount();
        }
    }
}