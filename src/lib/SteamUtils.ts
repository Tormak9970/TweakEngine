import { sleep } from "decky-frontend-lib";
import { SteamClient } from "./SteamClient";

//? Credit to FrogTheFrog for some of the methods: https://github.com/FrogTheFrog/SDH-MoonDeck/blob/main/src/lib/steamutils.ts

declare global {
    var SteamClient: SteamClient;
}

export class SteamUtils {
    private static hasLoggedIn = false;
    private static hasLoggedOut = false;

    static async getShortcuts(): Promise<SteamShortcut[]> {
        const res = await SteamClient.Apps.GetAllShortcuts();
        return res as SteamShortcut[];
    }
    
    static async getShortcut(appName:string): Promise<SteamShortcut|undefined> {
        const res = await SteamClient.Apps.GetAllShortcuts();
        const shortcutsList = res as SteamShortcut[];

        return shortcutsList.find((s:SteamShortcut) => s.data.strAppName == appName);
    }

    static async getAppOverview(appId: number) {
        const { appStore } = (window as any);
        return appStore.GetAppOverviewByAppID(appId) as SteamAppOverview | null;
    }

    static async waitForAppOverview(appId: number, predicate: (overview: SteamAppOverview | null) => boolean) {
        let retries = 4;
        while (retries--) {
            if (predicate(await this.getAppOverview(appId))) {
                return true;
            }
            if (retries > 0) {
                await sleep(250);
            }
        }

        return false;
    }

    static async getAppDetails(appId: number): Promise<SteamAppDetails | null> {
        return new Promise((resolve) => {
            const { unregister } = SteamClient.Apps.RegisterForAppDetails(appId, (details: any) => {
                unregister();
                resolve(details.unAppID === undefined ? null : details);
            });
        });
    }

    static async waitForAppDetails(appId: number, predicate: (details: SteamAppDetails | null) => boolean) {
        let retries = 4;
        while (retries--) {
            if (predicate(await this.getAppDetails(appId))) {
                return true;
            }
            if (retries > 0) {
                await sleep(250);
            }
        }

        return false;
    }

    static async hideApp(appId: number) {
        if (!await this.waitForAppOverview(appId, (overview) => overview !== null)) {
            console.error(`Could not hide app ${appId}!`);
            return false;
        }

        const { collectionStore } = (window as any);
        if (collectionStore.BIsHidden(appId)) {
            return true;
        }

        collectionStore.SetAppsAsHidden([appId], true);

        let retries = 4;
        while (retries--) {
            if (collectionStore.BIsHidden(appId)) {
                return true;
            }
            if (retries > 0) {
                await sleep(250);
            }
        }

        return false;
    }

    static async addShortcut(appName: string, execPath: string, hideShortcut: boolean) {
        console.log(`Adding shortcut for ${appName}.`);

        const appId = await SteamClient.Apps.AddShortcut(appName, execPath) as number | undefined | null;
        if (typeof appId === "number") {
            if (await this.waitForAppOverview(appId, (overview) => overview !== null)) {
                const overview = await this.getAppOverview(appId);
                if (overview && overview.display_name == appName) {
                    if (hideShortcut) {
                        await this.hideApp(appId);
                    }
                    return appId;
                }
            }
            
            // necessary cleanup to avoid duplicates, which is very BAD (Steam goes bonkers)
            await SteamUtils.removeShortcut(appId as number);
        }

        console.error(`Could not add shortcut for ${appName}!`);
        return null;
    }

    static async setShortcutExe(appId: number, exePath: string) {
        const details = await this.waitForAppDetails(appId, (details) => details !== null) ? await this.getAppDetails(appId) : null;
        if (!details) {
            console.error(`Could not set exe path for ${appId} (does not exist)!`);
            return false;
        }

        if (details.strShortcutExe == `\"${exePath}\"` || details.strShortcutExe == exePath) {
            return true;
        }

        SteamClient.Apps.SetShortcutExe(appId, exePath);
        if (!await this.waitForAppDetails(appId, (details) => details !== null && (details.strShortcutExe == `\"${exePath}\"` || details.strShortcutExe == exePath))) {
            console.error(`Could not exe path for ${appId}!`);
            return false;
        }
        return true;
    }

    static async setShortcutStartDir(appId: number, startDir: string) {
        const details = await this.waitForAppDetails(appId, (details) => details !== null) ? await this.getAppDetails(appId) : null;
        if (!details) {
            console.error(`Could not set start dir for ${appId} (does not exist)!`);
            return false;
        }

        if (details.strShortcutStartDir == `\"${startDir}\"` || details.strShortcutStartDir == startDir) {
            return true;
        }

        SteamClient.Apps.SetShortcutStartDir(appId, startDir);
        if (!await this.waitForAppDetails(appId, (details) => details !== null && (details.strShortcutStartDir == `\"${startDir}\"` || details.strShortcutStartDir == startDir))) {
            console.error(`Could not start dir for ${appId}!`);
            return false;
        }
        return true;
    }

