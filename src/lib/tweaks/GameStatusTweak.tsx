/**
 * A Tweak for displaying a game's download status in the library tabs.
 * Copyright (C) 2022 Travis Lane (Tormak)
 */
import { afterPatch, ServerAPI, wrapReactType, wrapReactClass } from "decky-frontend-lib";
import { ReactElement } from "react";

export class GameStatusTweak implements Tweak<ServerAPI> {
    serverAPI!: ServerAPI;
    // /library/home
    private routePathHome = "/library/home";
    private routerPatchHome:any;
    // /library - inject into the modal that gets opened
    private routePathLib = "/library";
    private routerPatchLib:any;

    private playable = (
        <div className="game-status-tweak" style={{ width: "20px", height: "20px", margin: "0px 3px" }}>
            <svg style={{ width: "20px", height: "20px" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" fill="none">
                <path d="M6 33V3L32 18L6 33Z" fill="currentColor" />
            </svg>
        </div>
    );
    
    private notPlayable = (
        <div className="game-status-tweak" style={{ width: "20px", height: "20px", margin: "0px 3px" }}>
            <svg style={{ width: "20px", height: "20px" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" fill="none">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M29 23V27H7V23H2V32H34V23H29Z" fill="currentColor" />
                <svg x="0" y="0" width="32" height="25">
                    <path className="DownloadArrow" d="M20 14.1716L24.5858 9.58578L27.4142 12.4142L18 21.8284L8.58582 12.4142L11.4142 9.58578L16 14.1715V2H20V14.1716Z" fill="currentColor" />
                </svg>
            </svg>
        </div>
    );

    private patchTracker:Map<string, boolean> = new Map<string, boolean>();

    async init(serverAPI:ServerAPI) {
        this.serverAPI = serverAPI;

        // this.routerPatchHome = this.serverAPI.routerHook.addPatch(this.routePathHome, (routeProps: { path: string; children: ReactElement }) => {
        //     console.log("Route:", routeProps);
            
        //     afterPatch(routeProps.children.props, "renderFunc", (_: Record<string, unknown>[], ret:ReactElement) => {
        //         console.log("Child 1:", ret);

        //         return ret;
        //     });

        //     return routeProps;
        // });

        this.routerPatchLib = this.serverAPI.routerHook.addPatch(this.routePathLib, (routeProps: { path: string; children: ReactElement }) => {
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

                        if (collection.id) {
                            if (!this.patchTracker.has(collection.id)) {
                                this.patchTracker.set(collection.id, false);
                                wrapReactType(tab.content.type);
                                afterPatch(tab.content, "type", (_: Record<string, unknown>[], ret4:ReactElement) => {
                                    const tarElem = ret4.props.children[1] as ReactElement;
    
                                    wrapReactType(tarElem.type);
                                    afterPatch(tarElem, "type", (_: Record<string, unknown>[], ret5:ReactElement) => {
                                        const tarElem2 = ret5.props.children as ReactElement;
                                        // const childSections = tarElem2.childSections;
    
                                        wrapReactType(tarElem2.type);
                                        afterPatch(tarElem2, "type", (_: Record<string, unknown>[], ret6:ReactElement) => {
                                            const tarElem3 = ret6.props.children[0].props.children[0] as ReactElement;
    
                                            if (!this.patchTracker.get(collection.id)) {
                                                wrapReactClass(tarElem3);
                                                // @ts-ignore
                                                afterPatch(tarElem3.type.prototype, "render", (_: Record<string, unknown>[], ret7:ReactElement) => {
                                                    if (!this.patchTracker.get(collection.id)) {
                                                        const gameElemList = ret7.props.children[1].props.childElements as ReactElement[];
                                                        const collectionLength = gameElemList.length;
            
                                                        let index = 0;
                                                        for (const gameElem of gameElemList) {
                                                            const i = index;
                                                            const app:SteamAppOverview = gameElem.props.children.props.app;
                                                            const isDownloaded = app.size_on_disk != undefined;
    
                                                            // wrapReactClass(gameElem); //TODO: figure out why this is need sometimes but breaks others
                                                            // @ts-ignore
                                                            afterPatch(gameElem.type.prototype, "render", (_: Record<string, unknown>[], ret8:ReactElement) => {
                                                                if (!this.patchTracker.get(collection.id)) { //! changed this but it was 'working' before
                                                                    console.log("Game Element", gameElem);
                                                                    console.log(`Library level 8 game ${app.display_name}:`, ret8);
    
                                                                    if (!Array.isArray(ret8)) { // ? commenting out everything inside this seems to make it work when it breaks
                                                                        if (app.store_category.length > 0 || app.store_tag.length > 0) {
                                                                            afterPatch(ret8.type, "type", (_: Record<string, unknown>[], ret9:ReactElement) => {
                                                                                if (!this.patchTracker.get(collection.id)) { //! changed this but it was 'working' before
                                                                                    console.log(`Library level 9 game ${app.display_name}:`, ret9);
                    
                                                                                    // const cachedShouldPatch = !this.patchTracker.get(collection.id);
                                                                                    const tarElemList = ret9.props.children.props.children[0].props.children.props.children as ReactElement[];
                                                                                    afterPatch(tarElemList[5], "type", (_: Record<string, unknown>[], ret10:ReactElement) => {
                                                                                        if (!this.patchTracker.get(collection.id)) { //! changed this but it was 'working' before
                                                                                            console.log(`Library level 10 game ${app.display_name}:`, ret10);
                                                                                            
                                                                                            //? Check if we have already patched
                                                                                            const existIdx = (ret10.props.children as ReactElement[]).findIndex((child:ReactElement) => child.props.className == "game-status-tweak")
                                                                                            if (existIdx == -1) {
                                                                                                console.log("patching...");
                                                                                                ret10.props.children.splice(1, 0, (isDownloaded) ? this.playable : this.notPlayable);
                                                                                            } else {
                                                                                                console.log("overwriting...");
                                                                                                ret10.props.children.splice(existIdx, 1, (isDownloaded) ? this.playable : this.notPlayable);
                                                                                            }
                                                                                        }
                            
                                                                                        return ret10;
                                                                                    });
                                                                                }
                        
                                                                                return ret9;
                                                                            }); 
                                                                        } else {
                                                                            console.log(`${app.display_name} is not a Steam game`);
                                                                        }
                                                                    } else {
                                                                        console.log(`Ret8 was array for game ${app.display_name}`, ret8)
                                                                    }
                                                                }
            
                                                                if (i+1 == collectionLength) {
                                                                    this.patchTracker.set(collection.id, true);
                                                                }
                                                                return ret8;
                                                            });
                                                            index++;
                                                        }
                                                    }
            
                                                    return ret7;
                                                });
                                            }
    
                                            return ret6;
                                        });
    
                                        return ret5;
                                    });
    
                                    return ret4;
                                });
                            }
                        } else {
                            console.log("not a collection view!");
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

    onDismount() {
        if (this.routerPatchHome) {
            this.serverAPI.routerHook.removePatch(this.routePathHome, this.routerPatchHome);
        }
        if (this.routerPatchLib) {
            this.serverAPI.routerHook.removePatch(this.routePathLib, this.routerPatchLib);
        }
    }
}