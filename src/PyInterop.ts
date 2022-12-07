import { ServerAPI, ServerResponse } from "decky-frontend-lib";

/**
 * The interop layer between the frontend and backend
 */
export class PyInterop {
    private static serverAPI:ServerAPI;

    /**
     * Sets the app's serverAPI.
     * @param serv The serverAPI object for this plugin.
     */
    static setServer(serv:ServerAPI) {
        this.serverAPI = serv;
    }

    /**
     * Returns the app's serverAPI.
     */
    static get server() { return this.serverAPI; }

    /**
     * Gets the app's settings.
     * @returns The app's settings object.
     */
    static async getSettings(): Promise<ServerResponse<Settings>> {
        return await this.serverAPI.callPluginMethod<{}, Settings>("getSettings", {});
    }

    /**
     * Updates the app's settings with the provided settings.
     * @param settings The settings object to save.
     * @returns The updated settings object.
     */
    static async setSettings(settings:Settings): Promise<ServerResponse<Settings>> {
        return await this.serverAPI.callPluginMethod<{settings:Settings}, Settings>("setSettings", { settings: settings });
    }

    /**
     * Displays a toast with the provided title and message.
     * @param title The title to display on the toast.
     * @param message The message to display on the toast.
     */
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