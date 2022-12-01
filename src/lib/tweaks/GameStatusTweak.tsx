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
        <svg style={{ width: "20px", height: "20px" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none">
            <path d="M6 33V3L32 18L6 33Z" fill="currentColor" />
        </svg>
    );
    
    private notPlayable = (
        <svg style={{ width: "20px", height: "20px" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M29 23V27H7V23H2V32H34V23H29Z" fill="currentColor" />
            <svg x="0" y="0" width="32" height="25">
                <path className="DownloadArrow" d="M20 14.1716L24.5858 9.58578L27.4142 12.4142L18 21.8284L8.58582 12.4142L11.4142 9.58578L16 14.1715V2H20V14.1716Z" fill="currentColor" />
            </svg>
        </svg>
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
                        // const onShowTab = ret3.props.children?.props.onShowTab
                        const tabs = ret3.props.children?.props.tabs as SteamTab[];

                        const tab = tabs.find((tab:any) => tab.id == cTab) as SteamTab;
                        const collection = tab.content.props.collection as SteamCollection;

                        if (!this.patchTracker.has(collection.id)) {
                            this.patchTracker.set(collection.id, false);
                            wrapReactType(tab.content.type);
                            afterPatch(tab.content, "type", (_: Record<string, unknown>[], ret4:ReactElement) => {
                                const tarElem = ret4.props.children[1] as ReactElement;
                                // const appOverviews = tarElem.props.appOverviews as SteamAppOverview[];

                                wrapReactType(tarElem.type);
                                afterPatch(tarElem, "type", (_: Record<string, unknown>[], ret5:ReactElement) => {
                                    const tarElem2 = ret5.props.children as ReactElement;
                                    // const childSections = tarElem2.childSections;

                                    wrapReactType(tarElem2.type);
                                    afterPatch(tarElem2, "type", (_: Record<string, unknown>[], ret6:ReactElement) => {
                                        const tarElem3 = ret6.props.children[0].props.children[0] as ReactElement;
                                        // const children = tarElem3.props.children;
                                        const collectionId = tarElem3.props.strCollectionId;

                                        if (!this.patchTracker.get(collectionId)) {
                                            wrapReactClass(tarElem3);
                                            // @ts-ignore
                                            afterPatch(tarElem3.type.prototype.__proto__, "render", (_: Record<string, unknown>[], ret7:ReactElement) => {
                                                if (!this.patchTracker.get(collectionId)) {
                                                    const gameElemList = ret7.props.children[1].props.childElements as ReactElement[];
                                                    const collectionLength = gameElemList.length;
        
                                                    for (let i = 0; i < collectionLength; i++) {
                                                        const gameElem = gameElemList[i];
                                                        const app:SteamAppOverview = gameElem.props.children.props.app;
                                                        const isDownloaded = app.size_on_disk != undefined;

                                                        afterPatch(gameElem.props.children.type, "type", (_: Record<string, unknown>[], ret8:ReactElement) => {
                                                            if (!this.patchTracker.get(collectionId)) {
                                                                // console.log(`Library level 8 index ${i}:`, ret8);

                                                                const tarElemList = ret8.props.children.props.children[0].props.children.props.children as ReactElement[];
                                                                let tarElem4: ReactElement | null;
                                                                if (tarElemList.length == 6) {
                                                                    tarElem4 = tarElemList[5];
                                                                } else {
                                                                    tarElem4 = null;
                                                                    console.log("Not a Steam game");
                                                                    // maybe add it with the question mark status?
                                                                }

                                                                if (tarElem4) {
                                                                    afterPatch(tarElem4, "type", (_: Record<string, unknown>[], ret9:ReactElement) => {
                                                                        console.log(`Library level 9 index ${i}:`, ret9);
                                                                            
                                                                        //? Check if we have already patched
                                                                        if (ret9.props.children.length == 2) {
                                                                            ret9.props.children.splice(1, 0, (isDownloaded) ? this.playable : this.notPlayable);
                                                                        } else {
                                                                            console.log(`Unexpected length at ${i}:`, ret9.props.children.length);
                                                                        }
        
                                                                        return ret9;
                                                                    });
                                                                }
                                                            }
        
                                                            if (i+1 == collectionLength) {
                                                                this.patchTracker.set(collectionId, true);
                                                            }
                                                            return ret8;
                                                        });
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