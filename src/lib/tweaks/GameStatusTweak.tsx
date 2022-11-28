import { afterPatch, Router, ServerAPI, wrapReactType, staticClasses } from "decky-frontend-lib";
import { ReactElement } from "react";

export class GameStatusTweak implements Tweak<ServerAPI> {
    serverAPI!: ServerAPI;
    // /library/home
    // /library - inject into the modal that gets opened
    private routePath = "/library/home";
    private routerPatch:any;

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
        let isDownloaded = false;
        this.serverAPI = serverAPI;
        this.routerPatch = this.serverAPI.routerHook.addPatch(this.routePath, (routeProps: { path: string; children: ReactElement }) => {
            console.log(routeProps);

            afterPatch(routeProps.children.props, "renderFunc", (_: Record<string, unknown>[], ret:ReactElement) => {
                console.log(ret);

                wrapReactType(ret.props.children);
                afterPatch(ret.props.children.type, 'type', (_2: Record<string, unknown>[], ret2: ReactElement) => {
                    console.log(ret2);
                    // const alreadyShows = Boolean(
                    //     ret2.props?.children?.[1]?.props.children.props.children.find(
                    //         (child: ReactElement) => child?.props?.className === 'protondb-decky-indicator'
                    //     )
                    // );
                    ret2.props.children.splice(0, 0,
                        <div style={{width: "200px", height: "20px", backgroundColor: "red", position: "absolute", top: 0, left: 0, zIndex: 1000}}></div>
                    );
                    // if (!alreadyShows) {
                    //     ret2.props.children.splice(0, 0, isDownloaded ? (this.playable) : (this.notPlayable));
                    // }
                    return ret2
                });

                return ret;
            });

            return routeProps;
        });
    }

    onDismount() {
        if (this.routerPatch) {
            this.serverAPI.routerHook.removePatch(this.routePath, this.routerPatch);
        }
    }
}