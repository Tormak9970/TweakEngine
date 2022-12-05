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
import { TweakEngineManager } from "./lib/TweakEngineManager";

import { PyInterop } from "./PyInterop";
import { TweakEngineContextProvider, TweakEngineState, useTweakEngineState } from "./state/TweakEngineState";


const Content: VFC<{ serverAPI: ServerAPI }> = ({}) => {
  const {setSettings, settingsList} = useTweakEngineState();

  async function reload() {
    await PyInterop.getSettings().then((res) => {
      setSettings(res.result as Settings);
    });
  }
  
  if (settingsList.length == 0) {
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
            settingsList.length > 0 ? (
              settingsList.map((setting: Setting) => (
                <SettingEntr setting={setting} />
              ))
            ) : (
              <div>Loading...</div>
            )
          }
        </PanelSection>
      </div>
    </>
  );
};

export default definePlugin((serverApi: ServerAPI) => {
  PyInterop.setServer(serverApi);

  const state = new TweakEngineState();
  TweakEngineManager.setServer(serverApi);

  PyInterop.getSettings().then(async (res) => {
    if (!TweakEngineManager.initialized) {
      await TweakEngineManager.init(res.result as Settings);
    }
  });

  return {
    title: <div className={staticClasses.Title}>Tweak Engine</div>,
    content: (
      <TweakEngineContextProvider TweakEngineStateClass={state}>
        <Content serverAPI={serverApi} />
      </TweakEngineContextProvider>
    ),
    icon: <FaWrench />,
    onDismount() {
      TweakEngineManager.onDismount();
    },
    alwaysRender: false
  };
});
