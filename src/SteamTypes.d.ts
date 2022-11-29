type SteamShortcut = {
    appid: number,
    data: {
        bIsApplication:boolean,
        strAppName: string,
        strExePath: string,
        strArguments:string,
        strShortcutPath:string,
        strSortAs:string
    }
}

type LifetimeNotification = {
    unAppID: number; // seems to be 0 for shortcuts :/
    nInstanceID: number;
    bRunning: boolean;
}

type SteamAppAchievements = {
    nAchieved:number
    nTotal:number
    vecAchievedHidden:any[]
    vecHighlight:any[]
    vecUnachieved:any[]
}

type SteamAppLanguages = {
    strDisplayName:string,
    strShortName:string
}

type SteamAppDetails = {
    achievements: SteamAppAchievements,
    bCanMoveInstallFolder:boolean,
    bCloudAvailable:boolean,
    bCloudEnabledForAccount:boolean,
    bCloudEnabledForApp:boolean,
    bCloudSyncOnSuspendAvailable:boolean,
    bCloudSyncOnSuspendEnabled:boolean,
    bCommunityMarketPresence:boolean,
    bEnableAllowDesktopConfiguration:boolean,
    bFreeRemovableLicense:boolean,
    bHasAllLegacyCDKeys:boolean,
    bHasAnyLocalContent:boolean,
    bHasLockedPrivateBetas:boolean,
    bIsExcludedFromSharing:boolean,
    bIsSubscribedTo:boolean,
    bOverlayEnabled:boolean,
    bOverrideInternalResolution:boolean,
    bRequiresLegacyCDKey:boolean,
    bShortcutIsVR:boolean,
    bShowCDKeyInMenus:boolean,
    bShowControllerConfig:boolean,
    bSupportsCDKeyCopyToClipboard:boolean,
    bVRGameTheatreEnabled:boolean,
    bWorkshopVisible:boolean,
    eAppOwnershipFlags:number,
    eAutoUpdateValue:number,
    eBackgroundDownloads:number,
    eCloudSync:number,
    eControllerRumblePreference:number,
    eDisplayStatus:number,
    eEnableThirdPartyControllerConfiguration:number,
    eSteamInputControllerMask:number,
    iInstallFolder:number,
    lDiskUsageBytes:number,
    lDlcUsageBytes:number,
    nBuildID:number,
    nCompatToolPriority:number,
    nPlaytimeForever:number,
    nScreenshots:number,
    rtLastTimePlayed:number,
    rtLastUpdated:number,
    rtPurchased:number,
    selectedLanguage:{
        strDisplayName:string,
        strShortName:string
    }
    strCloudBytesAvailable:string,
    strCloudBytesUsed:string,
    strCompatToolDisplayName:string,
    strCompatToolName:string,
    strDeveloperName:string,
    strDeveloperURL:string,
    strDisplayName:string,
    strExternalSubscriptionURL:string,
    strFlatpakAppID:string,
    strHomepageURL:string,
    strLaunchOptions: string,
    strManualURL:string,
    strOwnerSteamID:string,
    strResolutionOverride:string,
    strSelectedBeta:string,
    strShortcutExe:string,
    strShortcutLaunchOptions:string,
    strShortcutStartDir:string,
    strSteamDeckBlogURL:string,
    unAppID:number,
    vecBetas:any[],
    vecDLC:any[],
    vecDeckCompatTestResults:any[],
    vecLanguages:SteamAppLanguages[],
    vecLegacyCDKeys:any[],
    vecMusicAlbums:any[],
    vecPlatforms:string[],
    vecScreenShots:any[],
}

type SteamAppOverview = {
    gameid: string,
    appid: number,
    display_name: string,
    steam_deck_compat_category: number,
    size_on_disk: string | undefined // can use the type of this to determine if an app is installed!
}