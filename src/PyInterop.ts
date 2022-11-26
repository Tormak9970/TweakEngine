import { ServerAPI, ServerResponse } from "decky-frontend-lib";

export class PyInterop {
    private static serverAPI:ServerAPI;

    static setServer(serv:ServerAPI) {
        this.serverAPI = serv;
    }

    static get server() { return this.serverAPI; }

    static async getSettings(): Promise<ServerResponse<Settings>> {
        return await this.serverAPI.callPluginMethod<{}, Settings>("getSettings", {});
    }
    static async setSettings(settings:Settings): Promise<ServerResponse<Settings>> {
        return await this.serverAPI.callPluginMethod<{settings:Settings}, Settings>("setSettings", { settings: settings });
    }

    static toast(title: string, message: string) {
        return (() => {
            try {
                return this.serverAPI.toaster.toast({
                    title: title,
                    body: message,
                    duration: 8000,
                });
            } catch (e) {
                console.log("Toaster Error", e);
            }
        })();
    }
}