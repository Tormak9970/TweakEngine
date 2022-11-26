import { Field, Focusable, gamepadDialogClasses, Toggle } from "decky-frontend-lib";
import { Fragment } from "react";
import { useQoLTweaksState } from "../state/QoLTweaksState";
import { PyInterop } from "../PyInterop";

export type SettingEntrProps = {
    setting: SettingsEntry
}

export function SettingEntr(props: SettingEntrProps) {
    const {settings, setSettings} = useQoLTweaksState();

    async function updateSetting(checked:boolean) {
        const settingsCop = {...settings};
        settingsCop[props.setting.setting] = checked;
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
                <Field label={props.setting.setting}>
                    <Focusable style={{ display: "flex", width: "100%" }}>
                        <Toggle value={props.setting.enabled} onChange={updateSetting} />
                    </Focusable>
                </Field>
            </div>
        </>
    );
}