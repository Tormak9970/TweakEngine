import { afterPatch, ServerAPI, wrapReactType, wrapReactClass, staticClasses, Router } from "decky-frontend-lib";
import { ReactElement } from "react";

export class GameStatusTweak implements Tweak<ServerAPI> {
    serverAPI!: ServerAPI;
    // /library/home
    private routePathHome = "/library/home";
    private routerPatchHome:any;
    // /library - inject into the modal that gets opened
    private routePathLib = "/library/tab/:tabName";
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

        this.routerPatchHome = this.serverAPI.routerHook.addPatch(this.routePathHome, (routeProps: { path: string; children: ReactElement }) => {
            console.log("Route:", routeProps);

            wrapReactType(routeProps.children.type); // ? this does something
            // afterPatch(routeProps.children.props, "renderFunc", (_: Record<string, unknown>[], ret:ReactElement) => {
            //     console.log("Child 1:", ret);

            //     return ret;
            // });
            // afterPatch(routeProps.children.props, "type", (_: Record<string, unknown>[], ret:ReactElement) => {
            //     console.log("Child 1 type:", ret);

            //     // ret.props.children.splice(0, 0,
            //     //     <div style={{width: "200px", height: "20px", backgroundColor: "red", position: "absolute", top: 0, left: 0, zIndex: 1000}}></div>
            //     // );

            //     return ret;
            // });

            return routeProps;
        });

        this.routerPatchLib = this.serverAPI.routerHook.addPatch(this.routePathLib, (routeProps: { path: string; children: ReactElement }) => {
            console.log("Library Route:", routeProps);

            wrapReactType(routeProps.children.type); // ? this does something
            // ! idk whether to use routeProps.children.props or routeProps.children.type for the afterPatch argument
            afterPatch(routeProps.children.props, "renderFunc", (_: Record<string, unknown>[], ret:ReactElement) => {
                console.log("Library Child 1:", ret);

                return ret;
            });
            afterPatch(routeProps.children.props, "type", (_: Record<string, unknown>[], ret:ReactElement) => {
                console.log("Library Child 1 type:", ret);

                // ret.props.children.splice(0, 0,
                //     <div style={{width: "200px", height: "20px", backgroundColor: "red", position: "absolute", top: 0, left: 0, zIndex: 1000}}></div>
                // );

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