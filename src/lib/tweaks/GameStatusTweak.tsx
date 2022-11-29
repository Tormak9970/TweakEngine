import { afterPatch, ServerAPI, wrapReactType, wrapReactClass, staticClasses } from "decky-frontend-lib";
import { ReactElement } from "react";

type SteamTab = {
    title: string,
    id: string,
    content: ReactElement,
    footer: {
        onOptrionActionsDescription: string,
        onOptionsButtion: () => any,
        onSecondaryActionDescription: ReactElement,
        onSecondaryButton: () => any
    }
}

type SteamCollection = {
    AsDeletableCollection: ()=>null
    AsDragDropCollection: ()=>null
    AsEditableCollection: ()=>null
    GetAppCountWithToolsFilter: (t:any) => any
    allApps: SteamAppOverview[]
    apps: Map<number, SteamAppOverview>
    bAllowsDragAndDrop: boolean
    bIsDeletable: boolean
    bIsDynamic: boolean
    bIsEditable: boolean
    displayName: string
    id: string,
    visibleApps: SteamAppOverview[]
}

export class GameStatusTweak implements Tweak<ServerAPI> {
    serverAPI!: ServerAPI;
    // /library/home
    private routePathHome = "/library/home";
    private routerPatchHome:any;
    // /library - inject into the modal that gets opened
    private routePathLib = "/library";
    private routerPatchLib:any;

    private playable = (
        <div style={{}}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none">
                <path d="M6 33V3L32 18L6 33Z" fill="currentColor" />
            </svg>
        </div>
    );
    
    private notPlayable = (
        <div style={{}}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M29 23V27H7V23H2V32H34V23H29Z" fill="currentColor" />
                <svg x="0" y="0" width="32" height="25">
                    <path className="DownloadArrow" d="M20 14.1716L24.5858 9.58578L27.4142 12.4142L18 21.8284L8.58582 12.4142L11.4142 9.58578L16 14.1715V2H20V14.1716Z" fill="currentColor" />
                </svg>
            </svg>
        </div>
    );

    async init(serverAPI:ServerAPI) {
        this.serverAPI = serverAPI;
        
        let isDownloaded = false;

        // this.routerPatchHome = this.serverAPI.routerHook.addPatch(this.routePathHome, (routeProps: { path: string; children: ReactElement }) => {
        //     console.log("Route:", routeProps);
            
        //     afterPatch(routeProps.children.props, "renderFunc", (_: Record<string, unknown>[], ret:ReactElement) => {
        //         console.log("Child 1:", ret);

        //         return ret;
        //     });

        //     return routeProps;
        // });

        this.routerPatchLib = this.serverAPI.routerHook.addPatch(this.routePathLib, (routeProps: { path: string; children: ReactElement }) => {
            console.log("Library Route:", routeProps);

            wrapReactType(routeProps.children.type);
            afterPatch(routeProps.children, "type", (_: Record<string, unknown>[], ret:ReactElement) => {
                console.log("Library level 1:", ret);

                wrapReactType(ret.type);
                afterPatch(ret, "type", (_: Record<string, unknown>[], ret2:ReactElement) => {
                    console.log("Library level 2:", ret2);

                    // const tabName = ret2.props.tab;
                    // const collectionId = ret2.props.collectionid;
                    // const onShowTab = ret2.props.onShowTab

                    // @ts-ignore
                    wrapReactType(ret2.type.type);
                    afterPatch(ret2.type, "type", (_: Record<string, unknown>[], ret3:ReactElement) => {
                        console.log("Library level 3:", ret3);

                        const cTab = ret3.props.children?.props.activeTab;
                        // const onShowTab = ret3.props.children?.props.onShowTab
                        const tabs = ret3.props.children?.props.tabs as SteamTab[];

                        const tab = tabs.find((tab:any) => tab.id == cTab) as SteamTab;

                        const collection = tab.content.props.collection as SteamCollection;

                        wrapReactType(tab.content.type);
                        afterPatch(tab.content, "type", (_: Record<string, unknown>[], ret4:ReactElement) => {
                            console.log("Library level 4:", ret4);

                            const tarElem = ret4.props.children[1] as ReactElement;

                            // const appOverviews = tarElem.props.appOverviews as SteamAppOverview[];

                            wrapReactType(tarElem.type);
                            afterPatch(tarElem, "type", (_: Record<string, unknown>[], ret5:ReactElement) => {
                                console.log("Library level 5:", ret5);

                                

                                return ret5;
                            });

                            return ret4;
                        });

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