    static async removeShortcut(appId: number) {
        const overview = await this.waitForAppOverview(appId, (overview) => overview !== null) ? await this.getAppOverview(appId) : null;
        if (!overview) {
            console.warn(`Could not remove shortcut for ${appId} (does not exist)!`);
            return true;
        }

        const { collectionStore } = (window as any);
        const collections = collectionStore.userCollections;

        console.log(`Removing shortcut for ${appId}.`);
        SteamClient.Apps.RemoveShortcut(appId);
        for (const collection of collections) {
            if (collection.bAllowsDragAndDrop && collection.apps.has(appId)) {
                console.log(`Removing ${appId} from ${collection}`);
                collection.AsDragDropCollection().RemoveApps([overview]);
            }
        }

        if (!await this.waitForAppOverview(appId, (overview) => overview === null)) {
            console.error(`Could not remove shortcut for ${appId}!`);
            return false;
        }

        return true;
    }

    static async setAppLaunchOptions(appId: number, options: string) {
        const details = await this.waitForAppDetails(appId, (details) => details !== null) ? await this.getAppDetails(appId) : null;
        if (!details) {
            console.error(`Could not add launch options for ${appId} (does not exist)!`);
            return false;
        }

        if (details.strLaunchOptions === options) {
            return true;
        }

        SteamClient.Apps.SetAppLaunchOptions(appId, options);
        if (!await this.waitForAppDetails(appId, (details) => details !== null && details.strLaunchOptions === options)) {
            console.error(`Could not add launch options for ${appId}!`);
            return false;
        }
        return true;
    }

    static async getGameId(appId: number) {
        const overview = await this.waitForAppOverview(appId, (overview) => overview !== null) ? await this.getAppOverview(appId) : null;
        if (!overview) {
            console.error(`Could not get game id for ${appId}!`);
            return null;
        }

        return overview.gameid;
    }

    static registerForGameLifetime(callback: (data: LifetimeNotification) => void) {
        const { unregister } = SteamClient.GameSessions.RegisterForAppLifetimeNotifications(callback);
        return unregister as () => void;
    }

    static async waitForGameLifetime(appId: number | null, options: { initialTimeout?: number, waitForStart?: boolean, waitUntilNewEnd?: boolean } = {}) {
        return new Promise<boolean>((resolve) => {
            let timeoutId: any = null;
            let startAwaited: boolean = false;
            const unregister = this.registerForGameLifetime((data: LifetimeNotification) => {
                if (appId !== null && data.unAppID !== appId) {
                    return;
                }

                if (!startAwaited) {
                    startAwaited = data.bRunning;
                }

                if (options.waitForStart && !startAwaited) {
                    return;
                }

                if (timeoutId !== null) {
                    clearTimeout(timeoutId);
                    timeoutId = null;
                }

                if (options.waitUntilNewEnd) {
                    if (!startAwaited || data.bRunning) {
                        return;
                    }
                }

                unregister();
                resolve(true);
            });

            if (options.initialTimeout) {
                timeoutId = setTimeout(() => {
                    unregister();
                    resolve(false);
                }, options.initialTimeout);
            }
        });
    }

    static async runGame(appId: number, waitUntilGameStops: boolean) {
        console.log(`Trying to launch app ${appId}.`);

        // Currently Steam fails to properly set appid for non-Steam games :/
        const gameStart = this.waitForGameLifetime(null, { initialTimeout: 1500, waitForStart: true, waitUntilNewEnd: waitUntilGameStops });
        const gameId = await this.getGameId(appId);
        SteamClient.Apps.RunGame(gameId, "", -1, 100);
        return await gameStart;
    }

    static async terminateGame(appId: number) {
        console.log(`Trying to terminate app ${appId}.`);

        // Currently Steam fails to properly set appid for non-Steam games :/
        const gameEnd = this.waitForGameLifetime(null, { initialTimeout: 1500, waitForStart: false, waitUntilNewEnd: true });
        const gameId = await this.getGameId(appId);
        SteamClient.Apps.TerminateApp(gameId, false);
        return await gameEnd;
    }

    static registerForAuthStateChange(onLogin:(() => Promise<void>)|null, onLogout:(() => Promise<void>)|null, once:boolean): {unregister:()=>void} {
        return SteamClient.User.RegisterForLoginStateChange(async (e: string) => {
            console.log("Auth state changed. Event data:", e)
            const isLoggedIn = e !== "";
            if (isLoggedIn && (once ? !SteamUtils.hasLoggedIn : true)) {
                SteamUtils.hasLoggedIn = true;
                if (onLogin) await onLogin();
            } else if (!isLoggedIn && (once ? !SteamUtils.hasLoggedOut : true)) {
                SteamUtils.hasLoggedOut = true;
                if (onLogout) await onLogout();
            }
        });
    }

    static restartClient() {
        SteamClient.User.StartRestart();
    }
}