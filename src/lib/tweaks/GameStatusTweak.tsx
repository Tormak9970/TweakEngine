/**
 * A Tweak for displaying a game's download status in the library tabs.
 * Copyright (C) 2022 Travis Lane (Tormak)
 */
import { afterPatch, ServerAPI, wrapReactType, wrapReactClass } from "decky-frontend-lib";
import { ReactElement } from "react";
import { STEAM_PLAY_COLOR } from "../SteamValues";

type ReactElemType = string | React.JSXElementConstructor<any>
type AppCache = Map<string, any>;
type CollectionCache = {
    level1: ReactElemType | undefined,
    level2: ReactElemType | undefined,
    level3: ReactElemType | undefined,
    gamePatches: Map<string, AppCache>
};

/**
 * A Tweak for displaying if a game is installed in the library tabs.
 */
export class GameStatusTweak implements Tweak<ServerAPI> {
    serverAPI!: ServerAPI;

    // /library - inject into the modal that gets opened
    private routePathLib = "/library";
    private routerPatchLib:any;

    /**
     * The icon for if a game is installed.
     */
    private playable = (
        <div className="game-status-tweak" style={{ width: "20px", height: "20px", margin: "0px 3px", marginRight: "1px" }}>
            <svg style={{ width: "20px", height: "20px", color: STEAM_PLAY_COLOR }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" fill="none">
                <path d="M6 33V3L32 18L6 33Z" fill="currentColor" />
            </svg>
        </div>
    );
    
    /**
     * The icon for if a game is not installed.
     */
    private notPlayable = (
        <div className="game-status-tweak" style={{ width: "20px", height: "20px", margin: "0px 3px", marginRight: "1px" }}>
            <svg style={{ width: "20px", height: "20px" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" fill="none">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M29 23V27H7V23H2V32H34V23H29Z" fill="currentColor" />
                <svg x="0" y="0" width="32" height="25">
                    <path className="DownloadArrow" d="M20 14.1716L24.5858 9.58578L27.4142 12.4142L18 21.8284L8.58582 12.4142L11.4142 9.58578L16 14.1715V2H20V14.1716Z" fill="currentColor" />
                </svg>
            </svg>
        </div>
    );

    private collectionsPatchTracker = new Map<string, CollectionCache>();

    /**
     * Initializes this Tweak.
     * @param {ServerAPI} serverAPI The app wide serverAPI object
     */
    async init(serverAPI:ServerAPI) {
        this.serverAPI = serverAPI;

        this.routerPatchLib = this.serverAPI.routerHook.addPatch(this.routePathLib, (routeProps: { path: string; children: ReactElement }) => {

            this.collectionsPatchTracker = new Map<string, CollectionCache>();

            wrapReactType(routeProps.children.type);
            afterPatch(routeProps.children, "type", (_: Record<string, unknown>[], ret:ReactElement) => {

                wrapReactType(ret.type);
                afterPatch(ret, "type", (_: Record<string, unknown>[], ret2:ReactElement) => {

                    // @ts-ignore
                    wrapReactType(ret2.type.type);
                    afterPatch(ret2.type, "type", (_: Record<string, unknown>[], ret3:ReactElement) => {
                        const cTab = ret3.props.children?.props.activeTab;
                        const tabs = ret3.props.children?.props.tabs as SteamTab[];

                        const tab = tabs.find((tab:any) => tab.id == cTab) as SteamTab;
                        const collection = tab.content.props.collection as SteamCollection;
                        let collectionId = collection?.id;

                        if (collectionId) {
                            if (collectionId != "deck-desktop-apps") {
                                this.collectionsPatchTracker.set(collectionId, {
                                    level1: undefined,
                                    level2: undefined,
                                    level3: undefined,
                                    gamePatches: new Map<string, AppCache>()
                                });
                                
                                wrapReactType(tab.content.type);
                                afterPatch(tab.content, "type", (_: Record<string, unknown>[], ret4:ReactElement) => {
                                    const tarElem = ret4.props.children[1] as ReactElement;
                                    const appOverviews = tarElem.props.appOverviews as SteamAppOverview[];
                                    
                                    for (const appOverview of appOverviews) {
                                        this.collectionsPatchTracker.get(collectionId)?.gamePatches.set(appOverview.display_name, new Map<string, ReactElemType>())
                                    }
    
                                    this.patchCollection(tarElem, collectionId);
        
                                    return ret4;
                                });
                            }
                        } else if (tab.content.props.collectionid) {
                            collectionId = tab.content.props.collectionid;

                            this.collectionsPatchTracker.set(collectionId, {
                                level1: undefined,
                                level2: undefined,
                                level3: undefined,
                                gamePatches: new Map<string, AppCache>()
                            });

                            afterPatch(tab.content, "type", (_: Record<string, unknown>[], ret4:ReactElement) => {
                                const tarElem2 = ret4.props.children[0] as ReactElement;

                                afterPatch(tarElem2, "type", (_: Record<string, unknown>[], ret5:ReactElement) => {
                                    const tarElem3 = ret5.props.children[1] as ReactElement;

                                    afterPatch(tarElem3, "type", (_: Record<string, unknown>[], ret6:ReactElement) => {
                                        const tarElem4 = ret6.props.children[1] as ReactElement;
                                        const appOverviews = tarElem4.props.appOverviews as SteamAppOverview[];
                                        
                                        for (const appOverview of appOverviews) {
                                            this.collectionsPatchTracker.get(collectionId)?.gamePatches.set(appOverview.display_name, new Map<string, ReactElemType>())
                                        }
        
                                        this.patchCollection(tarElem4, collectionId);
            
                                        return ret6;
                                    });
        
                                    return ret5;
                                });
    
                                return ret4;
                            });
                        }

                        return ret3;
                    });

                    return ret2;
                });

                return ret;
            });

            return routeProps;
        });
    }

    /**
     * Patching logic for patching a collection.
     * @param {ReactElement} tarElem The target element.
     * @param {string} collectionId The id of this collection.
     */
    private patchCollection(tarElem:ReactElement, collectionId:string) {
        afterPatch(tarElem, "type", (_: Record<string, unknown>[], ret5:ReactElement) => {
            const tarElem2 = ret5.props.children as ReactElement;
            // const childSections = tarElem2.childSections;

            wrapReactType(tarElem2.type);
            afterPatch(tarElem2, "type", (_: Record<string, unknown>[], ret6:ReactElement) => {
                const tarElem3 = ret6.props.children[0].props.children[0] as ReactElement;

                if (!this.collectionsPatchTracker.get(collectionId)?.level3) {
                    // @ts-ignore
                    this.collectionsPatchTracker.get(collectionId).level3 = tarElem3.type;
                    
                    wrapReactClass(tarElem3);
                    // @ts-ignore
                    afterPatch(tarElem3.type.prototype, "render", (_: Record<string, unknown>[], ret7:ReactElement) => {
                        const gameElemList = ret7.props.children[1].props.childElements as ReactElement[];

                        for (const gameElem of gameElemList) {
                            const app:SteamAppOverview = gameElem.props.children.props.app;
                            this.patchGamePortrait(gameElem, app, collectionId);
                        }

                        return ret7;
                    });
                } else {
                    // @ts-ignore
                    tarElem3.type = this.collectionsPatchTracker.get(collectionId).level3 as ReactElemType;
                }

                return ret6;
            });

            return ret5;
        });
    }

    /**
     * Patching logic for patching a game portrait.
     * @param {ReactElement} gameElem The target element.
     * @param {SteamAppOverview} app The app data for the associated game.
     * @param {string} collectionId The id of this collection.
     */
    private patchGamePortrait(gameElem:ReactElement, app:SteamAppOverview, collectionId:string) {
        const isDownloaded = app.size_on_disk != undefined;
        if (app.store_category.length > 0 || app.store_tag.length > 0) {
            if (!this.collectionsPatchTracker.get(collectionId)?.gamePatches.get(app.display_name)?.has("level1")) {
                this.collectionsPatchTracker.get(collectionId)?.gamePatches.get(app.display_name)?.set("level1", gameElem.type);
                this.collectionsPatchTracker.get(collectionId)?.gamePatches.get(app.display_name)?.delete("level2");
                
                // @ts-ignore
                afterPatch(gameElem.type.prototype, "render", (_: Record<string, unknown>[], ret8:ReactElement) => {
                    if (ret8.type && ret8?.props?.app?.appid) {
                        if (ret8.props.app.appid == app.appid) {
                            afterPatch(ret8.type, "type", (_: Record<string, unknown>[], ret9:ReactElement) => {
                                const tarElemList = ret9.props.children.props.children[0].props.children.props.children as ReactElement[];
                                
                                if ((app.store_category.length > 0 || app.store_tag.length > 0) && (tarElemList[0].props.app.appid == app.appid)) {
                                    afterPatch(tarElemList[5], "type", (_: Record<string, unknown>[], ret10:ReactElement) => {
                                        //? Check if we have already patched
                                        const existIdx = (ret10.props.children as ReactElement[]).findIndex((child:ReactElement) => child.props.className == "game-status-tweak")
                                        
                                        if (existIdx == -1) {
                                            ret10.props.children.splice(0, 0, (isDownloaded) ? this.playable : this.notPlayable);
                                        } else {
                                            ret10.props.children.splice(0, 1, (isDownloaded) ? this.playable : this.notPlayable);
                                        }

                                        return ret10;
                                    });
                                }

                                return ret9;
                            });
                        }
                    }

                    return ret8;
                });
            } else {
                // @ts-ignore
                gameElem.type = this.collectionsPatchTracker.get(collectionId).gamePatches.get(app.display_name).get("level1") as ReactElemType;
            }
        }
    }

    /**
     * Clean up logic run when the plugin dismounts.
     */
    onDismount() {
        if (this.routerPatchLib) {
            this.serverAPI.routerHook.removePatch(this.routePathLib, this.routerPatchLib);
        }
    }
}