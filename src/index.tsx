import {
  definePlugin,
  gamepadDialogClasses,
  PanelSection,
  quickAccessControlsClasses,
  ServerAPI,
  staticClasses,
} from "decky-frontend-lib";
import { VFC, Fragment } from "react";
import { FaWrench } from "react-icons/fa";
import { SettingEntr } from "./components/SettingEntr";
import { QoLTweaksManager } from "./lib/QoLTweaksManager";

import { PyInterop } from "./PyInterop";
import { QoLTweaksContextProvider, QoLTweaksState, useQoLTweaksState } from "./state/QoLTweaksState";


const Content: VFC<{ serverAPI: ServerAPI }> = ({}) => {
  const {setSettings, settingsList} = useQoLTweaksState();

  async function reload() {
    await PyInterop.getSettings().then((res) => {
      setSettings(res.result as Settings);
    });
  }
  
  if (settingsList.length === 0) {
    reload();
  }

  return (
    <>
      <style>{`
        .scope {
          width: inherit;
          height: inherit;

          flex: 1 1 1px;
          scroll-padding: 48px 0px;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-content: stretch;
        }
        .scope .${quickAccessControlsClasses.PanelSection} {
          padding: 0px;
        }

        .scope .${gamepadDialogClasses.FieldChildren} {
          margin: 0px 16px;
        }
        
        .scope .${gamepadDialogClasses.FieldLabel} {
          margin-left: 16px;
        }
      `}</style>
      <div className="scope">
        <PanelSection>
          {
            settingsList.map((setting: SettingsEntry) => (
              <SettingEntr setting={setting} />
            ))
          }
        </PanelSection>
      </div>
    </>
  );
};

export default definePlugin((serverApi: ServerAPI) => {
  PyInterop.setServer(serverApi);

  const state = new QoLTweaksState();
  QoLTweaksManager.setServer(serverApi);
  
  QoLTweaksManager.init();

  return {
    title: <div className={staticClasses.Title}>QoL Tweaks</div>,
    content: (
      <QoLTweaksContextProvider qoLTweaksStateClass={state}>
        <Content serverAPI={serverApi} />
      </QoLTweaksContextProvider>
    ),
    icon: <FaWrench />,
    onDismount() {
      QoLTweaksManager.onDismount();
    },
    alwaysRender: true
  };
});
