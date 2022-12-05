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

type Settings = {
    [key:string]:Setting
}

type Setting = {
    name:string,
    description:string,
    enabled:boolean
}