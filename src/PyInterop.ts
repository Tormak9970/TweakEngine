import { ServerAPI, ServerResponse } from "decky-frontend-lib";

/**
 * The interop layer between the frontend and backend
 */
export class PyInterop {
    private static serverAPI: ServerAPI;

    /**
     * Sets the app's serverAPI.
     * @param serv The serverAPI object for this plugin.
     */
    static setServer(serv: ServerAPI) {
        this.serverAPI = serv;
    }

    /**
     * Returns the app's serverAPI.
     */
    static get server() { return this.serverAPI; }

    /**
     * Gets the tweaks, their descriptions, and wether or not they're enabled.
     * @returns The tweaks.
     */
    static async getTweaks(): Promise<TweakSettings> {
        return await PyInterop.getSetting<TweakSettings>("tweaks", {});
    }

    /**
     * Logs a message to bash shortcut's log file and the frontend console.
     * @param message The message to log.
     */
    static async log(message: String): Promise<void> {
        console.log(message);
        await this.serverAPI.callPluginMethod<{ message: String }, boolean>("logMessage", { message: `[front-end]: ${message}` });
    }

    /**
     * Gets the value of a plugin's setting.
     * @param key The key of the setting to get.
     * @param defaultVal The default value of the setting.
     * @returns A promise resolving to the setting's value.
     */
    static async getSetting<T>(key: string, defaultVal: T): Promise<T> {
        return (await this.serverAPI.callPluginMethod<{ key: string, defaultVal: T }, T>("getSetting", { key: key, defaultVal: defaultVal })).result as T;
    }

    /**
     * Sets the value of a plugin's setting.
     * @param key The key of the setting to set.
     * @param newVal The new value for the setting.
     * @returns A void promise resolving once the setting is set.
     */
    static async setSetting<T>(key: string, newVal: T): Promise<ServerResponse<void>> {
        return await this.serverAPI.callPluginMethod<{ key: string, newVal: T }, void>("setSetting", { key: key, newVal: newVal });
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