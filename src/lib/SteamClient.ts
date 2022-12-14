interface Apps {
    RegisterForAppOverviewChanges:any,
    RegisterForAppDetails:any,
    RegisterForLocalizationChanges:any,
    RegisterForWorkshopChanges:any,
    RegisterForWorkshopItemDownloads:any,
    GetLibraryBootstrapData:any,
    RegisterForAchievementChanges:any,
    GetFriendAchievementsForApp:any,
    GetMyAchievementsForApp:any,
    AddUserTagToApps:any,
    RemoveUserTagFromApps:any,
    ClearUserTagsOnApps:any,
    ClearAndSetUserTagsOnApp:any,
    SetAppHidden:any,
    ResetHiddenState:any,
    SetAppLaunchOptions:any,
    SetAppResolutionOverride:any,
    SetAppCurrentLanguage:any,
    SetAppAutoUpdateBehavior:any,
    SetAppBackgroundDownloadsBehavior:any,
    ToggleAppFamilyBlockedState:any,
    ToggleAppSteamCloudEnabled:any,
    ToggleAppSteamCloudSyncOnSuspendEnabled:any,
    ToggleOverrideResolutionForInternalDisplay:any,
    ToggleEnableSteamOverlayForApp:any,
    ToggleEnableDesktopTheatreForApp:any,
    BrowseLocalFilesForApp:any,
    BrowseScreenshotsForApp:any,
    BrowseScreenshotForApp:any,
    BackupFilesForApp:any,
    VerifyFilesForApp:any,
    CreateDesktopShortcutForApp:any,
    JoinAppContentBeta:any,
    JoinAppContentBetaByPassword:any,
    GetAchievementsInTimeRange:any,
    GetSubscribedWorkshopItems:any,
    SubscribeWorkshopItem:any,
    GetDownloadedWorkshopItems:any,
    DownloadWorkshopItem:any,
    SetLocalScreenshotCaption:any,
    SetLocalScreenshotSpoiler:any,
    GetDetailsForScreenshotUpload:any,
    UploadLocalScreenshot:any,
    DeleteLocalScreenshot:any,
    GetScreenshotsInTimeRange:any,
    GetFriendsWhoPlay:any,
    RequestLegacyCDKeysForApp:any,
    GetSoundtrackDetails:any,
    GetStoreTagLocalization:any,
    GetLaunchOptionsForApp:any,
    GetResolutionOverrideForApp:any,
    ScanForShortcuts:any,
    GetAllShortcuts:any,
    GetShortcutData:any,
    AddShortcut:any,
    RemoveShortcut:any,
    InstallFlatpakAppAndCreateShortcut:any,
    ListFlatpakApps:any,
    UninstallFlatpakApp:any,
    ShowControllerConfigurator:any,
    SetThirdPartyControllerConfiguration:any,
    ToggleAllowDesktopConfiguration:any,
    SetControllerRumblePreference:any,
    GetCachedAppDetails:any,
    SetCachedAppDetails:any,
    ReportLibraryAssetCacheMiss:any,
    SaveAchievementProgressCache:any,
    SetStreamingClientForApp:any,
    SetCustomArtworkForApp:any,
    ClearCustomArtworkForApp:any,
    SetCustomLogoPositionForApp:any,
    ClearCustomLogoPositionForApp:any,
    RequestIconDataForApp:any,
    SpecifyCompatTool:any,
    GetAvailableCompatTools:any,
    SetShortcutName:any,
    SetShortcutExe:any,
    SetShortcutStartDir:any,
    SetShortcutLaunchOptions:any,
    SetShortcutIsVR:any,
    PromptToChangeShortcut:any,
    PromptToSelectShortcutIcon:any,
    InstallApp:any,
    RunGame:any,
    VerifyApp:any,
    StreamGame:any,
    CancelLaunch:any,
    TerminateApp:any,
    UninstallApps:any,
    ShowStore:any,
    SetDLCEnabled:any,
    ContinueGameAction:any,
    CancelGameAction:any,
    GetActiveGameActions:any,
    GetGameActionDetails:any,
    GetGameActionForApp:any,
    SkipShaderProcessing:any,
    MarkEulaAccepted:any,
    MarkEulaRejected:any,
    LoadEula:any,
    GetConflictingFileTimestamps:any,
    GetCloudPendingRemoteOperations:any,
    ClearProton:any,
    RegisterForMarketingMessages:any,
    FetchMarketingMessages:any,
    MarkMarketingMessageSeen:any,
    ReportMarketingMessageSeen:any,
    RegisterForGameActionStart:any,
    RegisterForGameActionEnd:any,
    RegisterForGameActionTaskChange:any,
    RegisterForGameActionUserRequest:any,
    RegisterForGameActionShowError:any,
    RegisterForGameActionShowUI:any,
    OpenAppSettingsDialog:any
}

interface Window {
    RegisterForExternalDisplayChanged:any,
    SetManualDisplayScaleFactor:any,
    SetAutoDisplayScale:any,
    Minimize:any,
    ProcessShuttingDown:any,
    ToggleMaximize:any,
    MoveTo:any,
    ResizeTo:any,
    SetMinSize:any,
    SetResizeGrip:any,
    SetComposition:any,
    GamescopeBlur:any,
    BringToFront:any,
    SetForegroundWindow:any,
    SetKeyFocus:any,
    FlashWindow:any,
    StopFlashWindow:any,
    ShowWindow:any,
    HideWindow:any,
    SetWindowIcon:any,
    GetWindowDimensions:any,
    GetWindowRestoreDetails:any,
    PositionWindowRelative:any,
    GetMousePositionDetails:any,
    IsWindowMinimized:any,
    GetBrowserID:any
}

export interface SteamClient {
    Apps:Apps,
    Browser:any,
    BrowserView:any,
    ClientNotifications:any,
    Cloud:any,
    Console:any,
    Downloads:any,
    FamilySharing:any,
    FriendSettings:any,
    Friends:any,
    GameSessions:any,
    Input:any,
    InstallFolder:any,
    Installs:any,
    MachineStorage:any,
    Messaging:any,
    Notifications:any,
    OpenVR:any,
    Overlay:any,
    Parental:any,
    RegisterIFrameNavigatedCallback:any,
    RemotePlay:any,
    RoamingStorage:any,
    Screenshots:any,
    Settings:any,
    SharedConnection:any,
    Stats:any,
    Storage:any,
    Streaming:any,
    System:any,
    UI:any,
    URL:any,
    Updates:any,
    User:any,
    WebChat:any,
    Window: Window
}