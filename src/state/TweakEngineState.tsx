import { createContext, FC, useContext, useEffect, useState } from "react";

interface PublicTweakEngineState {
    settings: Settings;
    settingsList: Setting[];
    isRunning: boolean;
}

interface PublicTweakEngineContext extends PublicTweakEngineState {
    setSettings(settings: Settings): void;
    setIsRunning(value: boolean): void;
}

export class TweakEngineState {
    private settings: Settings = {};
    private settingsList: Setting[] = [];
    private isRunning: boolean = false;

    public eventBus = new EventTarget();

    getPublicState() {
        return {
            "settings": this.settings,
            "settingsList": this.settingsList,
            "isRunning": this.isRunning
        }
    }

    setSettings(settings: Settings) {
        this.settings = settings;
        this.settingsList = [];

        Object.entries(settings).map(([key, val]) => {
            this.settingsList.push(val)
        })

        this.forceUpdate();
    }

    setIsRunning(value: boolean) {
        this.isRunning = value;
        this.forceUpdate();
    }

    private forceUpdate() {
        this.eventBus.dispatchEvent(new Event("stateUpdate"));
    }
}

const TweakEngineContext = createContext<PublicTweakEngineContext>(null as any);
export const useTweakEngineState = () => useContext(TweakEngineContext);

interface ProviderProps {
    TweakEngineStateClass: TweakEngineState
}

export const TweakEngineContextProvider: FC<ProviderProps> = ({
    children,
    TweakEngineStateClass
}) => {
    const [publicState, setPublicState] = useState<PublicTweakEngineState>({
        ...TweakEngineStateClass.getPublicState()
    });

    useEffect(() => {
        function onUpdate() {
            setPublicState({ ...TweakEngineStateClass.getPublicState() });
        }

        TweakEngineStateClass.eventBus
            .addEventListener("stateUpdate", onUpdate);

        return () => {
            TweakEngineStateClass.eventBus
                .removeEventListener("stateUpdate", onUpdate);
        }
    }, []);

    const setSettings = (settings: Settings) => {
        TweakEngineStateClass.setSettings(settings);
    }

    const setIsRunning = (value: boolean) => {
        TweakEngineStateClass.setIsRunning(value);
    }

    return (
        <TweakEngineContext.Provider
            value={{
                ...publicState,
                setSettings,
                setIsRunning
            }}
        >
            {children}
        </TweakEngineContext.Provider>
    )
}