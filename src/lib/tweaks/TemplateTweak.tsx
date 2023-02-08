/**
 * TODO: Describe your tweak here
 * TODO: Add copyright in the form of "Copyright (C) year (your name/username)
 */
 import { ServerAPI } from "decky-frontend-lib";
 
 /**
  * TODO: Describe your tweak here
  */
 export class TemplateTweak implements Tweak<ServerAPI> {
     serverAPI!: ServerAPI;
 
     /**
      * Initializes this Tweak.
      * @param {ServerAPI} serverAPI The app wide serverAPI object
      */
     async init(serverAPI:ServerAPI) {
        this.serverAPI = serverAPI;
     }
 
     /**
      * Clean up logic run when the plugin dismounts.
      */
     onDismount() {
         
     }
 }