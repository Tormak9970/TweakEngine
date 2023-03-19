interface Tweak<T> {
    serverAPI:T,
    async init:(serverAPI:T) => Promise<void>,
    onDismount:() => void
}

type Application = {
    name: string,
    icon: string,
    path: string
}

type TweakSettings = {
    [key:string]:TweakSetting
}

type TweakSetting = {
    name:string,
    description:string,
    enabled:boolean
}