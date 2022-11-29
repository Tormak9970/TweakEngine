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
    app_type: number,
    gameid: string,
    appid: number,
    display_name: string,
    steam_deck_compat_category: number,
    size_on_disk: string | undefined // can use the type of this to determine if an app is installed!

    // not typed yet
    association: (3) [{…}, {…}, {…}]
    canonicalAppType: number
    controller_support: number
    header_filename: undefined
    icon_data: undefined
    icon_data_format: undefined
    icon_hash: string
    library_capsule_filename: undefined
    library_id: undefined
    local_per_client_data: {}
    m_gameid: undefined
    m_setStoreCategories: Set<number>
    m_setStoreTags: Set<number>
    mastersub_appid: undefined
    mastersub_includedwith_logo: undefined
    metacritic_score: number
    minutes_playtime_forever: number
    minutes_playtime_last_two_weeks: number
    most_available_clientid: string
    most_available_per_client_data: {}
    mru_index: undefined
    optional_parent_app_id: undefined
    owner_account_id: undefined
    per_client_data: [{…}]
    review_percentage_with_bombs: number
    review_percentage_without_bombs: number
    review_score_with_bombs: number
    review_score_without_bombs: number
    rt_custom_image_mtime: undefined
    rt_last_time_locally_played: undefined
    rt_last_time_played: number
    rt_last_time_played_or_installed: number
    rt_original_release_date: number
    rt_purchased_time: number
    rt_recent_activity_time: number
    rt_steam_release_date: number
    rt_store_asset_mtime: number
    selected_clientid: string
    selected_per_client_data: {}
    shortcut_override_appid: undefined
    site_license_site_name: undefined
    sort_as: string
    third_party_mod: undefined
    visible_in_game_list: true
    vr_only: undefined
    vr_supported: undefined
    BHasStoreTag: () => any
    active_beta: (...)
    display_status: (...)
    gameid: (...)
    installed: (...)
    is_available_on_current_platform: (...)
    is_invalid_os_type: (...)
    review_percentage: (...)
    review_score: (...)
    status_percentage: (...)
    store_category: (...)
    store_tag: (...)
}

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