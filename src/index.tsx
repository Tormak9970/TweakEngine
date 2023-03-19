import {
  ButtonItem,
  definePlugin,
  gamepadDialogClasses,
  PanelSection,
  PanelSectionRow,
  quickAccessControlsClasses,
  ServerAPI,
  showModal,
  staticClasses,
} from "decky-frontend-lib";
import { VFC, Fragment, useState } from "react";
import { FaWrench } from "react-icons/fa";
import { AboutModal } from "./components/About";
import { SettingEntr } from "./components/SettingEntr";
import { TweakEngineManager } from "./lib/TweakEngineManager";

import { PyInterop } from "./PyInterop";
import { TweakEngineContextProvider, TweakEngineState, useTweakEngineState } from "./state/TweakEngineState";

const maxAttempts = 4;

const Content: VFC<{ serverAPI: ServerAPI }> = ({}) => {
  const [ numAttempts, setNumAttempts ] = useState(0);
  const {setTweakSettings, tweakSettingsList} = useTweakEngineState();

  async function reload() {
    await PyInterop.getTweaks().then((res) => {
      setTweakSettings(res);
    });
  }
  
  if (tweakSettingsList.length == 0 && numAttempts < maxAttempts) {
    reload();
    setNumAttempts(numAttempts + 1);
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
          <PanelSectionRow>
            <ButtonItem layout="below" onClick={() => {
              showModal(
                // @ts-ignore
                <AboutModal />
              )
            }} >
              About
            </ButtonItem>
          </PanelSectionRow>
          {
            tweakSettingsList.length > 0 ? (
              tweakSettingsList.map((setting: TweakSetting) => (
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

  PyInterop.getTweaks().then(async (res) => {
    if (!TweakEngineManager.initialized) {
      await TweakEngineManager.init(res);
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
