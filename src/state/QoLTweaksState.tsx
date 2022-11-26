import { createContext, FC, useContext, useEffect, useState } from "react";

interface PublicQoLTweaksState {
    settings: Settings;
    settingsList: SettingsEntry[];
    isRunning: boolean;
}

interface PublicQoLTweaksContext extends PublicQoLTweaksState {
    setSettings(settings: Settings): void;
    setIsRunning(value: boolean): void;
}

export class QoLTweaksState {
    private settings: Settings = {};
    private settingsList: SettingsEntry[] = [];
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
            this.settingsList.push({
                "setting": key,
                "enabled": val
            })
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

const QoLTweaksContext = createContext<PublicQoLTweaksContext>(null as any);
export const useQoLTweaksState = () => useContext(QoLTweaksContext);

interface ProviderProps {
    qoLTweaksStateClass: QoLTweaksState
}

export const QoLTweaksContextProvider: FC<ProviderProps> = ({
    children,
    qoLTweaksStateClass
}) => {
    const [publicState, setPublicState] = useState<PublicQoLTweaksState>({
        ...qoLTweaksStateClass.getPublicState()
    });

    useEffect(() => {
        function onUpdate() {
            setPublicState({ ...qoLTweaksStateClass.getPublicState() });
        }

        qoLTweaksStateClass.eventBus
            .addEventListener("stateUpdate", onUpdate);

        return () => {
            qoLTweaksStateClass.eventBus
                .removeEventListener("stateUpdate", onUpdate);
        }
    }, []);

    const setSettings = (settings: Settings) => {
        qoLTweaksStateClass.setSettings(settings);
    }

    const setIsRunning = (value: boolean) => {
        qoLTweaksStateClass.setIsRunning(value);
    }

    return (
        <QoLTweaksContext.Provider
            value={{
                ...publicState,
                setSettings,
                setIsRunning
            }}
        >
            {children}
        </QoLTweaksContext.Provider>
    )
}