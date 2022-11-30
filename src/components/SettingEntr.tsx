import { Field, Focusable, gamepadDialogClasses, Toggle } from "decky-frontend-lib";
import { Fragment } from "react";
import { useTweakEngineState } from "../state/TweakEngineState";
import { PyInterop } from "../PyInterop";
import { TweakEngineManager } from "../lib/TweakEngineManager";

export type SettingEntrProps = {
    setting: SettingsEntry
}

export function SettingEntr(props: SettingEntrProps) {
    const {settings, setSettings} = useTweakEngineState();

    async function updateSetting(checked:boolean) {
        const settingName = props.setting.setting;
        const settingsCop = {...settings};
        settingsCop[settingName] = checked;

        if (checked) {
            await TweakEngineManager.enableSetting(settingName);
        } else {
            TweakEngineManager.disableSetting(settingName);
        }

        setSettings(settingsCop);
        await PyInterop.setSettings(settingsCop);
    }

    return (
        <>
            <style>
                {`
                    .custom-buttons {
                        width: inherit;
                        height: inherit;
                        display: inherit;
                    }

                    .custom-buttons .${gamepadDialogClasses.FieldChildren} {
                        margin: 0px 16px;
                    }
                `}
            </style>
            <div className="custom-buttons">
                <Field label={props.setting.setting.replace("-", " ")}>
                    <Focusable style={{ display: "flex", width: "100%" }}>
                        <Toggle value={props.setting.enabled} onChange={updateSetting} />
                    </Focusable>
                </Field>
            </div>
        </>
    );
}