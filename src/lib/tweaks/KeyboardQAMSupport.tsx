/**
 * A Tweak for adding support for QAM opening with the keyboard while games are running.
 * Copyright (C) 2023 Travis Lane (Tormak)
 */
import { ServerAPI } from "decky-frontend-lib";

/**
 * A Tweak for displaying if a game is installed in the library tabs.
 */
export class KeyboardQAMTweak implements Tweak<ServerAPI> {
  serverAPI!: ServerAPI;

  async init(serverAPI: ServerAPI): Promise<void> {
    this.serverAPI = serverAPI;
  }

  /**
   * Clean up logic run when the plugin dismounts.
   */
  onDismount() {

  }
}