import { createContext, FC, useContext, useEffect, useState } from "react";

interface PublicTweakEngineState {
    tweakSettings: TweakSettings;
    tweakSettingsList: TweakSetting[];
}

interface PublicTweakEngineContext extends PublicTweakEngineState {
    setTweakSettings(tweakSettings: TweakSettings): void;
}

export class TweakEngineState {
    private tweakSettings: TweakSettings = {};
    private tweakSettingsList: TweakSetting[] = [];

    public eventBus = new EventTarget();

    getPublicState() {
        return {
            "tweakSettings": this.tweakSettings,
            "tweakSettingsList": this.tweakSettingsList
        }
    }

    setTweakSettings(tweakSettings: TweakSettings) {
        this.tweakSettings = tweakSettings;
        this.tweakSettingsList = [];

        Object.values(tweakSettings).map((val) => {
            this.tweakSettingsList.push(val)
        })

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

    const setTweakSettings = (tweakSettings: TweakSettings) => {
        TweakEngineStateClass.setTweakSettings(tweakSettings);
    }

    return (
        <TweakEngineContext.Provider
            value={{
                ...publicState,
                setTweakSettings
            }}
        >
            {children}
        </TweakEngineContext.Provider>
    )
}