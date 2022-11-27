import { afterPatch, Router, ServerAPI } from "decky-frontend-lib";
import { ReactElement } from "react";

export class GameStatusTweak implements Tweak<ServerAPI> {
    serverAPI!: ServerAPI;
    // /library/home
    // /library - inject into the modal that gets opened
    private routePath = "/library/home";
    private routerPatch:any;

    async init(serverAPI:ServerAPI) {
        this.serverAPI = serverAPI;
        this.routerPatch = this.serverAPI.routerHook.addPatch(this.routePath, (routeProps: { path: string; children: ReactElement }) => {
            afterPatch(routeProps.children.props, "renderFunc", (_args: any[], ret:ReactElement) => {
                console.log("Args:", _args);
                console.log(ret);

                

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